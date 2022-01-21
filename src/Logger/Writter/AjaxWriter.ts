import { ILogEntry } from "../../Model/ILogEntry";
import { LogLevel } from "../../Model/LogLevel";
import { Severity } from "../../Model/Severity";
import { ILogWriter } from "../ILogWriter";
import { IAjaxCustomHeader } from "./IAjaxCustomHeader";

export class AjaxWriter implements ILogWriter {
    private messageBuffer: ILogEntry[] = [];
    private bufferSize: number = 20;
    private forceFlushLevel: LogLevel = Severity.WARN;

    private targetUrl: RequestInfo;
    private customHeaders: IAjaxCustomHeader[] = [];

    private forceStringPayload: false;

    constructor (targetUrl: RequestInfo, customHeaders?: IAjaxCustomHeader[]) {
        this.targetUrl = targetUrl;
        if (customHeaders !== undefined) {
            this.customHeaders = customHeaders;
        }
    }

    // Adapt the buffer size
    public setBufferSize(newSize: number) {
        this.bufferSize = newSize;
    }

    public getBufferSize(): number {
        return this.bufferSize;
    }

    // Adapt the force-Flush - Level
    public setForceFlushLevel(newLevel: LogLevel) {
        this.forceFlushLevel = newLevel;
    }

    public getForceFlushLevel(): LogLevel {
        return this.forceFlushLevel;
    }

    // add default header and custom ones
    private prepareHeaders(): Headers {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        this.customHeaders.forEach((header) => {
            headers.append(header.header, header.value);
        });

        return headers;
    }

    // sending the logs async
    private send(messages: ILogEntry[]) {
        const headers = this.prepareHeaders();

        // payload remapping to string
        if (this.forceStringPayload) {
            messages.forEach((message) => {
                if (message.payload && typeof message.payload == 'object') {
                    message.payload = JSON.stringify(message.payload);
                }
            })
        }

        // send messages
        fetch(this.targetUrl, {
            method: 'POST',
            headers: headers,
            keepalive: true, // make fetch to finish even on close
            body: JSON.stringify(messages)
        })
        .then((response) => {
            if (!response.ok) {
                console.warn("logger: error sending logs", messages, response)
            }
        })
        .catch((error) => {
            console.error("logger: error sending logs", messages, error);
        })
    }

    public writeLogEntry(logEntry: ILogEntry) {
        // add to buffer
        this.messageBuffer.push(logEntry);

        // check buffer-size-overrun or forced send level
        if (this.messageBuffer.length >= this.bufferSize  || logEntry.level >= this.forceFlushLevel) {
            this.send(this.messageBuffer.splice(0)); // remove from buffer due to async send
        }
    }

    public flush(): void {
        if (this.messageBuffer.length > 0) {
            this.send(this.messageBuffer.splice(0)); // remove from buffer due to async send
        }
    }
}