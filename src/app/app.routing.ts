import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, Routes} from '@angular/router';
import {Injectable} from '@angular/core';
import {AuthService} from './services/auth.service';
import {SharedService} from './services/shared.service';
import {environment} from '../environments/environment';
import {User} from './models/user.model';
import {PublicLayoutComponent} from './layout/smartmonitoring/public.layout.component';
import {PrivateLayoutComponent} from './layout/smartmonitoring/private.layout.component';

@Injectable()
export class PublicAuthGuard implements CanActivate {

  constructor(public authService: AuthService,
              public sharedService: SharedService,
              private router: Router) {
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    try {
      this.sharedService.user = new User(await this.authService.isLoggedIn());
      if (!['/error/404', '/error/500', '/error/401', '/error/403'].includes(state.url)) {
        this.router.navigate(['/private' + state.url]);
      }
      return true;
    } catch (err) {
      console.info('UserAuthGuard: ', err);
      return true;
    }
  }

}

@Injectable()
export class UserAuthGuard implements CanActivate {

  constructor(public authService: AuthService, public sharedService: SharedService, private router: Router) {
  }

  async canActivate(): Promise<boolean> {
    try {
      this.sharedService.user = await this.authService.isLoggedIn();
      return this.sharedService.user.isUser;
    } catch (err) {
      switch (err.status) {
        case 401:
          this.router.navigate(['/']);
          this.sharedService.showNotification('Unauthorized: 401', 'warning', 3000);
          break;
        case 403:
          this.router.navigate(['/']);
          this.sharedService.showNotification('Unauthorized: 403', 'warning', 3000);
          break;
        case 404:
          this.router.navigate(['/error/404']);
          break;
        default:
          this.router.navigate(['/error/500']);
      }
      return false;
    }
    return true;
  }
}

@Injectable()
export class AdminAuthGuard implements CanActivate {

  constructor(public authService: AuthService, public sharedService: SharedService, private router: Router) {
  }

  async canActivate(): Promise<boolean> {
    try {
      this.sharedService.user = await this.authService.isLoggedIn();
      if (this.sharedService.user.isUser && !this.sharedService.user.isAdmin) {
        this.sharedService.showNotification('Unauthorized, admin rights needed to perform this action', 'warning', 3000);
        this.router.navigate(['/home']);
      }
      return this.sharedService.user.isAdmin;
    } catch (err) {
      switch (err.status) {
        case 401:
          this.router.navigate(['/error/401']);
          break;
        case 403:
          this.router.navigate(['/error/403']);
          break;
        case 404:
          this.router.navigate(['/error/404']);
          break;
        case 302:
          this.router.navigate(['/error/302']);
          break;
        default:
          this.router.navigate(['/error/500']);
      }
      return false;
    }
    return true;
  }

}


export const AppRoutes: Routes = [
  {
    path: 'dev',
    component: PublicLayoutComponent,
    children: [{
      path: '',
      loadChildren: environment.paths.home
    }]
  },
  {
    path: 'contact',
    component: PublicLayoutComponent,
    children: [{
      path: '',
      loadChildren: './pages/contact/contact.module#ContactModule'
    }]
  },
  {
    path: 'privacy',
    component: PublicLayoutComponent,
    children: [{
      path: '',
      loadChildren: './pages/privacy/privacy.module#PrivacyModule'
    }]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '',
    component: PublicLayoutComponent,
    canActivate: [PublicAuthGuard],
    children: [{
      path: 'home',
      loadChildren: './pages/home/smartmonitoring/home.module#HomeModule'
    }]
  },
  {
    path: 'error',
    component: PublicLayoutComponent,
    canActivate: [PublicAuthGuard],
    children: [{
      path: '',
      loadChildren: './pages/error/smartmonitoring/error.module#ErrorModule'
    }]
  },
  {
    path: 'playground',
    component: PublicLayoutComponent,
    canActivate: [PublicAuthGuard],
    children: [{
      path: '',
      //loadChildren: './pages/playground/smartmonitoring/playground.module#PlaygroundModule'
      //loadChildren: './pages/playground/wizard-asset/playground.module#PlaygroundModule'
      loadChildren: './pages/playground/threshold/threshold.module#ThresholdModule'
      //loadChildren: './pages/admin/manage-assets/smartmonitoring/asset-wizard/asset-wizard.module#AssetWizardModule'
    }]
  },
  {
    path: 'private',
    component: PrivateLayoutComponent,
    children: [
      {
        path: 'test',
        canActivate: [UserAuthGuard],
        loadChildren: './pages/playground/wizard-asset/playground.module#PlaygroundModule'
      },
      {
        path: 'home',
        canActivate: [UserAuthGuard],
        loadChildren: './pages/inventory/smartmonitoring/inventory.module#InventoryModule'
      }, {
        path: 'alerts',
        canActivate: [UserAuthGuard],
        loadChildren: './pages/alerts/smartmonitoring/alerts.module#AlertsModule'
      }, {
        path: 'detail/:id',
        canActivate: [UserAuthGuard],
        loadChildren: './pages/detail/smartmonitoring/detail.module#DetailModule'
      },
      {
        path: 'tankmonitoring',
        canActivate: [UserAuthGuard],
        children: [{
          path: 'dashboard',
          loadChildren: './pages/dashboard/tankmonitoring/dashboard.module#DashboardModule'
      },
    ]
    }, {
      path: 'admin',
      canActivate: [AdminAuthGuard],
      children: [
        {
          path: 'manage-locations',
          loadChildren: './pages/admin/manage-locations/manage-locations.module#ManageLocationsModule'
        },
        {
          path: 'manage-assets',
          loadChildren: './pages/admin/manage-assets/smartmonitoring/manage-assets.module#ManageAssetsModule'
        }, {
          path: 'manage-things',
          loadChildren: './pages/admin/manage-things/smartmonitoring/manage-things.module#ManageThingsModule'
        }, {
          path: 'manage-threshold-templates',
          loadChildren: './pages/admin/manage-threshold-templates/smartmonitoring/manage-threshold-templates.module#ManageThresholdTemplatesModule'
        }, {
          path: 'manage-alert-definition',
          loadChildren: './pages/admin/alert-definition/smartmonitoring/alert-definition.module#AlertDefinitionModule'
        },
        {
          path: '**',
          redirectTo: '/error/404'
        }
      ]
    }, {
      path: '**',
      redirectTo: '/error/404'
    }]
  },
  {
    path: '**',
    redirectTo: '/error/404'
  }
];

