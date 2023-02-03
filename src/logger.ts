import * as logger from "winston";

const format = logger.format.combine(
  logger.format.timestamp({ format: "DD-MM-YYYY HH:mm:ss:ms" }),
  logger.format.colorize({ all: false }),
  logger.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
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
