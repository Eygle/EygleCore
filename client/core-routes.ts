import {LoginComponent} from './content/auth/login/login.component';
import {RegisterComponent} from './content/auth/register/register.component';
import {EPermission} from '../commons/core.enums';

export const eygleCoreRoutes: IRouteItem[] = [

  // Profile
  // {
  //   path: 'account',
  //   component: HomeComponent,
  //   translate: 'ACCOUNT.TITLE',
  //   icon: 'account_circle',
  //   access: EPermission.SeeAccount,
  //   category: 'PROFILE'
  // },
  // {
  //   path: 'settings',
  //   component: HomeComponent,
  //   translate: 'SETTINGS.TITLE',
  //   icon: 'settings',
  //   access: EPermission.SeeSettings,
  //   category: 'PROFILE'
  // },

  // Auth
  {path: 'auth/login', component: LoginComponent},
  {path: 'auth/register', component: RegisterComponent},
];

export interface IRouteItem {
  path: string;
  component: any;

  translate?: string;
  icon?: string;
  category?: string;
  access?: EPermission;
  exactMatch?: boolean;
  url?: string;
}
