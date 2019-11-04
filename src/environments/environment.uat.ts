// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  baseUrl: 'https://www-uat.proximus.be/smartapps/smartmonitoring/v2/api',
  loginUrl: 'https://www-uat.proximus.be/smartapps/smartmonitoring/v2/auth/login',
  authUrl: 'https://www-uat.proximus.be/smartapps/smartmonitoring/v2/auth/',
  assetPrefix: 'smartmonitoring',
  paths: {
    home: './pages/devtest/devtest.module#DevtestModule'
  }
};
