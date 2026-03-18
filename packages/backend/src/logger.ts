// lib/logger.ts (별도 파일)
import * as fs from 'fs/promises'
import * as path from 'path'
import * as crypto from 'crypto'

interface LogEntry {
  timestamp: string
  type: string
  errorCode?: number | string
  errorMessage?: string  
  log: string
}

interface ApiLogEntry {
  timestamp: string
  type: string
  hash: string
  startTime?: number
  duration?: number
  errorCode?: number | string
  errorMessage?: string
  binds: any[],
  method: string
}

interface QueryLogEntry {
  timestamp: string
  type: string
  hash: string
  startTime?: number
  duration?: number
  resultCount?: number
  errorCode?: number | string
  errorMessage?: string
  sql: string
}

class Logger {
  private static logDir = './logs'
  private static logBuffer: string[] = []

  private static async initLogDir() {
    await fs.mkdir(this.logDir, { recursive: true })
  }

  private static getLogFilePath(): string {
    const date = new Date().toISOString().slice(0, 10)
    return path.join(this.logDir, `oracle-queries-${date}.jsonl`)
  }

  public static getHash(): string {
    const uniqueInput = `${Date.now()}-${Math.random()}`;
    return crypto.createHash('md5').update(uniqueInput).digest('hex').slice(0, 8)
  }

  /// SQL에 바인드 변수를 적용하여 완성된 SQL 문자열을 반환하는 메서드
  private static applyBindsToSql(sql: string, binds: any[] | Record<string, any>): string {
    let result = sql;
    const placeholders = sql.match(/:\w+|:[\d]+/g) || [];
    
    placeholders.forEach((ph) => {
      let bindValue: any;
      // 1. 이름 바인딩 우선 (:memberId → binds.memberId)
      const bindName = ph.slice(1);  // :memberId → memberId
      if (typeof binds === 'object' && !Array.isArray(binds) && bindName in binds) {
        bindValue = binds[bindName];
      } 
      // 2. 배열 바인딩 폴백 (순서)
      else if (Array.isArray(binds)) {
        let index = parseInt(bindName) || 0;
        index = index - 1; // :1 → 0-based index
        index = index < binds.length ? index : 0; // 인덱스가 범위를 벗어나면 0으로 처리
        bindValue = binds[index];
      }
      // 3. 기본값
      else {
        bindValue = null;
      }
      
      // 4. 값 포맷팅
      const formattedValue = this.formatBindValue(bindValue);
      result = result.replace(ph, formattedValue);
    });
    
    return result;
  }
  private static formatBindValue(value: any): string {
    if (value === null || value === undefined) return 'NULL';
    if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`;
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'boolean') return value ? '1' : '0';
    if (value instanceof Date) return `DATE '${value.toISOString().slice(0,10)}'`;
    return value.toString();
  }

  // 시스템 관련 로그 기록 메서드
  private static createLogEntry(
    type: 'i' | 'w' | 'e',
    log: string
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      type: type === 'i' ? 'system info' : type === 'w' ? 'system warn' : 'system error',
      log: log
    }
  }
  static async log(type: 'i' | 'w', log: string) {
    await this.initLogDir()
    const logEntry = this.createLogEntry(type, log)
    this.logBuffer.push(JSON.stringify(logEntry))
    await this.flushBuffer()
  }
  static async logError(log: string, error: any) {
    const logEntry = this.createLogEntry('e', log)
    logEntry.errorCode = error?.errorNum || error?.code;
    logEntry.errorMessage = error instanceof Error ? error.message : String(error);    
    this.logBuffer.push(JSON.stringify(logEntry))
    await this.flushBuffer()
  }
  // api 로그 기록 메서드
  private static createApiLogEntry(
    method: string,
    binds: any[]
  ): ApiLogEntry {
    return {
      timestamp: new Date().toISOString(),
      type: 'api start',
      hash: Logger.getHash(),
      method: method,
      binds: binds,
      duration: 0,      
      startTime: Date.now()
    }
  }
  static async logApiStart(method: string, binds: any[]): Promise<ApiLogEntry> {
    await this.initLogDir()
    const logEntry = this.createApiLogEntry(method, binds)
    this.logBuffer.push(JSON.stringify(logEntry))
    return logEntry;
  }
  static async logApiSuccess(logEntry: ApiLogEntry | null) {
    if (!logEntry) {
      console.log('API 로그 엔트리가 없습니다.');
      return;
    }
    logEntry.type = 'api success';
    logEntry.duration = Date.now() - logEntry.startTime!;
    this.logBuffer.push(JSON.stringify(logEntry))
    await this.flushBuffer()
  }
  static async logApiError(logEntry: ApiLogEntry | null,  error: any) {
    if (!logEntry)
    {
      console.log('API 로그 엔트리가 없습니다.');
      return;
    }
    logEntry.type = 'api error';
    logEntry.errorCode = error?.errorNum || error?.code;
    logEntry.errorMessage = error instanceof Error ? error.message : String(error);    
    logEntry.duration = Date.now() - logEntry.startTime!    
    this.logBuffer.push(JSON.stringify(logEntry))
    await this.flushBuffer()
  }
  // 쿼리 로그 기록 메서드
  private static createQueryLogEntry(
    sql: string,
    binds: any[] | Record<string, any> 
  ): QueryLogEntry {
    return {
      timestamp: new Date().toISOString(),
      type: 'query start',
      hash: Logger.getHash(),
      duration: 0,
      startTime : Date.now(),
      sql: this.applyBindsToSql(sql, binds)
    }
  }
  static async logQueryStart(sql: string, binds: any[] | Record<string, any>): Promise<QueryLogEntry> {
    await this.initLogDir()
    const logEntry = this.createQueryLogEntry(sql, binds)
    const logEntryString = JSON.stringify(logEntry).replace(/\\n/g, String.fromCharCode(13) + String.fromCharCode(10))
    this.logBuffer.push(logEntryString)
    return logEntry;
  }
  static async logQuerySuccess(logEntry: QueryLogEntry | null, resultCount: number) {
    if (!logEntry) {
      console.log('쿼리 로그 엔트리가 없습니다.');
      return;
    }
    logEntry.type = 'query success';
    logEntry.resultCount = resultCount;
    logEntry.duration = Date.now() - logEntry.startTime!;
    const logEntryString = JSON.stringify(logEntry).replace(/\\n/g, String.fromCharCode(13) + String.fromCharCode(10))
    this.logBuffer.push(logEntryString)
    await this.flushBuffer()
  }
  static async logQueryError(logEntry: QueryLogEntry | null, error: any) {
    if (!logEntry) {
      console.log('쿼리 로그 엔트리가 없습니다.');
      return;
    }
    logEntry.type = 'query error';
    logEntry.errorCode = error?.errorNum || error?.code;
    logEntry.errorMessage = error instanceof Error ? error.message : String(error);
    logEntry.duration = Date.now() - logEntry.startTime!;
    const logEntryString = JSON.stringify(logEntry).replace(/\\n/g, String.fromCharCode(13) + String.fromCharCode(10))  
    this.logBuffer.push(logEntryString)
    await this.flushBuffer()
  }

  private static async flushBuffer() {
    if (this.logBuffer.length === 0) return
    
    const logFile = this.getLogFilePath()
    await fs.appendFile(logFile, this.logBuffer.join('\n') + '\n')
    this.logBuffer = []
  }
  static async forceFlushAll(): Promise<void> {
    // 모든 대기중인 로그 강제 쓰기
    await this.flushBuffer();
  }  
}

export default Logger
