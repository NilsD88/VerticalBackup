import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {NgcCookieConsentService} from 'ngx-cookieconsent';

import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr-BE';
import localeNl from '@angular/common/locales/nl-BE';
import localeEn from '@angular/common/locales/en-BE';

@Component({
  selector: 'pvf-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent {
  constructor(
    public translate: TranslateService,
    private ccService: NgcCookieConsentService
  ) {

    registerLocaleData(localeFr, 'fr');
    registerLocaleData(localeNl, 'nl');
    registerLocaleData(localeEn, 'en');

    //////////////////////////
    // Setup language to use
    //////////////////////////
    translate.addLangs(['en', 'fr', 'nl']);
    translate.setDefaultLang('en');

    let userLang: string = localStorage.getItem('language'); // get language from localstorage to get users language from previous visit
    if (!userLang) {
      userLang = translate.getBrowserLang(); // get language from browser
    }
    translate.use(userLang.match(/en|fr|nl/) ? userLang : 'en'); // if no language fro localstorage and browser, set to English

    translate.use(userLang.match(/en|fr|nl/) ? userLang : 'en');
    const concent = localStorage.getItem('cookieConcentGiven');
    if (!(concent === 'true')) {
      translate
        .get(['COOKIE.MESSAGE', 'COOKIE.DISMISS', 'COOKIE.LINK'])
        .subscribe(data => {
          this.ccService.getConfig().content = this.ccService.getConfig().content || {};
          // Override default messages with the translated ones
          this.ccService.getConfig().content.message = data['COOKIE.MESSAGE'];
          this.ccService.getConfig().content.dismiss = data['COOKIE.DISMISS'];
          this.ccService.getConfig().content.link = data['COOKIE.LINK'];

          this.ccService.destroy(); // remove previous cookie bar (with default messages)
          this.ccService.init(this.ccService.getConfig()); // update config with translated messages
          this.ccService.popupClose$.subscribe(
            () => {
              localStorage.setItem('cookieConcentGiven', 'true');
            });
        });
    } else {
      this.ccService.destroy();
    }
  }
}
