import {AfterViewInit, Component, Input} from '@angular/core';

@Component({
  selector: 'pxs-slideshow',
  templateUrl: './slideshow.component.html',
  styleUrls: ['./slideshow.component.css']
})
export class SlideshowComponent implements AfterViewInit {
  slideIndex = 1;
  slides: any = [];
  slideNumbers = [];

  constructor() {
  }

  ngAfterViewInit() {
    this.slides = document.getElementsByTagName('pxs-slideshow-slide');
    this.showSlides(this.slideIndex);
  }


  // Next/previous controls
  public plusSlides(n) {
    this.showSlides(this.slideIndex += n);
  }

  // Thumbnail image controls
  public currentSlide(n) {
    this.showSlides(this.slideIndex = n);
  }

  showSlides(n: number) {
    let i;
    this.slides = document.getElementsByTagName('pxs-slideshow-slide');
    const dots: HTMLCollectionOf<any> = document.getElementsByClassName('dot');

    if (n > this.slides.length) {
      this.slideIndex = 1;
    }
    if (n < 1) {
      this.slideIndex = this.slides.length;
    }
    for (i = 0; i < this.slides.length; i++) {
      this.slides[i].style.display = 'none';
    }
    this.slides[this.slideIndex - 1].style.display = 'block';

    for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(' active', '');
    }
    try {
      dots[this.slideIndex - 1].className += ' active';
    } catch (err) {

    }
  }


}
