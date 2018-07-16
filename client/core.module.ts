import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {HttpClientModule} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {TranslateModule} from '@ngx-translate/core';
import {MaterialModule} from './material.module'
import {FlexLayoutModule} from '@angular/flex-layout';

import {SidenavComponent} from './content/sidenav/sidenav.component';
import {LoginComponent} from './content/auth/login/login.component';
import {RegisterComponent} from './content/auth/register/register.component';
import {ConfigService} from './services/config.service';
import {AuthService} from "./services/auth.service";
import {RouterModule} from "@angular/router";
import {FormsModule} from "@angular/forms";

@NgModule({
    declarations: [
        SidenavComponent,
        LoginComponent,
        RegisterComponent
    ],
    imports: [
        CommonModule,
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
        AuthService
    ]
})
export class EygleCoreModule {
}
