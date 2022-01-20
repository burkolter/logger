import { ILogEntry } from "../Model/ILogEntry";
import { LogEntry } from "../Model/LogEntry";
import { LogLevel, LogLevelExtension } from "../Model/LogLevel";
import { Severity } from "../Model/Severity";
import { ILogWriter } from "./ILogWriter";

export class Logger {
    // remember the "tree"-position
    private static _root: Logger = new Logger('', null);
    private parent: Logger = null;
    private children: Map<string, Logger> = new Map();

    // settings
    public name: string;
    public logLevel: LogLevel = LogLevelExtension.ALL;

    // writers on this Logger
    private writers: ILogWriter[] = [];

    // constructor
    private constructor(name: string, parent: Logger) {
        this.parent = parent;
        this.name = name;
    }

    public static getRootLogger() {
        return this._root;
    }

    // allowing for a flush interval
    private intervalHolder: number = null;
    public setFlushInterval(interval: number): void {
        this.removeFlushInterval();
        this.intervalHolder = window.setInterval(
            () => {
                this.flush(true);
            },
            interval);
    }

    public removeFlushInterval() {
        if (this.intervalHolder > 0) {
            window.clearInterval(this.intervalHolder);
            this.intervalHolder = -1;
        }
    }

    // write out all logs
    public flush(includeChildLoggers: boolean = true): void {
        // flush logs on this level
        this.writers.forEach((writer) => {
            writer.flush();
        })

        // flush logs on child level
        if (includeChildLoggers) {
            this.children.forEach((child) => {
                child.flush(includeChildLoggers);
            })
        }
    }

    // handling LogLevel
    public setLogLevel(level: LogLevel): void {
        this.logLevel = level;
    }

    public getLogLevel(): LogLevel {
        return this.logLevel;
    }

    // handling writers
    public addWriter(writer: ILogWriter): void {
        this.writers.push(writer);
    }

    public removeWriter(writer: ILogWriter): void {
        const index = this.writers.indexOf(writer, 0);

        if (index > -1) {
            this.writers.splice(index, 1);
        }
    }

    // handling child Loggers
    private createAndRememberChildLogger(name): Logger {
        let ret: Logger = new Logger(name, this);
        this.children.set(name, ret);

        return ret;
    }

    public getChildLogger(name: string): Logger {
        let ret: Logger = this.children.get("name");

        if (ret === undefined) {
            ret = this.createAndRememberChildLogger(name);
        }

        return ret;
    }

    public removeChildLogger(name: string): void {
        this.children.delete(name);
    }

    // do the logging
    private propagateLogEntry(logEntry: ILogEntry): void {
        this.writers.forEach((writer) => {
            writer.writeLogEntry(logEntry);
        });

        if (this.parent !== null) {
            this.parent.propagateLogEntry(logEntry);
        }
    }
    
    public log(level: Severity, message: string, payload?: string | object, callstack?: string) {
        if (level < this.logLevel) {
            // message is ignored
            return;
        }
    
        // create log-object and propagate to writers and parent writers
        const logEntry: LogEntry = new LogEntry(this.name, level, message, payload, callstack, this);
        this.propagateLogEntry(logEntry);

        return logEntry;
    }


    /* convert any log information into a log
    
    Expectation: param1 = message (string), param2 = payload (string), param3 = Stacktrace/Error (String, Error), param4 = expose callstack (boolean)

    Any more params are ignored
    */
    private convertAndLog(level: Severity, logArguments: any[], exposeStacktrace: boolean = false): ILogEntry {
        let message: string = "";
        let stacktrace: string = null;
        let payload: string | object = null;

        if (exposeStacktrace) {
            stacktrace = Error().stack;
        }

        // 1st param: assume "message", "error" or object-payload as params
        if (logArguments.length >= 1) {
            if (typeof logArguments[0] == 'string') {
                message = logArguments[0];
            }

            if (logArguments[0] instanceof Error) {
                const convertedArg: Error = logArguments[0];

                message = convertedArg.name + ": " + convertedArg.message;
                stacktrace = convertedArg.stack;
            }

            if (typeof logArguments[0] == 'object') {
                payload = logArguments[0];
            }
        }

        // 2nd param: assume "error" or payload (string or object) as params
        if (logArguments.length >= 2) {
            if (logArguments[1] instanceof Error) {
                const convertedArg: Error = logArguments[1];

                if (message !== "") {
                    message = message + ' - ' + convertedArg.name + ": " + convertedArg.message;
                } else {
                    message = convertedArg.name + ": " + convertedArg.message;
                }
                stacktrace = convertedArg.stack;
            }

            if (typeof logArguments[1] == 'object') {
                payload = logArguments[1];
            }

            if (typeof logArguments[1] == 'string') {
                payload = logArguments[1];
            }
        }

        // 3rd param: assume Error
        if (logArguments.length >= 3) {
            if (logArguments[2] instanceof Error) {
                const convertedArg: Error = logArguments[2];

                if (message !== "") {
                    message = message + ' - ' + convertedArg.name + ": " + convertedArg.message;
                } else {
                    message = convertedArg.name + ": " + convertedArg.message;
                }
                stacktrace = convertedArg.stack;
            }
        }
        
        // silently ignore any more params, but create a error log-entry
        if (logArguments.length > 3) {
            level = Severity.ERROR;
            message = "too many params in log-call";
            stacktrace = Error().stack;
            payload = logArguments;
        }

        return this.log(level, message, payload, stacktrace);
    }

    public trace(...params: any[]): ILogEntry {
        return this.convertAndLog(Severity.TRACE, params, true);
    }

    public debug(...params: any[]): ILogEntry {
        return this.convertAndLog(Severity.DEBUG, params);
    }

    public info(...params: any[]): ILogEntry {
        return this.convertAndLog(Severity.INFO, params);
    }

    public warn(...params: any[]): ILogEntry {
        return this.convertAndLog(Severity.WARN, params);
    }

    public error(...params: any[]): ILogEntry {
        return this.convertAndLog(Severity.ERROR, params);
    }

    public fatal(...params: any[]): ILogEntry {
        return this.convertAndLog(Severity.FATAL, params);
    }
}