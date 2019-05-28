import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {SharedLayoutService} from '../shared-layout.service';
import {IFooterConfig} from '../../../../projects/ngx-proximus/src/lib/footer/footer.component';
import {TranslateService} from '@ngx-translate/core';
import {TopMenuConfig} from '../../../../projects/ngx-proximus/src/lib/top-menu/top-menu.component';

@Component({
  selector: 'pvf-layout',
  templateUrl: './private.layout.html'
})
export class PrivateLayoutComponent implements OnInit, OnDestroy {
  public topMenuConfig: TopMenuConfig;
  public menuItems: { label: string; url: string; badge?: { label: string; class: string; } }[] = [
    {label: 'Home', url: '/home'},
    {label: 'Inventory', url: '/inventory'},
    {label: 'Locations', url: '/locations'},
    {label: 'Alerts', url: '/private/alerts', badge: {label: '4', class: 'bg-error text-white'}}
  ];
  public footerConfig: IFooterConfig;

  constructor(private router: Router,
              private translateService: TranslateService,
              public sharedLayoutService: SharedLayoutService) {
  }

  async ngOnInit(): Promise<void> {
    this.topMenuConfig = {
      languages: this.sharedLayoutService.languages.map(this.sharedLayoutService.mapLanguage),
      activeLanguage: this.sharedLayoutService.currentLang,
      languageVisible: true,
      contact: {
        label: await this.translateService.get('TOP_MENU.CONTACT').toPromise(),
        visible: true
      },
      search: {
        placeholder: await this.translateService.get('TOP_MENU.SEARCH_PLACEHOLDER').toPromise(),
        visible: true
      }
    };
    this.footerConfig = await this.sharedLayoutService.getFooterTranslations();
  }

  ngOnDestroy(): void {
    // this.router.unsubscribe();
  }

  navigateTo(url: string) {
    this.router.navigate([url]);
  }
}
