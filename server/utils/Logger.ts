import ServerConfig from "./ServerConfig";

export default class Logger {

   /**
    * External logger instance
    */
   private static _instance = ServerConfig.generateLogger();

   /**
    * Trace lvl
    * @param args
    */
   static trace(...args) {
      this._instance.trace.apply(this, args);
   }

   /**
    * Log lvl
    * @param args
    */
   static log(...args) {
      this._instance.log.apply(this, args);
   }

   /**
    * Info lvl
    * @param args
    */
   static info(...args) {
      this._instance.info.apply(this, args);
   }

   /**
    * Debug lvl
    * @param args
    */
   static debug(...args) {
      this._instance.debug.apply(this, args);
   }

   /**
    * Warn lvl
    * @param args
    */
   static warn(...args) {
      this._instance.warn.apply(this, args);
   }

   /**
    * Error lvl
    * @param args
    */
   static error(...args) {
      this._instance.error.apply(this, args);
   }
}