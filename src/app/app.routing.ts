import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, Routes} from '@angular/router';
import {Injectable} from '@angular/core';
import {AuthService} from './services/auth.service';
import {SharedService} from './services/shared.service';
import {User} from './models/user.model';
import {PublicLayoutComponent} from './layout/public.layout.component';
import {PrivateLayoutComponent} from './layout/private.layout.component';

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
      console.log('UserAuthGuard: ', err);
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
      loadChildren: () => import('./pages/devtest/devtest.module').then(m => m.DevtestModule)
    }]
  },
  {
    path: 'contact',
    component: PublicLayoutComponent,
    canActivate: [PublicAuthGuard],
    children: [{
      path: '',
      loadChildren: () => import('./pages/contact/contact.module').then(m => m.ContactModule)
    }]
  },
  {
    path: 'privacy',
    component: PublicLayoutComponent,
    children: [{
      path: '',
      loadChildren: () => import('./pages/privacy/privacy.module').then(m => m.PrivacyModule)
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
      loadChildren: () => import('./pages/home/smartmonitoring/home.module').then(m => m.HomeModule)
    }]
  },
  {
    path: 'error',
    component: PrivateLayoutComponent,
    canActivate: [PublicAuthGuard],
    children: [{
      path: '',
      loadChildren: () => import('./pages/error/smartmonitoring/error.module').then(m => m.ErrorModule)
    }]
  },
  {
    path: 'playground',
    component: PublicLayoutComponent,
    canActivate: [PublicAuthGuard],
    children: [{
      path: '',
      loadChildren: () => import('./pages/admin/manage-assets/manage-assets.module').then(m => m.ManageAssetsModule)
    }]
  },
  {
    path: 'private',
    component: PrivateLayoutComponent,
    children: [
      {
        path: 'home',
        canActivate: [UserAuthGuard],
        redirectTo: 'smartmonitoring',
      },
      {
        path: 'contact',
        canActivate: [UserAuthGuard],
        loadChildren: () => import('./pages/contact/contact.module').then(m => m.ContactModule)
      },
      {
        path: 'smartmonitoring',
        canActivate: [UserAuthGuard],
        loadChildren: () => import('./pages/smart-monitoring/smart-monitoring.module').then(m => m.SmartMonitoringModule)
      },
      {
        path: 'alerts',
        canActivate: [UserAuthGuard],
        loadChildren: () => import('./pages/alerts/smartmonitoring/alerts.module').then(m => m.AlertsModule)
      },
      {
        path: 'tankmonitoring',
        canActivate: [UserAuthGuard],
        loadChildren: () => import('./pages/tank-monitoring/tank-monitoring.module').then(m => m.TankMonitoringModule)
      },
      {
        path: 'walkingtrail',
        canActivate: [UserAuthGuard],
        loadChildren: () => import('./pages/walking-trail/walking-trail.module').then(m => m.WalkingTrailModule)
      },
      {
        path: 'admin',
        canActivate: [AdminAuthGuard],
        children: [
          {
            path: 'manage-locations',
            loadChildren: () => import('./pages/admin/manage-locations/manage-locations.module').then(m => m.ManageLocationsModule)
          },
          {
            path: 'manage-assets',
            loadChildren: () => import('./pages/admin/manage-assets/manage-assets.module').then(m => m.ManageAssetsModule)
          },
          {
            path: 'manage-things',
            loadChildren: () => import('./pages/admin/manage-things/manage-things.module').then(m => m.ManageThingsModule)
          },
          {
            path: 'manage-threshold-templates',
            loadChildren: () => import('./pages/admin/manage-threshold-templates/manage-threshold-templates.module').then(m => m.ManageThresholdTemplatesModule)
          },
          {
            path: 'manage-alert-definition',
            loadChildren: () => import('./pages/admin/alert-definition/alert-definition.module').then(m => m.AlertDefinitionModule)
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

