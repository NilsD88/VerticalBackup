import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {SharedLayoutService} from '../shared-layout.service';
import {IFooterConfig} from '../../../../projects/ngx-proximus/src/lib/footer/footer.component';
import {TranslateService} from '@ngx-translate/core';
import {TopMenuConfig} from '../../../../projects/ngx-proximus/src/lib/top-menu/top-menu.component';
import { AssetService } from 'src/app/services/asset.service';
import { Asset } from 'src/app/models/asset.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'pvf-layout',
  templateUrl: './private.layout.html'
})
export class PrivateLayoutComponent implements OnInit, OnDestroy {
  public topMenuConfig: TopMenuConfig;
  public menuItems: { label: string; url: string; badge?: { label: string; class: string; } }[] = [
    {label: 'Inventory', url: '/private/inventory'},
    {label: 'Locations', url: '/private/locations'},
    {label: 'Alerts', url: '/private/alerts', badge: {label: '4', class: 'bg-error text-white'}},
    {label: 'Tank Monitoring', url: ''},
    {label: 'Visitor Counting', url: ''},
    {label: 'Manage', url: ''}
  ];
  public footerConfig: IFooterConfig;
  public searchResults: any[];
  public searchTerm$ = new Subject<string>();

  constructor(
    private router: Router,
    private translateService: TranslateService,
    public sharedLayoutService: SharedLayoutService,
    public assetService: AssetService) {
      this.assetService.search(this.searchTerm$)
      .subscribe(result => {
        this.searchResults = result;
      });
  }

  async ngOnInit(): Promise<void> {
    this.topMenuConfig = {
      languages: this.sharedLayoutService.languages.map(this.sharedLayoutService.mapLanguage),
      activeLanguage: this.sharedLayoutService.currentLang,
      languageVisible: true,
      contact: {
        label: await this.translateService.get('LAYOUT.CONTACT').toPromise(),
        visible: true
      },
      search: {
        placeholder: await this.translateService.get('LAYOUT.SEARCH').toPromise(),
        visible: true
      }
    };
    this.footerConfig = await this.sharedLayoutService.getFooterTranslations();
  }

  ngOnDestroy(): void {
    // this.router.unsubscribe();
  }

  navigateTo(url: string[]) {
    this.router.navigate(url);
  }

  pxsClicked() {
    window.open('https://www.proximus.be/', '_blank');
  }

  mtClicked() {
    window.open('https://mythings.proximus.be/', '_blank');
  }

  autocompleteClick(event: Asset) {
    this.router.navigateByUrl(`/private/detail/${event.id}`);
    this.searchResults = null;
  }

}
