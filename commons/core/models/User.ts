import {AModel} from './AModel';

export class User extends AModel {
  email?: string;
  userName?: string;

  password?: string;
  validMail?: string;
  locked?: boolean;
  changePassword?: boolean;

  roles: Array<string>;
  desc?: string;
}
