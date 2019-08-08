import {Component, Input, OnInit} from '@angular/core';

export interface IFooterConfig {
  allRightsReserved: string;
  termsAndConditions: string;
  cookiesPolicy: string;
  belgianLaw: string;
}

@Component({
  selector: 'pxs-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  public year: number = new Date().getFullYear();
  public;
  @Input() config: IFooterConfig = {
    allRightsReserved: '',
    termsAndConditions: '',
    cookiesPolicy: '',
    belgianLaw: ''
  };

  constructor() {
  }

  ngOnInit() {
  }

}
