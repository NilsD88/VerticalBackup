import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {SharedService} from '../services/shared.service';
import {AuthService} from '../services/auth.service';
import {User} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  public currentLang: { label: string; value: string };
  public languages: string[] = [];
  public user: User = this.sharedService.user;

  constructor(private translateService: TranslateService, public authService: AuthService, public sharedService: SharedService) {
    this.currentLang = this.mapLanguage(this.translateService.currentLang);
    this.languages = this.translateService.langs;
  }

  public changeLanguage(language: { label: string; value: string }) {
    this.currentLang = language;
    localStorage.setItem('language', language.value);
    this.translateService.use(language.value);
  }

  public mapLanguage(item: string): { label: string; value: string; } {
    return {label: item.toUpperCase(), value: item};
  }

  public async getFooterTranslations() {
    // middle step to make sure we don't 'await' all promises, more performant since it fires all requests, then we await all of them
    const config = {
      allRightsReserved: this.translateService.get('DISCLAIMER.ALL_RIGHTS_RESERVED').toPromise(),
      termsAndConditions: this.translateService.get('DISCLAIMER.TERMS_AND_CONDITIONS').toPromise(),
      cookiesPolicy: this.translateService.get('DISCLAIMER.COOKIE_POLICY').toPromise(),
      belgianLaw: this.translateService.get('DISCLAIMER.BELGIAN_LAW').toPromise()
    };

    // await all promises
    return {
      allRightsReserved: await config.allRightsReserved,
      termsAndConditions: await config.termsAndConditions,
      cookiesPolicy: await config.cookiesPolicy,
      belgianLaw: await config.belgianLaw
    };
  }

  public login() {
    this.authService.login();
  }

  public logout() {
    this.authService.logout();
  }

}
