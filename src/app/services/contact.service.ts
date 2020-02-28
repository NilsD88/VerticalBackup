import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';
import {HttpClient} from '@angular/common/http';
import {MatSnackBar} from '@angular/material';
import {SharedService} from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    public sharedService: SharedService
  ) {}

  sendSupportMessage(body) {
    return new Promise((resolve, reject) => {
      this.http.post(`${environment.baseUrl}/contact`, body)
        .subscribe(() => {
          const snackBarRef = this.snackBar.open(
            this.sharedService.translate.instant('NOTIFS.SUCCESS.SENT_YOUR_MESSAGE'),
            null, {
              duration: 3000,
              panelClass: 'success-snackbar'
            });
          resolve();
        }, (err) => {
          this.sharedService.rejectPromise(this.sharedService.translate.instant('NOTIFS.FAILS.SENT_YOUR_MESSAGE'), reject);
        });
    });
  }
}
