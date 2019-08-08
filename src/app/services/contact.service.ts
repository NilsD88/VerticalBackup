import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {MatSnackBar} from '@angular/material';
import {SharedService} from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private http: HttpClient,
              private snackBar: MatSnackBar,
              public sharedService: SharedService) {
  }

  sendSupportMessage(body) {
    return new Promise((resolve, reject) => {
      this.http.post(`${environment.baseUrl}contact`, body)
        .subscribe(() => {
          const snackBarRef = this.snackBar.open(
            'Successfully sent your message.',
            null, {
              duration: 3000,
              panelClass: 'success-snackbar'
            });
          resolve();
        }, (err) => {
          this.sharedService.rejectPromise('Error! Failed to send message. Please try again.', reject);
        });
    });
  }
}
