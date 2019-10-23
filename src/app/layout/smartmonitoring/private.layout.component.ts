import { SharedService } from 'src/app/services/shared.service';
import { GlobaleSearchService } from './../../services/global-search.service';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {SharedLayoutService} from '../shared-layout.service';
import {IFooterConfig} from '../../../../projects/ngx-proximus/src/lib/footer/footer.component';
import {TranslateService} from '@ngx-translate/core';
import {TopMenuConfig} from '../../../../projects/ngx-proximus/src/lib/top-menu/top-menu.component';
import { IAsset } from 'src/app/models/g-asset.model';
import { ILocation } from './../../models/g-location.model';
import { Subject } from 'rxjs';
import { NewAlertService } from 'src/app/services/new-alert.service';

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
  public numberOfUnreadAlerts = null;

  constructor(
    private router: Router,
    private translateService: TranslateService,
    public sharedLayoutService: SharedLayoutService,
    private globaleSearchService: GlobaleSearchService,
    public sharedService: SharedService,
    public newAlertService: NewAlertService) {
      this.globaleSearchService.searchTerm(this.searchTerm$)
      .subscribe(result => {
        const results = [];
        for (const array of result) {
          if (array.length > 0) {
            for (const item of array) {
              results.push(item);
            }
          }
        }
        this.searchResults = results;
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

    this.newAlertService.getNumberOfUnreadAlerts().subscribe((numberOfUnreadAlerts) => {
      this.numberOfUnreadAlerts = (numberOfUnreadAlerts > 0) ? ((numberOfUnreadAlerts > 99) ? '99+' : numberOfUnreadAlerts ) : null;
    });

  }

  ngOnDestroy(): void {
    // this.router.unsubscribe();
  }

  navigateTo(url: string[]) {
    console.log('navigateTo', url);
    this.router.navigate(url);
  }

  pxsClicked() {
    window.open('https://www.proximus.be/', '_blank');
  }

  mtClicked() {
    window.open('https://mythings.proximus.be/', '_blank');
  }

  autocompleteClick(event: IAsset | ILocation) {
    this.router.navigateByUrl(`/private/smartmonitoring/detail/${event.id}`);
    this.searchResults = null;
  }

}
