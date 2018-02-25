import * as express from 'express';

import Resty from '../middlewares/Resty';
import Auth from '../middlewares/Auth';
import EmailsUnsubscribe from '../middlewares/EmailsUnsubscribe';
import {EEnv} from '../typings/server.enums';
import ProjectConfig from "./ProjectConfig";
import Logger from "./Logger";
import {CustomRoute} from "../models/CustomRoute";

class Routes {
   public static init(app, routes: [CustomRoute]) {
      // Home exception (catch url '/', add cookie and serve index.html)
      app.get('/', [this.indexRedirect()]);

      // STATIC ROUTES
      app.use('/', express.static(ProjectConfig.clientRoot));

      if (EEnv.Prod !== ProjectConfig.env && EEnv.Preprod !== ProjectConfig.env) {
         app.use('/bower_components', express.static(`${ProjectConfig.root}/../bower_components`));
      }

      // API ENTRY POINT
      app.all('/api/*', [Resty.httpMiddleware(`${__dirname}/../api`)]);

      // AUTH
      if (ProjectConfig.implementsAuth) {
         app.post('/register', [Auth.registerMiddleware()]);
         app.post('/login', [Auth.loginLimitMiddleware(), Auth.loginMiddleware()]);
         app.post('/logout', [Auth.logoutMiddleware()]);
         app.post('/forgot-password', [Auth.forgotPasswordMiddleware()]);
         app.put('/change-password/*', [Auth.changePasswordMiddleware()]);
         app.put('/unlock-user/*', [Auth.unlockAccountMiddleware()]);
      }

      // EMAILS UNSUBSCRIBE
      if (ProjectConfig.includeEmailUnsubscribe) {
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
         res.sendFile(`${ProjectConfig.clientRoot}/index.html`);
      };
   }
}

export default Routes;
