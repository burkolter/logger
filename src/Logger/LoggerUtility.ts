import { ILogWriter } from "./ILogWriter";
import { Logger } from "./Logger";
import { AjaxWriter } from "./Writter/AjaxWriter";
import { ConsoleWriter } from "./Writter/ConsoleWriter";
import { IAjaxCustomHeader } from "./Writter/IAjaxCustomHeader";


export default class LoggerUtility  {
    static getConsoleWriter(): ILogWriter {
        return new ConsoleWriter();
    };

    static getAjaxWriter(target: RequestInfo, customHeaders?: IAjaxCustomHeader[]) : ILogWriter {
        if (!customHeaders) {
            customHeaders = [];
        }
        return new AjaxWriter(target, customHeaders);
    };

    static getLogger(): Logger {
        return Logger.getRootLogger();
    }

    static flushWriters(): void {
        Logger.getRootLogger().flush(true);
    }

    static setFlushOnUnload(): void {
        window.addEventListener("unload", (e)=> {
            this.flushWriters();
        });
    }

    static setFlushOnBeforeUnload(): void {
        window.addEventListener("beforeunload", (e)=> {
            this.flushWriters();
        });
    }

    static setFlushOnHide(): void {
        window.addEventListener("visibilitychange", (e)=> {
            if (document.hidden) {
                this.flushWriters();
            }
        });
    }
}
