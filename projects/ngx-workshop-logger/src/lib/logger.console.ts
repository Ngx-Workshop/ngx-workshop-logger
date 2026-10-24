import type { LogEntry, LogLevel } from "./logger.types";

interface TextStyle {
  readonly color?: string;
  readonly fontFamily?: string;
  readonly fontSize?: string;
  readonly fontStyle?: string;
  readonly fontWeight?: string;
  readonly letterSpacing?: string;
  readonly lineHeight?: string;
  readonly padding?: string;
  readonly paddingLeft?: string;
  readonly textDecoration?: string;
  readonly textShadow?: string;
  readonly textTransform?: string;
}

interface ConsoleFragment {
  readonly format: string;
  readonly args: readonly unknown[];
}

export interface ConsoleOutput {
  readonly format: string;
  readonly args: readonly unknown[];
}

const BANNER = String.raw`%c
    _   __
   / | / /___ __  __
  /  |/ / __ ${"`"}/ |/_/_____
 / /|  / /_/ />  </_____/
/_/ |_/\__, /_/|_|
%c _    %c/____/%c          __        __
| |     / /___  _____/ /_______/ /_  ____  ____
| | /| / / __ \/ ___/ //_/ ___/ __ \/ __ \/ __ \
| |/ |/ / /_/ / /  / ,< (__  ) / / / /_/ / /_/ /
|__/|__/\____/_/  /_/|_/____/_/ /_/\____/ .___/
                                       /_/
%c  [ Made with <3 ]
`;

const CONSOLE_THEME = {
  banner: {
    enabled: true,
    format: BANNER,
    styles: [
      {
        color: "#22d3ee",
        fontFamily: "monospace",
        fontWeight: "bold",
        lineHeight: "1.2",
        textShadow: "0 0 8px #22d3ee80",
      },
      {
        color: "#c084fc",
        fontFamily: "monospace",
        fontWeight: "bold",
        lineHeight: "1.2",
        textShadow: "0 0 8px #c084fc80",
      },
      {
        color: "#22d3ee",
        fontFamily: "monospace",
        fontWeight: "bold",
        lineHeight: "1.2",
        textShadow: "0 0 8px #22d3ee80",
      },
      {
        color: "#c084fc",
        fontFamily: "monospace",
        fontWeight: "bold",
        lineHeight: "1.2",
        textShadow: "0 0 8px #c084fc80",
      },
      {
        color: "#ff2d95",
        fontFamily: "monospace",
        fontStyle: "italic",
        lineHeight: "1.2",
        textShadow: "0 0 8px #ff2d9580",
      },
    ] satisfies readonly TextStyle[],
  },
  log: {
    levelColors: {
      info: "#22d3ee",
      warning: "#fff01f",
      error: "#ff2a6d",
    } satisfies Record<LogLevel, string>,
    heading: {
      style: {
        fontSize: "10px",
        fontWeight: "normal",
        padding: "4px 8px",
      } satisfies TextStyle,
      glowRadii: [4, 8],
    },
    brackets: {
      style: {
        fontSize: "10px",
        fontWeight: "bold",
      } satisfies TextStyle,
      openingPaddingLeft: "8px",
    },
    origin: {
      style: {
        color: "#ff2d95",
        fontSize: "10px",
        fontWeight: "normal",
      } satisfies TextStyle,
    },
    message: {
      style: {
        color: "#c084fc",
        fontSize: "10px",
        fontWeight: "bold",
        fontStyle: "italic",
      } satisfies TextStyle,
    },
  },
} as const;

function toCss(style: TextStyle): string {
  return [
    style.color && `color: ${style.color}`,
    style.fontFamily && `font-family: ${style.fontFamily}`,
    style.fontSize && `font-size: ${style.fontSize}`,
    style.fontStyle && `font-style: ${style.fontStyle}`,
    style.fontWeight && `font-weight: ${style.fontWeight}`,
    style.letterSpacing && `letter-spacing: ${style.letterSpacing}`,
    style.lineHeight && `line-height: ${style.lineHeight}`,
    style.padding && `padding: ${style.padding}`,
    style.paddingLeft && `padding-left: ${style.paddingLeft}`,
    style.textDecoration && `text-decoration: ${style.textDecoration}`,
    style.textShadow && `text-shadow: ${style.textShadow}`,
    style.textTransform && `text-transform: ${style.textTransform}`,
  ]
    .filter((declaration): declaration is string => Boolean(declaration))
    .join("; ")
    .concat(";");
}

function text(value: unknown): ConsoleFragment {
  return { format: "%s", args: [value] };
}

function styledText(value: unknown, style: TextStyle): ConsoleFragment {
  return { format: "%c%s%c", args: [toCss(style), value, ""] };
}

function literal(value: string): ConsoleFragment {
  return { format: value, args: [] };
}

function compose(...fragments: readonly ConsoleFragment[]): ConsoleOutput {
  return {
    format: fragments.map((fragment) => fragment.format).join(""),
    args: fragments.flatMap((fragment) => fragment.args),
  };
}

export function createBannerOutput(): ConsoleOutput | undefined {
  if (!CONSOLE_THEME.banner.enabled) return;
  return {
    format: CONSOLE_THEME.banner.format,
    args: CONSOLE_THEME.banner.styles.map(toCss),
  };
}

export function createLogOutput(
  entry: LogEntry,
  colorEnabled: boolean
): ConsoleOutput {
  const heading = `[${entry.level.toUpperCase()}] || [${entry.timestamp}]`;
  const message =
    entry.message === undefined
      ? []
      : [
          literal(": "),
          colorEnabled
            ? styledText(entry.message, CONSOLE_THEME.log.message.style)
            : text(entry.message),
        ];

  if (!colorEnabled) {
    return compose(
      text(heading),
      literal("\n"),
      text(`[${entry.origin}]`),
      ...message
    );
  }

  const levelColor = CONSOLE_THEME.log.levelColors[entry.level];
  const glow = CONSOLE_THEME.log.heading.glowRadii
    .map((radius) => `0 0 ${radius}px ${levelColor}`)
    .join(", ");

  return compose(
    styledText(heading, {
      color: levelColor,
      ...CONSOLE_THEME.log.heading.style,
      textShadow: glow,
    }),
    literal("\n"),
    styledText("[", {
      color: levelColor,
      ...CONSOLE_THEME.log.brackets.style,
      paddingLeft: CONSOLE_THEME.log.brackets.openingPaddingLeft,
    }),
    styledText(entry.origin, CONSOLE_THEME.log.origin.style),
    styledText("]", {
      color: levelColor,
      ...CONSOLE_THEME.log.brackets.style,
    }),
    ...message
  );
}
