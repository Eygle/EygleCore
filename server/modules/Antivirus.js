"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const q = require("q");
const os = require("os");
const clamscan = require("clamscan");
const Logger_1 = require("../utils/Logger");
class Antivirus {
    static init() {
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
    static checkFile(file) {
        const defer = q.defer();
        this._clam.is_infected(file, (err, fileRes, is_infected) => {
            if (err) {
                Logger_1.default.error('Error during virus scan', err);
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
exports.default = Antivirus;
//# sourceMappingURL=Antivirus.js.map