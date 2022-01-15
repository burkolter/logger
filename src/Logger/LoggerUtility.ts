import { ILogWriter } from "./ILogWriter";
import { Logger } from "./Logger";
import { AjaxWriter } from "./Writter/AjaxWriter";
import { ConsoleWriter } from "./Writter/ConsoleWriter";
import { IAjaxCustomHeader } from "./Writter/IAjaxCustomHeader";

export function getConsoleWriter(): ILogWriter {
    return new ConsoleWriter();
}

export function getAjaxWriter(target: RequestInfo, customHeaders?: IAjaxCustomHeader[]) : ILogWriter {
    if (!customHeaders) {
        customHeaders = [];
    }
    return new AjaxWriter(target, customHeaders);
}

export function getLogger(): Logger {
    return Logger.getRootLogger();
}

export function flushWriters(): void {
    Logger.getRootLogger().flush(true);
}

export function setFlushOnUnload(): void {
    window.addEventListener("unload", (e)=> {
        flushWriters();
    });
}

export function setFlushOnBeforeUnload(): void {
    window.addEventListener("beforeunload", (e)=> {
        flushWriters();
    });
}

export function setFlushOnHide(): void {
    window.addEventListener("visibilitychange", (e)=> {
        if (document.hidden) {
            flushWriters();
        }
    });
}
