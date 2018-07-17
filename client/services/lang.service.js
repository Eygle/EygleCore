"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var core_2 = require("@ngx-translate/core");
var fr_1 = require("../i18n/fr");
// import {locale as coreEn} from '../i18n/en';
var LangService = (function () {
    function LangService(translate) {
        this.translate = translate;
    }
    /**
     * Initialize using core languages and given ones
     * @param fr
     * @param en
     */
    LangService.prototype.init = function (fr, en) {
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
        this.translate.setTranslation('fr', fr_1.locale, true);
        this.translate.setTranslation('fr', fr, true);
    };
    LangService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [core_2.TranslateService])
    ], LangService);
    return LangService;
}());
exports.LangService = LangService;
//# sourceMappingURL=lang.service.js.map