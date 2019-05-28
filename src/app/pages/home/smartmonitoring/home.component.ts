import {Component, OnInit} from '@angular/core';

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

  constructor() {
  }

  ngOnInit() {
  }

}
