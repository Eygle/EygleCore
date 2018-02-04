import * as tracer from 'tracer';
import ProjectConfig from "./ProjectConfig";

class Logger {

   /**
    * External logger instance
    */
   private _instance;

   constructor() {
      switch (ProjectConfig.loggerType) {
         case "console":
            this._instance = (<any>tracer).colorConsole(ProjectConfig.logger);
            break;
         case "file":
            this._instance = (<any>tracer).dailyfile(ProjectConfig.logger);
            break;
      }
   }

   /**
    * Trace lvl
    * @param args
    */
   trace(...args) {
      this._instance.trace.apply(this, args);
   }

   /**
    * Log lvl
    * @param args
    */
   log(...args) {
      this._instance.log.apply(this, args);
   }

   /**
    * Info lvl
    * @param args
    */
   info(...args) {
      this._instance.info.apply(this, args);
   }

   /**
    * Debug lvl
    * @param args
    */
   debug(...args) {
      this._instance.debug.apply(this, args);
   }

   /**
    * Warn lvl
    * @param args
    */
   warn(...args) {
      this._instance.warn.apply(this, args);
   }

   /**
    * Error lvl
    * @param args
    */
   error(...args) {
      this._instance.error.apply(this, args);
   }
}

export default new Logger();