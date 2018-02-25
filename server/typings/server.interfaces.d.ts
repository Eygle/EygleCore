export interface ILogger {
    log: (...any) => void;
    trace: (...any) => void;
    debug: (...any) => void;
    info: (...any) => void;
    warn: (...any) => void;
    error: (...any) => void;
}
export interface ILoginAttempt {
    locked: boolean;
    lockedTime: number;
    list: Array<number>;
}
