import { TestBed } from "@angular/core/testing";
import { vi } from "vitest";
import {
  LOG_BACKEND_TRANSPORT,
  MockLogBackendTransport,
  provideWorkshopLogger,
} from "./logger.providers";
import { WorkshopLogger } from "./workshop-logger.service";
import type { LogLevel, LogTarget, WorkshopLoggerConfig } from "./logger.types";

describe("WorkshopLogger", () => {
  const send = vi.fn().mockResolvedValue({ mocked: true, accepted: true });

  function setup(config: Partial<WorkshopLoggerConfig> = {}) {
    TestBed.configureTestingModule({
      providers: [
        provideWorkshopLogger(config),
        { provide: LOG_BACKEND_TRANSPORT, useValue: { send } },
      ],
    });
    return TestBed.inject(WorkshopLogger);
  }

  beforeEach(() => {
    send.mockReset().mockResolvedValue({ mocked: true, accepted: true });
    vi.spyOn(console, "info").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each([
    ["info", "info", "#0284c7"],
    ["warning", "warn", "#b45309"],
    ["error", "error", "#dc2626"],
  ] as const)(
    "formats %s with its severity method and color",
    async (level, method, color) => {
      vi.spyOn(Date.prototype, "toISOString").mockReturnValue(
        "2026-10-23T12:00:00.000Z",
      );
      const data = { nested: { step: 1 } };
      await setup().log(level, "Journey%c", { message: "Loaded %c %s", data });
      expect(console[method]).toHaveBeenCalledWith(
        "%c%s%c\n%s\n%o",
        `color: ${color}; font-weight: bold`,
        `[2026-10-23T12:00:00.000Z] :: [${level.toUpperCase()}] :: [Journey%c]`,
        "",
        "Loaded %c %s",
        data,
      );
      expect(send).not.toHaveBeenCalled();
    },
  );

  it("uses defaults without registering configuration providers", async () => {
    TestBed.configureTestingModule({});
    await TestBed.inject(WorkshopLogger).info("Journey", {
      message: "Started",
    });
    expect(console.info).toHaveBeenCalledWith(
      "%c%s%c\n%s",
      expect.any(String),
      expect.any(String),
      "",
      "Started",
    );
    expect(TestBed.inject(LOG_BACKEND_TRANSPORT)).toBeInstanceOf(
      MockLogBackendTransport,
    );
  });

  it("supports plain message-only output", async () => {
    await setup({ color: false }).warning("Journey", { message: "Retry" });
    expect(console.warn).toHaveBeenCalledWith(
      "%s\n%s",
      expect.stringContaining("[WARNING] :: [Journey]"),
      "Retry",
    );
  });

  it.each([false, 0, "", null, undefined])(
    "preserves data-only payload %s",
    async (data) => {
      await setup().info("Journey", { data });
      expect(console.info).toHaveBeenCalledWith(
        "%c%s%c\n%o",
        expect.any(String),
        expect.any(String),
        "",
        data,
      );
    },
  );

  it("preserves circular data and errors without serializing them", async () => {
    const data: { self?: unknown; error: Error } = {
      error: new Error("Example"),
    };
    data.self = data;
    await setup().error("Journey", { message: "Failure", data });
    expect(vi.mocked(console.error).mock.calls[0]?.at(-1)).toBe(data);
  });

  it("routes backend-only events without console output", async () => {
    const receipt = await setup({ target: "backend" }).info("Journey", {
      data: { step: 1 },
    });
    expect(receipt).toEqual({ mocked: true, accepted: true });
    expect(send).toHaveBeenCalledExactlyOnceWith({
      timestamp: expect.any(String),
      level: "info",
      origin: "Journey",
      data: { step: 1 },
    });
    expect(console.info).not.toHaveBeenCalled();
  });

  it("sends the same timestamp and data to both destinations", async () => {
    const data = { step: 1 };
    await setup().warning("Journey", { message: "Retry", data }, "both");
    const entry = send.mock.calls[0]![0];
    expect(console.warn).toHaveBeenCalledWith(
      "%c%s%c\n%s\n%o",
      expect.any(String),
      `[${entry.timestamp}] :: [WARNING] :: [Journey]`,
      "",
      "Retry",
      data,
    );
    expect(entry.data).toBe(data);
  });

  it("allows a per-call console override of backend configuration", async () => {
    await setup({ target: "backend" }).info(
      "Journey",
      { message: "Local" },
      "console",
    );
    expect(console.info).toHaveBeenCalledOnce();
    expect(send).not.toHaveBeenCalled();
  });

  it.each(["console", "backend", "both"] as LogTarget[])(
    "filters below-threshold events for %s",
    async (target) => {
      expect(
        await setup({ minLevel: "warning", target }).info("Journey", {
          message: "Hidden",
        }),
      ).toBeUndefined();
      expect(console.info).not.toHaveBeenCalled();
      expect(send).not.toHaveBeenCalled();
    },
  );

  it.each(["warning", "error"] as LogLevel[])(
    "allows %s at the warning threshold",
    async (level) => {
      await setup({ minLevel: "warning", target: "backend" }).log(
        level,
        "Journey",
        { message: "Visible" },
      );
      expect(send).toHaveBeenCalledOnce();
    },
  );

  it("filters warnings at the error threshold", async () => {
    await setup({ minLevel: "error", target: "both" }).warning("Journey", {
      message: "Hidden",
    });
    expect(console.warn).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
  });

  it("rejects empty origins before either transport is used", async () => {
    await expect(
      setup().error("  ", { message: "Failure" }, "both"),
    ).rejects.toThrow("origin");
    expect(console.error).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
  });

  it("propagates backend rejection after console output without retrying", async () => {
    send.mockRejectedValueOnce(new Error("Offline"));
    await expect(
      setup().error("Journey", { message: "Failure" }, "both"),
    ).rejects.toThrow("Offline");
    expect(console.error).toHaveBeenCalledOnce();
    expect(send).toHaveBeenCalledOnce();
  });

  it("mock backend acknowledges asynchronously without network access", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockRejectedValue(new Error("Unexpected network"));
    let resolved = false;
    const result = new MockLogBackendTransport()
      .send({ timestamp: "now", level: "info", origin: "Journey" })
      .then((receipt) => {
        resolved = true;
        return receipt;
      });
    expect(resolved).toBe(false);
    await expect(result).resolves.toEqual({ mocked: true, accepted: true });
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
