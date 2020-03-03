import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {SharedService} from '../../services/shared.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'pvf-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public checklistItems: string[] = ['ITEM1', 'ITEM2', 'ITEM3', 'ITEM4', 'ITEM5'];
  public homesliderItems: any[] = [
    {translationPostfix: '1', icon: 'temperature'},
    {translationPostfix: '2', icon: 'humidity'},
    {translationPostfix: '3', icon: 'luminosity'},
    {translationPostfix: '4', icon: 'motion'}
  ];

  public products = [
    {translationPostfix: '1', image: 'assets/smartmonitoring/images/home/smart-monitoring.jpg'},
    {translationPostfix: '2', image: 'assets/smartmonitoring/images/home/smart-tank-monitoring.jpg'},
    {translationPostfix: '3', image: 'assets/smartmonitoring/images/home/smart-care.jpg'},
  ];

  constructor(private route: ActivatedRoute,
              private snackBar: MatSnackBar,
              private sharedService: SharedService,
              private translateService: TranslateService) {
  }

  ngOnInit() {

    const errorCode = this.route.snapshot.queryParams.error;
    const successCode = this.route.snapshot.queryParams.success;

    console.log(errorCode);
    console.log(successCode);

    if (errorCode !== null && typeof errorCode !== 'undefined') {
      let errorText = '';
      this.translateService.get('LOGIN_ERROR.' + errorCode).subscribe((result) => {
        errorText = result;
      });

      this.sharedService.showNotification(errorText, 'error', 0, 'Close');
    }

    if (successCode !== null && typeof successCode !== 'undefined') {
      let successText = '';
      this.translateService.get('LOGOUT_SUCCESS.' + successCode).subscribe((result) => {
        successText = result;
      });

      this.sharedService.showNotification(successText, 'success', 5000);
    }

  }

}
