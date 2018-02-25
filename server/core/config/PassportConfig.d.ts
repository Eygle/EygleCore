declare class PassportConfig {
    /**
     * Initialise passport
     * @param app
     */
    static init(app: any): void;
    /**
     * User local login strategy
     * @private
     */
    private static _localStrategy();
    /**
     * Passport serialize user
     * @private
     */
    private static _serializeUser();
    /**
     * Passport deserialize user
     * @private
     */
    private static _deserializeUser();
}
export default PassportConfig;
