import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {LayoutService} from './layout.service';
import {TopMenuConfig} from 'projects/ngx-proximus/src/lib/top-menu/top-menu.component';
import {TranslateService} from '@ngx-translate/core';
import {IFooterConfig} from 'projects/ngx-proximus/src/lib/footer/footer.component';

@Component({
  selector: 'pvf-layout',
  templateUrl: './public.layout.html'
})
export class PublicLayoutComponent implements OnInit {

  public topMenuConfig: TopMenuConfig;
  public menuItems: { label: string; url: string; badge?: { label: string; class: string; } }[] = [
    {label: 'Home', url: '/home'}
  ];
  public footerConfig: IFooterConfig;

  constructor(private router: Router,
              private translateService: TranslateService,
              public layoutService: LayoutService) {
  }

  async ngOnInit(): Promise<void> {
    this.topMenuConfig = {
      languages: this.layoutService.languages.map(this.layoutService.mapLanguage),
      activeLanguage: this.layoutService.currentLang,
      languageVisible: true,
      contact: {
        label: await this.translateService.get('LAYOUT.CONTACT').toPromise(),
        visible: true
      },
      search: {
        placeholder: await this.translateService.get('LAYOUT.SEARCH').toPromise(),
        visible: false
      }
    };
    this.footerConfig = await this.layoutService.getFooterTranslations();
  }

  navigateTo(url: string) {
    this.router.navigate([url]);
  }
}
