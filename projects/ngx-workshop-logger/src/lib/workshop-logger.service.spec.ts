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
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "groupCollapsed").mockImplementation(() => {});
    vi.spyOn(console, "table").mockImplementation(() => {});
    vi.spyOn(console, "groupEnd").mockImplementation(() => {});
    vi.spyOn(console, "info").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each([
    ["info", "#00f5ff"],
    ["warning", "#fff01f"],
    ["error", "#ff2a6d"],
  ] as const)(
    "formats %s as a synthwave group with tabular data",
    async (level, color) => {
      vi.spyOn(Date.prototype, "toISOString").mockReturnValue(
        "2026-10-23T12:00:00.000Z",
      );
      const data = { nested: { step: 1 } };
      await setup().log(level, "Journey%c", { message: "Loaded %c %s", data });
      expect(console.groupCollapsed).toHaveBeenCalledWith(
        "%c%s%c\n%c%s: %s%c",
        `color: ${color}; font-size: 12px; font-weight: normal; padding: 4px 8px; text-shadow: 0 0 4px ${color}, 0 0 8px ${color}`,
        `[12:00:00] :: [${level.toUpperCase()}]`,
        "",
        `color: ${color}`,
        "[Journey%c]",
        "Loaded %c %s",
        "",
      );
      expect(console.table).toHaveBeenCalledExactlyOnceWith(data);
      expect(console.groupEnd).toHaveBeenCalledOnce();
      expect(console.log).not.toHaveBeenCalled();
      expect(console.info).not.toHaveBeenCalled();
      expect(console.warn).not.toHaveBeenCalled();
      expect(console.error).not.toHaveBeenCalled();
      expect(send).not.toHaveBeenCalled();
    },
  );

  it("uses defaults without registering configuration providers", async () => {
    TestBed.configureTestingModule({});
    await TestBed.inject(WorkshopLogger).info("Journey", {
      message: "Started",
    });
    expect(console.log).toHaveBeenCalledWith(
      "%c%s%c\n%c%s: %s%c",
      expect.any(String),
      expect.any(String),
      "",
      "color: #00f5ff",
      "[Journey]",
      "Started",
      "",
    );
    expect(TestBed.inject(LOG_BACKEND_TRANSPORT)).toBeInstanceOf(
      MockLogBackendTransport,
    );
  });

  it("supports plain message-only output", async () => {
    await setup({ color: false }).warning("Journey", { message: "Retry" });
    expect(console.log).toHaveBeenCalledWith(
      "%s\n%s: %s",
      expect.stringMatching(/^\[\d{2}:\d{2}:\d{2}\] :: \[WARNING\]$/),
      "[Journey]",
      "Retry",
    );
  });

  it.each([false, 0, "", null, undefined])(
    "preserves data-only payload %s",
    async (data) => {
      await setup().info("Journey", { data });
      expect(console.groupCollapsed).toHaveBeenCalledWith(
        "%c%s%c\n%c%s%c",
        expect.any(String),
        expect.stringMatching(/^\[\d{2}:\d{2}:\d{2}\] :: \[INFO\]$/),
        "",
        "color: #00f5ff",
        "[Journey]",
        "",
      );
      expect(console.table).toHaveBeenCalledExactlyOnceWith(data);
      expect(console.groupEnd).toHaveBeenCalledOnce();
    },
  );

  it("preserves circular data and errors without serializing them", async () => {
    const data: { self?: unknown; error: Error } = {
      error: new Error("Example"),
    };
    data.self = data;
    await setup().error("Journey", { message: "Failure", data });
    expect(console.table).toHaveBeenCalledExactlyOnceWith(data);
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
    expect(console.log).not.toHaveBeenCalled();
    expect(console.groupCollapsed).not.toHaveBeenCalled();
    expect(console.table).not.toHaveBeenCalled();
  });

  it("sends the same timestamp and data to both destinations", async () => {
    const data = { step: 1 };
    await setup().warning("Journey", { message: "Retry", data }, "both");
    const entry = send.mock.calls[0]![0];
    expect(console.groupCollapsed).toHaveBeenCalledWith(
      "%c%s%c\n%c%s: %s%c",
      expect.any(String),
      `[${entry.timestamp}] :: [WARNING]`,
      "",
      "color: #fff01f",
      "[Journey]",
      "Retry",
      "",
    );
    expect(console.table).toHaveBeenCalledExactlyOnceWith(data);
    expect(entry.data).toBe(data);
  });

  it("allows a per-call console override of backend configuration", async () => {
    await setup({ target: "backend" }).info(
      "Journey",
      { message: "Local" },
      "console",
    );
    expect(console.log).toHaveBeenCalledOnce();
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
      expect(console.log).not.toHaveBeenCalled();
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
    expect(console.log).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
  });

  it("rejects empty origins before either transport is used", async () => {
    await expect(
      setup().error("  ", { message: "Failure" }, "both"),
    ).rejects.toThrow("origin");
    expect(console.log).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
  });

  it("propagates backend rejection after console output without retrying", async () => {
    send.mockRejectedValueOnce(new Error("Offline"));
    await expect(
      setup().error("Journey", { message: "Failure" }, "both"),
    ).rejects.toThrow("Offline");
    expect(console.log).toHaveBeenCalledOnce();
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
