import { SubSink } from 'subsink';
import { SharedService } from 'src/app/services/shared.service';
import { GlobaleSearchService } from 'src/app/services/global-search.service';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {LayoutService} from './layout.service';
import {IFooterConfig} from 'projects/ngx-proximus/src/lib/footer/footer.component';
import {TranslateService} from '@ngx-translate/core';
import {TopMenuConfig} from 'projects/ngx-proximus/src/lib/top-menu/top-menu.component';
import { Subject, Observable } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';

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
  ];
  public footerConfig: IFooterConfig;
  public searchResults: any[];
  public searchTerm$ = new Subject<string>();
  public numberOfUnreadAlerts$ = new Observable <number> ();

  private subs = new SubSink();

  constructor(
    private router: Router,
    private translateService: TranslateService,
    public layoutService: LayoutService,
    private globaleSearchService: GlobaleSearchService,
    public sharedService: SharedService,
    public alertService: AlertService) {
      this.subs.add(
        this.globaleSearchService.searchTerm(this.searchTerm$).subscribe(result => {
          const results = [];
          result.forEach((array, index) => {
            const type = (index === 0) ? 'asset' : 'location';
            if (array.length > 0) {
              for (const item of array) {
                results.push({...item, type});
              }
            }
          });
          this.searchResults = results;
        })
      );
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
        visible: true
      }
    };
    this.footerConfig = await this.layoutService.getFooterTranslations();
    this.numberOfUnreadAlerts$ = this.alertService.numberOfUnreadAlerts$.asObservable();
    this.subs.add(
      this.alertService.getNumberOfUnreadAlerts().subscribe()
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
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

  autocompleteClick(event: {name: string; id: string; type: string}) {
    if (event.type === 'asset') {
      this.router.navigateByUrl(`/private/smart-monitoring/detail/${event.id}`);
    } else if (event.type === 'location') {
      this.router.navigateByUrl(`/private/smart-monitoring/inventory/locations/${event.id}`);
    }
    this.searchResults = null;
  }

}
