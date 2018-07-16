import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {HttpClientModule} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';

import {SidenavComponent} from './content/sidenav/sidenav.component';
import {LoginComponent} from './content/auth/login/login.component';
import {RegisterComponent} from './content/auth/register/register.component';
import {ConfigService} from './services/config.service';
import {AuthService} from "./services/auth.service";

@NgModule({
    declarations: [
        SidenavComponent,
        LoginComponent,
        RegisterComponent
    ],
    imports: [
        CommonModule,
        HttpClientModule
    ],
    exports: [
        SidenavComponent,
        CommonModule
    ],
    providers: [
        CookieService,

        ConfigService,
        AuthService
    ]
})
export class EygleCoreModule {
}
