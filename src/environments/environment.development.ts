// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import {PublicLayoutComponent} from '../app/layout/smartmonitoring/public.layout.component';
import {PrivateLayoutComponent} from '../app/layout/smartmonitoring/private.layout.component';
import {PublicAuthGuard} from '../app/app.routing';

export const environment = {
  production: false,
  baseUrl: 'https://www-uat.proximus.be/smartapps/smartmonitoring/',
  loginUrl: 'https://www-uat.proximus.be/smartapps/smartmonitoring/auth/login',
  authUrl: 'https://www-uat.proximus.be/smartapps/smartmonitoring/auth/',
  assetPrefix: 'smartmonitoring',

  paths: {
    home: './pages/devtest/devtest.module#DevtestModule'
  }

};
