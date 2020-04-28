import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, Routes} from '@angular/router';
import {Injectable} from '@angular/core';
import {AuthService} from './services/auth.service';
import {SharedService} from './services/shared.service';
import {User} from './models/user.model';
import {PublicLayoutComponent} from './layout/public.layout.component';
import {PrivateLayoutComponent} from './layout/private.layout.component';
import {TranslateService} from '@ngx-translate/core';

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
          case 'TANK_MONITORING':
            this.router.navigate(['private/tankmonitoring/dashboard']);
            break;
          case 'PEOPLE_COUNTING_WALKING_TRAIL':
            this.router.navigate(['private/walkingtrail/dashboard']);
            break;
          case 'PEOPLE_COUNTING_RETAIL':
            this.router.navigate(['private/peoplecounting/dashboard']);
            break;
          case 'PEOPLE_COUNTING_STAIRWAY_TO_HEALTH':
            this.router.navigate(['private/stairwaytohealth/dashboard']);
            break;
          default:
            this.router.navigate(['private/smartmonitoring/inventory']);
            break;
        }
      } else {
        this.router.navigate(['private/smartmonitoring/inventory']);
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

  constructor(public authService: AuthService, public sharedService: SharedService, private router: Router, private translateService: TranslateService) {
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
          let message = '';
          if (this.sharedService.user.impersonation) {
            message = await this.translateService.get('GENERAL.SESSION_EXPIRED_WILL_STOP_IMPERSONATION').toPromise();
          } else {
            message = await this.translateService.get('GENERAL.SESSION_EXPIRED_WILL_LOGOUT').toPromise();
          }
          const snackBarRef = this.sharedService.showNotification(message, 'warning', 5000);
          snackBarRef.afterDismissed().subscribe(null, null, () => {
            if (this.sharedService.user.impersonation) {
              this.router.navigate(['/autoclose']);
            } else {
              this.router.navigate(['/']);
            }
          });
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
        path: 'smartmonitoring',
        canActivate: [UserAuthGuard],
        loadChildren: () => import('./pages/smart-monitoring/smart-monitoring.module').then(m => m.SmartMonitoringModule)
      },
      {
        path: 'alerts',
        canActivate: [UserAuthGuard],
        loadChildren: () => import('./pages/alerts/alerts.module').then(m => m.AlertsModule)
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
        path: 'peoplecounting',
        canActivate: [UserAuthGuard],
        loadChildren: () => import('./pages/people-counting-retail/people-counting-retail.module').then(m => m.PeopleCountingRetailModule)
      },
      {
        path: 'stairwaytohealth',
        canActivate: [UserAuthGuard],
        loadChildren: () => import('./pages/stairway-to-health/stairway-to-health.module').then(m => m.StairwayToHealthModule)
      },
      {
        path: 'stairwaytohealth',
        canActivate: [UserAuthGuard],
        loadChildren: () => import('./pages/stairway-to-health/stairway-to-health.module').then(m => m.StairwayToHealthModule)
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

