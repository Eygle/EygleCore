import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {TranslateModule} from '@ngx-translate/core';
import {MaterialModule} from './material.module';
import {FlexLayoutModule} from '@angular/flex-layout';

import {SidenavComponent} from './content/sidenav/sidenav.component';
import {LoginComponent} from './content/auth/login/login.component';
import {RegisterComponent} from './content/auth/register/register.component';
import {ConfigService} from './services/config.service';
import {AuthService} from './services/auth.service';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {LangService} from "./services/lang.service";
import {AccountComponent} from "./content/profile/account/account.component";
import {NotFoundComponent} from "./content/errors/not-found/not-found.component";
import {ProfileService} from "./content/profile/profile.service";

@NgModule({
    declarations: [
        SidenavComponent,
        LoginComponent,
        RegisterComponent,
        AccountComponent,
        NotFoundComponent
    ],
    imports: [
        CommonModule,
        BrowserModule,
        RouterModule,
        TranslateModule,
        MaterialModule,
        FlexLayoutModule,
        HttpClientModule,
        FormsModule
    ],
    exports: [
        SidenavComponent,

        CommonModule,
        RouterModule,
        TranslateModule,
        MaterialModule,
        FlexLayoutModule,
        FormsModule
    ],
    providers: [
        CookieService,

        ConfigService,
        AuthService,
        LangService,
        ProfileService
    ]
})
export class EygleCoreModule {
}
