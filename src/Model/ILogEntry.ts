import { Severity } from "./Severity";

export interface ILogEntry {
    timestamp: Date,
    category: string,
    level: Severity,
    message: string,
    payload: object | string,
    callstack: string
}