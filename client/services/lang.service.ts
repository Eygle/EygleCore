import {Injectable} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {locale as coreFr} from '../i18n/fr';
// import {locale as coreEn} from '../i18n/en';

@Injectable()
export class LangService {
    constructor(private translate: TranslateService) {
    }

    /**
     * Initialize using core languages and given ones
     * @param fr
     * @param en
     */
    public init(fr: any, en: any = null) {

        // Add languages
        this.translate.addLangs(en ? ['fr', 'en'] : ['fr']);

        if (en) {
            // this.translate.setTranslation('en', coreEn, true);
            this.translate.setTranslation('en', en, true);
        }

        // this language will be used as a fallback when a translation isn't found in the current language
        this.translate.setDefaultLang('fr');

        // the lang to use, if the lang isn't available, it will use the current loader to get them
        this.translate.use(this.translate.getBrowserLang());

        this.translate.setTranslation('fr', coreFr, true);
        this.translate.setTranslation('fr', fr, true);
    }
}
