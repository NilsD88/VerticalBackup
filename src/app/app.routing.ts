import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, Routes} from '@angular/router';
import {Injectable} from '@angular/core';
import {AuthService} from './services/auth.service';
import {SharedService} from './services/shared.service';
import {User} from './models/user.model';
import {PublicLayoutComponent} from './layout/public.layout.component';
import {PrivateLayoutComponent} from './layout/private.layout.component';

@Injectable()
export class PublicAuthGuard implements CanActivate {

  constructor(
    public authService: AuthService,
    public sharedService: SharedService,
    private router: Router
  ) {
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    try {
      this.sharedService.user = new User(await this.authService.isLoggedIn());
      if (!['/error/404', '/error/500', '/error/401', '/error/403'].includes(state.url)) {
        this.router.navigate(['/private' + state.url]);
      }
      return true;
    } catch (err) {
      console.error(err);
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
  }
}

@Injectable()
export class HomeUserAuthGuard implements CanActivate {

  constructor(
    public authService: AuthService,
    public sharedService: SharedService,
    private router: Router
  ) {
  }

  async canActivate(): Promise<boolean> {
    try {
      this.sharedService.user = await this.authService.isLoggedIn();
      const modules = this.sharedService.user.modules;
      if (modules.length === 1) {
        switch (modules[0]) {
          case 'SMART_TANK':
            this.router.navigate(['private/smart-tank/dashboard']);
            break;
          case 'PEOPLE_COUNTING_WALKING_TRAILS':
            this.router.navigate(['private/walking-trails/dashboard']);
            break;
          case 'PEOPLE_COUNTING_SMART_COUNTING':
            this.router.navigate(['private/smart-counting/dashboard']);
            break;
          case 'PEOPLE_COUNTING_STAIRWAY_2_HEALTH':
            this.router.navigate(['private/stairway-2-health/dashboard']);
            break;
          default:
            this.router.navigate(['private/smart-monitoring/inventory']);
            break;
        }
      } else {
        this.router.navigate(['private/smart-monitoring/inventory']);
      }
      return true;
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
      return true;
    }
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
    component: PublicLayoutComponent,
    path: 'autoclose',
    loadChildren: './pages/general/autoclose/autoclose.module#AutocloseModule'
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
      loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule)
    }]
  },
  {
    path: 'error',
    component: PublicLayoutComponent,
    canActivate: [PublicAuthGuard],
    children: [{
      path: '',
      loadChildren: () => import('./pages/error/error.module').then(m => m.ErrorModule)
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
        canActivate: [HomeUserAuthGuard],
        children: []
      },
      {
        path: 'contact',
        canActivate: [UserAuthGuard],
        loadChildren: () => import('./pages/contact/contact.module').then(m => m.ContactModule)
      },
      {
        path: 'smart-monitoring',
        canActivate: [UserAuthGuard],
        loadChildren: () => import('./pages/smart-monitoring/smart-monitoring.module').then(m => m.SmartMonitoringModule)
      },
      {
        path: 'alerts',
        canActivate: [UserAuthGuard],
        loadChildren: () => import('./pages/alerts/alerts.module').then(m => m.AlertsModule)
      },
      {
        path: 'smart-tank',
        canActivate: [UserAuthGuard],
        loadChildren: () => import('./pages/smart-tank/smart-tank.module').then(m => m.SmartTankModule)
      },
      {
        path: 'walking-trails',
        canActivate: [UserAuthGuard],
        loadChildren: () => import('./pages/walking-trails/walking-trails.module').then(m => m.WalkingTrailsModule)
      },
      {
        path: 'smart-counting',
        canActivate: [UserAuthGuard],
        loadChildren: () => import('./pages/smart-counting/smart-counting.module').then(m => m.SmartCountingModule)
      },
      {
        path: 'stairway-2-health',
        canActivate: [UserAuthGuard],
        loadChildren: () => import('./pages/stairway-2-health/stairway-2-health.module').then(m => m.Stairway2HealthModule)
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
            path: 'manage-points-of-attention',
            loadChildren: () => import('./pages/admin/manage-points-of-attention/manage-points-of-attention.module').then(m => m.ManagePointsOfAttentionModule)
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

