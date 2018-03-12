import * as express from 'express';

import Resty from '../middlewares/Resty';
import Auth from '../middlewares/Auth';
import EmailsUnsubscribe from '../middlewares/EmailsUnsubscribe';
import Logger from "./Logger";
import {CustomRoute} from "../models/CustomRoute";
import ServerConfig from "./ServerConfig";
import {EEnv} from "../../commons/core.enums";

class Routes {
   public static init(app, routes: [CustomRoute]) {
      // Home exception (catch url '/', add cookie and serve index.html)
      app.get('/', [this.indexRedirect()]);

      // STATIC ROUTES
      app.use('/', express.static(ServerConfig.clientRoot));

      if (EEnv.Prod !== ServerConfig.env && EEnv.Preprod !== ServerConfig.env) {
         app.use('/bower_components', express.static(`${ServerConfig.root}/../bower_components`));
      }

      // API ENTRY POINT
      app.all('/api/*', [Resty.httpMiddleware(`${__dirname}/../api`)]);

      // AUTH
      if (ServerConfig.implementsAuth) {
         app.post('/register', [Auth.registerMiddleware()]);
         app.post('/login', [Auth.loginLimitMiddleware(), Auth.loginMiddleware()]);
         app.post('/logout', [Auth.logoutMiddleware()]);
         app.post('/forgot-password', [Auth.forgotPasswordMiddleware()]);
         app.put('/change-password/*', [Auth.changePasswordMiddleware()]);
         app.put('/unlock-user/*', [Auth.unlockAccountMiddleware()]);
      }

      // EMAILS UNSUBSCRIBE
      if (ServerConfig.includeEmailUnsubscribe) {
         Logger.trace("Module Emails unsubscription activated");
         app.get('/unsubscribe/*', [EmailsUnsubscribe.getMiddleware()]);
         app.post('/unsubscribe/*', [EmailsUnsubscribe.getPostMiddleware()]);
      }

      // CUSTOM ROUTES
      for (const route of routes) {
         app[route.method](route.path, route.middleware);
      }

      // FALLBACK (when reloading on a route redirect to index.html)
      app.get('/*', [this.indexRedirect()]);
   }

   private static indexRedirect() {
      return (req, res) => {
         Auth.addUserCookie(res, req.user || null);
         res.sendFile(`${ServerConfig.clientRoot}/index.html`);
      };
   }
}

export default Routes;
