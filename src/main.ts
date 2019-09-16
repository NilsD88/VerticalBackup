import 'hammerjs';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));


declare global {
    interface String {
      trunc(length: number): string;
    }
}

String.prototype.trunc = function(n) {
  return this.substr(0, n - 1) + (this.length > n ? '…' : '');
};
