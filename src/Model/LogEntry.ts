import { Logger } from "../Logger/Logger";
import { ILogEntry } from "./ILogEntry";
import { Severity } from "./Severity";

export class LogEntry implements ILogEntry {
    public timestamp: Date = new Date();
    public category: string = null
    public level: Severity = Severity.DEBUG;
    public message: string = null
    public payload: object | string = null;
    public callstack: string = null;
    private logger: Logger;

    constructor(category: string, level: Severity, message: string, payload: object | string, callstack: string, logger: Logger = null) {
            this.category = category;
            this.level = level;
            this.message = message;
            this.payload = payload;
            this.callstack = callstack;
            this.logger = logger;
    }

    public getLogger(): Logger {
        return this.logger;
        
    }
}