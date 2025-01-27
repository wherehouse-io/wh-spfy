import * as logger from "winston";
import requestIdNamespace from "./utils/namespace";

const format = logger.format.combine(
  logger.format.colorize({ all: false }),
  logger.format.printf((info) => {
    const requestId = requestIdNamespace.get('requestId') || "-";
    return `[${requestId}] ${info.level}: ${info.message}`;
  })
);

logger.remove(logger.transports.Console);

logger.addColors({
  debug: "green",
  info: "cyan",
  silly: "magenta",
  warn: "yellow",
  error: "red",
});

logger.configure({
  level: "info",
  format,
  transports: [new logger.transports.Console()],
});

export { logger };
