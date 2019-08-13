import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'pvf-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent {
  constructor(translate: TranslateService) {

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
  }
}
