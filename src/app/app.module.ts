import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {PrivateLayoutComponent} from './layout/private.layout.component';
import {PublicLayoutComponent} from './layout/public.layout.component';
import {RouterModule} from '@angular/router';
import {AdminAuthGuard, AppRoutes, PublicAuthGuard, UserAuthGuard} from './app.routing';
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


export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/' + environment.assetPrefix + '/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    PrivateLayoutComponent,
    PublicLayoutComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(AppRoutes),
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
      }
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
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
