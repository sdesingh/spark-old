import winston, { format, transports } from "winston";

export const logger = winston.createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss"
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: "spark.item" },
  transports: [
    new transports.File({ filename: "item.error.log", level: "error" }),
    new transports.File({ filename: "item.combined.log" })
  ]
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple())
    })
  );
}
