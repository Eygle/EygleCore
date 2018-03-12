import * as q from 'q';
import * as os from 'os';
import * as clamscan from 'clamscan';

import Logger from '../utils/Logger';

export default class Antivirus {
    /**
     * Clamscan path
     */
    private static _binPath: string;

    /**
     * ClamAV scanner
     */
    private static _clam: any;

    /**
     * Log path
     */
    private static _logPath: string;

    public static init(): void {
        this._binPath = os.platform() === 'win32' ? 'C:\\Program Files\\ClamAV-x64\\clamscan.exe' : '/usr/local/bin/clamscan';
        this._logPath = os.platform() === 'win32' ? '../clamscan.log' : '/var/log/node-clam/all.log';

        this._clam = clamscan({
            remove_infected: true,
            scan_log: this._logPath,
            clamscan: {
                path: this._binPath
            },
            preference: 'clamscan'
        });
    }

    /**
     * Check file using CLamAV
     * @param file path
     */
    public static checkFile(file: any): Q.Promise<any> {
        const defer = q.defer();

        this._clam.is_infected(file, (err: any, fileRes: any, is_infected: boolean) => {
            if (err) {
                Logger.error('Error during virus scan', err);
                defer.reject(null);
            }

            if (is_infected) {
                defer.reject(null);
            }
            else {
                defer.resolve();
            }
        });

        return defer.promise;
    }
}
