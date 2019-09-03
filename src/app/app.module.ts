import { MapPopupComponent } from './../../projects/ngx-proximus/src/lib/map-popup/map-popup.component';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule, Injector} from '@angular/core';

import {AppComponent} from './app.component';
import {PrivateLayoutComponent} from './layout/smartmonitoring/private.layout.component';
import {PublicLayoutComponent} from './layout/smartmonitoring/public.layout.component';
import {RouterModule} from '@angular/router';
import { MatProgressButtonsModule } from 'mat-progress-buttons';
import {AdminAuthGuard, AppRoutes, PublicAuthGuard, UserAuthGuard} from './app.routing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MenuItemModule} from '../../projects/ngx-proximus/src/lib/menu-item/menu-item.module';
import {TopMenuModule} from '../../projects/ngx-proximus/src/lib/top-menu/top-menu.module';
import {MainMenuModule} from '../../projects/ngx-proximus/src/lib/main-menu/main-menu.module';
import {IconModule} from '../../projects/ngx-proximus/src/lib/icon/icon.module';
import {TopMenuActionsModule} from '../../projects/ngx-proximus/src/lib/top-menu/top-menu-actions/top-menu-actions.module';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {environment} from '../environments/environment';
import {FooterModule} from '../../projects/ngx-proximus/src/lib/footer/footer.module';
import {MatMenuModule, MatSnackBar, MatSnackBarModule, MatTooltipModule} from '@angular/material';
import {SharedService} from './services/shared.service';
import {AuthService} from './services/auth.service';
import {SharedLayoutService} from './layout/shared-layout.service';
import {NgSelectModule} from '@ng-select/ng-select';
import {FilterService} from './services/filter.service';
import {ThresholdTemplateService} from './services/threshold-template.service';
import { MapAssetPopupComponent } from 'projects/ngx-proximus/src/lib/map-asset-popup/map-asset-popup.component';
import { createCustomElement } from '@angular/elements';
import { AssetService } from './services/asset.service';
import { SharedModule } from './shared/shared.module';
import { GlobaleSearchService } from './services/global-search.service';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './services/in-memory-data.service';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/' + environment.assetPrefix + '/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    PrivateLayoutComponent,
    PublicLayoutComponent,
    MapAssetPopupComponent,
    MapPopupComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(AppRoutes),
    MatProgressButtonsModule.forRoot(),
    BrowserAnimationsModule,
    MenuItemModule,
    MatTooltipModule,
    TopMenuModule,
    FooterModule,
    MatSnackBarModule,
    HttpClientModule,
    // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    // and returns simulated server responses.
    // Remove it when a real server is ready to receive requests.
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, { dataEncapsulation: false, passThruUnknownUrl: true, delay: 3000, apiBase: 'fakeapi/'}
    ),
    TopMenuActionsModule,
    MatMenuModule,
    MatSnackBarModule,
    NgSelectModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    MainMenuModule,
    IconModule,
    SharedModule,
  ],
  providers: [
    PublicAuthGuard,
    UserAuthGuard,
    AdminAuthGuard,
    SharedService,
    AuthService,
    FilterService,
    ThresholdTemplateService,
    SharedLayoutService,
    AssetService,
    GlobaleSearchService
  ],
  bootstrap: [AppComponent],
  entryComponents: [MapAssetPopupComponent, MapPopupComponent],
})
export class AppModule {
  constructor(private injector: Injector) {
    const PopupElement = createCustomElement(MapAssetPopupComponent, {injector});
    customElements.define('popup-element', PopupElement);

    const MapPopupElement = createCustomElement(MapPopupComponent, {injector});
    customElements.define('map-popup-element', MapPopupElement);
  }
}
