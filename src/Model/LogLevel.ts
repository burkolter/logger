import { Severity } from "./Severity"

export enum LogLevelExtension {
    ALL = 0,
    NONE = 10  
}

export type LogLevel = Severity | LogLevelExtension;