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
    const logger = TestBed.inject(WorkshopLogger);
    vi.mocked(console.log).mockClear();
    return logger;
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

  it("prints the workshop banner when constructed", () => {
    TestBed.configureTestingModule({});
    TestBed.inject(WorkshopLogger);

    expect(console.log).toHaveBeenCalledOnce();
    const [banner, ...styles] = vi.mocked(console.log).mock.calls[0]!;
    expect(banner).toEqual(expect.stringContaining("[ Made with <3 ]"));
    expect(styles).toEqual([
      "color: #22d3ee; font-family: monospace; font-weight: bold; line-height: 1.2; text-shadow: 0 0 8px #22d3ee80;",
      "color: #c084fc; font-family: monospace; font-weight: bold; line-height: 1.2; text-shadow: 0 0 8px #c084fc80;",
      "color: #22d3ee; font-family: monospace; font-weight: bold; line-height: 1.2; text-shadow: 0 0 8px #22d3ee80;",
      "color: #c084fc; font-family: monospace; font-weight: bold; line-height: 1.2; text-shadow: 0 0 8px #c084fc80;",
      "color: #ff2d95; font-family: monospace; font-style: italic; line-height: 1.2; text-shadow: 0 0 8px #ff2d9580;",
    ]);
  });

  it.each([
    ["info", "#22d3ee"],
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
        "%c%s%c\n%c%s%c%c%s%c%c%s%c: %c%s%c",
        `color: ${color}; font-size: 10px; font-weight: bold; padding: 4px 8px; text-shadow: 0 0 4px ${color}, 0 0 8px ${color};`,
        `[${level.toUpperCase()}] || [12:00:00]`,
        "",
        `color: ${color}; font-size: 10px; font-weight: bold; padding-left: 8px;`,
        "[",
        "",
        "color: #ff2d95; font-size: 10px; font-weight: bold;",
        "Journey%c",
        "",
        `color: ${color}; font-size: 10px; font-weight: bold;`,
        "]",
        "",
        "color: #c084fc; font-size: 10px; font-weight: normal;",
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
    const logger = TestBed.inject(WorkshopLogger);
    vi.mocked(console.log).mockClear();
    await logger.info("Journey", {
      message: "Started",
    });
    expect(console.log).toHaveBeenCalledWith(
      "%c%s%c\n%c%s%c%c%s%c%c%s%c: %c%s%c",
      expect.any(String),
      expect.any(String),
      "",
      "color: #22d3ee; font-size: 10px; font-weight: bold; padding-left: 8px;",
      "[",
      "",
      "color: #ff2d95; font-size: 10px; font-weight: bold;",
      "Journey",
      "",
      "color: #22d3ee; font-size: 10px; font-weight: bold;",
      "]",
      "",
      "color: #c084fc; font-size: 10px; font-weight: normal;",
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
      expect.stringMatching(/^\[WARNING\] \|\| \[\d{2}:\d{2}:\d{2}\]$/),
      "[Journey]",
      "Retry",
    );
  });

  it.each([false, 0, "", null, undefined])(
    "preserves data-only payload %s",
    async (data) => {
      await setup().info("Journey", { data });
      expect(console.groupCollapsed).toHaveBeenCalledWith(
        "%c%s%c\n%c%s%c%c%s%c%c%s%c",
        expect.any(String),
        expect.stringMatching(/^\[INFO\] \|\| \[\d{2}:\d{2}:\d{2}\]$/),
        "",
        "color: #22d3ee; font-size: 10px; font-weight: bold; padding-left: 8px;",
        "[",
        "",
        "color: #ff2d95; font-size: 10px; font-weight: bold;",
        "Journey",
        "",
        "color: #22d3ee; font-size: 10px; font-weight: bold;",
        "]",
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
      "%c%s%c\n%c%s%c%c%s%c%c%s%c: %c%s%c",
      expect.any(String),
      `[WARNING] || [${entry.timestamp}]`,
      "",
      "color: #fff01f; font-size: 10px; font-weight: bold; padding-left: 8px;",
      "[",
      "",
      "color: #ff2d95; font-size: 10px; font-weight: bold;",
      "Journey",
      "",
      "color: #fff01f; font-size: 10px; font-weight: bold;",
      "]",
      "",
      "color: #c084fc; font-size: 10px; font-weight: normal;",
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
