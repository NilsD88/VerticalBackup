import { AuthService } from 'src/app/services/auth.service';
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'pvf-app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})

export class ErrorComponent implements OnInit {

  public errorCode: number;

  constructor(public router: Router, private route: ActivatedRoute, private authService: AuthService) {
  }

  ngOnInit() {
    this.route.url.subscribe(url => {
      this.errorCode = +url[0].path;
    });
  }

  toHome() {
    this.router.navigate(['/home']);
  }

  logout() {
    this.authService.logout();
  }

}
