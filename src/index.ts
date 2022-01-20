import { Logger } from "./Logger/Logger";
import LoggerUtility from "./Logger/LoggerUtility";
import { LogLevel, LogLevelExtension } from "./Model/LogLevel";
import { Severity } from "./Model/Severity";
import { ILogWriter } from "./Logger/ILogWriter";
import { ConsoleWriter } from "./Logger/Writter/ConsoleWriter";
import { AjaxWriter } from "./Logger/Writter/AjaxWriter";
import { IAjaxCustomHeader } from "./Logger/Writter/IAjaxCustomHeader";

export { ILogWriter, AjaxWriter, IAjaxCustomHeader, ConsoleWriter, Logger, LoggerUtility, LogLevel, LogLevelExtension, Severity};

// conveniance access
export function getConsoleWriter(): ILogWriter {
    return LoggerUtility.getConsoleWriter();
}

export function getAjaxWriter(target: RequestInfo, customHeaders?: IAjaxCustomHeader[]): ILogWriter {
    return LoggerUtility.getAjaxWriter(target, customHeaders);
}

export function flushWriters(): void {
    LoggerUtility.flushWriters();
}

export function getLogger(): Logger {
    return Logger.getRootLogger();
}