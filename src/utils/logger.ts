import exp from "constants";
import { createLogger, transport, format, transports } from "winston";

const logger =createLogger({
    format: format.combine(
        format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        format.printf(({timestamp, level, message}) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        new transports.File({filename: 'migration.log'}),
    ],
});

export default logger;