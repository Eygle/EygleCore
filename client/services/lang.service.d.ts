import { TranslateService } from "@ngx-translate/core";
export declare class LangService {
    private translate;
    constructor(translate: TranslateService);
    /**
     * Initialize using core languages and given ones
     * @param fr
     * @param en
     */
    init(fr: any, en?: any): void;
}
