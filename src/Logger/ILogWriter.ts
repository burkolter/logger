import { ILogEntry } from "../Model/ILogEntry";

export interface ILogWriter {
    flush(): void;
    writeLogEntry(logEntry: ILogEntry): void;
}