// lib/logger.ts (별도 파일)
import * as fs from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';
class Logger {
    static logDir = './logs';
    static logBuffer = [];
    static async initLogDir() {
        await fs.mkdir(this.logDir, { recursive: true });
    }
    static getLogFilePath() {
        const date = new Date().toISOString().slice(0, 10);
        return path.join(this.logDir, `oracle-queries-${date}.jsonl`);
    }
    static getHash() {
        const uniqueInput = `${Date.now()}-${Math.random()}`;
        return crypto.createHash('md5').update(uniqueInput).digest('hex').slice(0, 8);
    }
    /// SQL에 바인드 변수를 적용하여 완성된 SQL 문자열을 반환하는 메서드
    static applyBindsToSql(sql, binds) {
        let result = sql;
        const placeholders = sql.match(/:\w+|:[\d]+/g) || [];
        placeholders.forEach((ph, index) => {
            const bindValue = Array.isArray(binds) ? binds[index] : binds[ph.slice(1)];
            const formattedValue = typeof bindValue === 'string'
                ? `'${bindValue.replace(/'/g, "''")}'`
                : bindValue;
            result = result.replace(ph, formattedValue);
        });
        return result;
    }
    // 시스템 관련 로그 기록 메서드
    static createLogEntry(type, log) {
        return {
            timestamp: new Date().toISOString(),
            type: type === 'i' ? 'system info' : type === 'w' ? 'system warn' : 'system error',
            log: log
        };
    }
    static async log(type, log) {
        await this.initLogDir();
        const logEntry = this.createLogEntry(type, log);
        this.logBuffer.push(JSON.stringify(logEntry));
        await this.flushBuffer();
    }
    static async logError(log, error) {
        const logEntry = this.createLogEntry('e', log);
        logEntry.errorCode = error?.errorNum || error?.code;
        logEntry.errorMessage = error instanceof Error ? error.message : String(error);
        this.logBuffer.push(JSON.stringify(logEntry));
        await this.flushBuffer();
    }
    static createApiLogEntry(method, binds) {
        return {
            timestamp: new Date().toISOString(),
            type: 'api start',
            hash: Logger.getHash(),
            method: method,
            binds: binds,
            duration: 0,
            startTime: Date.now()
        };
    }
    static async logApiStart(method, binds) {
        await this.initLogDir();
        const logEntry = this.createApiLogEntry(method, binds);
        this.logBuffer.push(JSON.stringify(logEntry));
        return logEntry;
    }
    static async logApiSuccess(logEntry) {
        if (!logEntry) {
            console.log('API 로그 엔트리가 없습니다.');
            return;
        }
        logEntry.type = 'api success';
        logEntry.duration = Date.now() - logEntry.startTime;
        this.logBuffer.push(JSON.stringify(logEntry));
        await this.flushBuffer();
    }
    static async logApiError(logEntry, error) {
        if (!logEntry) {
            console.log('API 로그 엔트리가 없습니다.');
            return;
        }
        logEntry.type = 'api error';
        logEntry.errorCode = error?.errorNum || error?.code;
        logEntry.errorMessage = error instanceof Error ? error.message : String(error);
        logEntry.duration = Date.now() - logEntry.startTime;
        this.logBuffer.push(JSON.stringify(logEntry));
        await this.flushBuffer();
    }
    static createQueryLogEntry(sql, binds) {
        return {
            timestamp: new Date().toISOString(),
            type: 'query start',
            hash: Logger.getHash(),
            duration: 0,
            startTime: Date.now(),
            sql: this.applyBindsToSql(sql, binds)
        };
    }
    static async logQueryStart(sql, binds) {
        await this.initLogDir();
        const logEntry = this.createQueryLogEntry(sql, binds);
        const logEntryString = JSON.stringify(logEntry).replace(/\\n/g, String.fromCharCode(13) + String.fromCharCode(10));
        this.logBuffer.push(logEntryString);
        return logEntry;
    }
    static async logQuerySuccess(logEntry, resultCount) {
        if (!logEntry) {
            console.log('쿼리 로그 엔트리가 없습니다.');
            return;
        }
        logEntry.type = 'query success';
        logEntry.resultCount = resultCount;
        logEntry.duration = Date.now() - logEntry.startTime;
        const logEntryString = JSON.stringify(logEntry).replace(/\\n/g, String.fromCharCode(13) + String.fromCharCode(10));
        this.logBuffer.push(logEntryString);
        await this.flushBuffer();
    }
    static async logQueryError(logEntry, error) {
        if (!logEntry) {
            console.log('쿼리 로그 엔트리가 없습니다.');
            return;
        }
        logEntry.type = 'query error';
        logEntry.errorCode = error?.errorNum || error?.code;
        logEntry.errorMessage = error instanceof Error ? error.message : String(error);
        logEntry.duration = Date.now() - logEntry.startTime;
        const logEntryString = JSON.stringify(logEntry).replace(/\\n/g, String.fromCharCode(13) + String.fromCharCode(10));
        this.logBuffer.push(logEntryString);
        await this.flushBuffer();
    }
    static async flushBuffer() {
        if (this.logBuffer.length === 0)
            return;
        const logFile = this.getLogFilePath();
        await fs.appendFile(logFile, this.logBuffer.join('\n') + '\n');
        this.logBuffer = [];
    }
    static async forceFlushAll() {
        // 모든 대기중인 로그 강제 쓰기
        await this.flushBuffer();
    }
}
export default Logger;
