import { ILogEntry } from "../../Model/ILogEntry";
import { Severity } from "../../Model/Severity";
import { ILogWriter } from "../ILogWriter";

export class ConsoleWriter implements ILogWriter {

    public writeLogEntry(logEntry: ILogEntry) {
        // also log the category as part of the message
        let message: string;
        
        if (logEntry.category !== '') {
            message = logEntry.category + ' : ' + logEntry.message;
        } else {
            message = logEntry.message;
        }
        
        switch(logEntry.level as Severity) {
            case Severity.TRACE:
            case Severity.DEBUG:
                console.log(message, logEntry.payload, logEntry.callstack);
                break;

            case Severity.INFO:
                console.info(message, logEntry.payload, logEntry.callstack);
                break;

            case Severity.WARN:
                console.warn(message, logEntry.payload, logEntry.callstack);
                break;
            case Severity.ERROR:
            case Severity.FATAL:
                console.error(message, logEntry.payload, logEntry.callstack);
                break;

            default:
                throw new Error("not implemented level '" + logEntry.level + "'");
        }
    }

    public flush(): void {
        // nothing to do
    }
}