import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {PrivateLayoutComponent} from './layout/private.layout.component';
import {PublicLayoutComponent} from './layout/public.layout.component';
import {RouterModule} from '@angular/router';
import {AdminAuthGuard, AppRoutes, PublicAuthGuard, UserAuthGuard, HomeUserAuthGuard} from './app.routing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MenuItemModule} from 'projects/ngx-proximus/src/lib/menu-item/menu-item.module';
import {TopMenuModule} from 'projects/ngx-proximus/src/lib/top-menu/top-menu.module';
import {MainMenuModule} from 'projects/ngx-proximus/src/lib/main-menu/main-menu.module';
import {IconModule} from 'projects/ngx-proximus/src/lib/icon/icon.module';
import {TopMenuActionsModule} from 'projects/ngx-proximus/src/lib/top-menu/top-menu-actions/top-menu-actions.module';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {environment} from '../environments/environment';
import {FooterModule} from 'projects/ngx-proximus/src/lib/footer/footer.module';
import {MatMenuModule, MatSnackBarModule, MatTooltipModule} from '@angular/material';
import { SharedModule } from './shared/shared.module';
import { GraphQLModule } from './graphql.module';
import {NgcCookieConsentModule, NgcCookieConsentConfig} from 'ngx-cookieconsent';


export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/' + environment.assetPrefix + '/i18n/', '.json');
}

const cookieConfig: NgcCookieConsentConfig = {
  cookie: {
    domain: 'proximus.be'
  },
  position: 'bottom',
  theme: 'block',
  palette: {
    popup: {
      background: '#000000',
      text: '#ffffff',
      link: '#ffffff'
    },
    button: {
      background: '#c5b38a',
      text: '#ffffff',
      border: 'transparent'
    }
  },
  content: {
    message: 'This website uses only cookies that are necessary for its functionality.',
    dismiss: 'Accept!',
    deny: 'Refuse cookies',
    link: 'Learn more',
    href: 'https://www.proximus.be/en/id_cr_cookie/personal/products/orphans/cookie-policy.html'
  }
};

@NgModule({
  declarations: [
    AppComponent,
    PrivateLayoutComponent,
    PublicLayoutComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(AppRoutes, {scrollPositionRestoration: 'enabled'}),
    NgcCookieConsentModule.forRoot(cookieConfig),
    BrowserAnimationsModule,
    HttpClientModule,
    MatMenuModule,
    MatTooltipModule,
    MatSnackBarModule,
    MenuItemModule,
    TopMenuModule,
    FooterModule,
    TopMenuActionsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      },
    }),
    MainMenuModule,
    IconModule,
    SharedModule,
    GraphQLModule,
  ],
  providers: [
    PublicAuthGuard,
    UserAuthGuard,
    AdminAuthGuard,
    HomeUserAuthGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
