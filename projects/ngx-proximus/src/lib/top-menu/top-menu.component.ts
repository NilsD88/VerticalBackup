import {Component, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Location } from '../../../../../src/app/models/locations.model';

export interface TopMenuConfig {
  languages?: { label: string; value: string }[];
  activeLanguage?: { label: string; value: string };
  contact?: {
    label: string;
    visible: boolean;
  };
  search?: {
    visible: boolean;
    placeholder: string;
  };
  languageVisible: boolean;
}

@Component({
  selector: 'pxs-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.scss']
})
export class TopMenuComponent implements OnInit {
  @Input() config: TopMenuConfig = {
    contact: {
      label: 'Contact',
      visible: true
    },
    search: {
      visible: false,
      placeholder: 'Search'
    },
    languages: [{label: 'EN', value: 'en'}, {label: 'NL', value: 'nl'}, {label: 'FR', value: 'fr'}],
    activeLanguage: {label: 'EN', value: 'en'},
    languageVisible: true
  };

  @Input() searchResults: any[];

  @ViewChild('inputSearch') set content(content: ElementRef) {
    this.inputSearch = content;
  }

  @Output() search: EventEmitter<string> = new EventEmitter();
  @Output() autocompleteClick: EventEmitter<any> = new EventEmitter();
  @Output() contactClick: EventEmitter<void> = new EventEmitter();
  @Output() languageChange: EventEmitter<{ label: string; value: string; }> = new EventEmitter();

  inputSearch: ElementRef;
  searchText: string;
  myControl = new FormControl();
  searchbarVisible = false;

  get activeLanguage() {
    return this.config.activeLanguage;
  }

  set activeLanguage(value: { label: string; value: string }) {
    this.config.activeLanguage = value;
  }

  constructor() {
  }

  ngOnInit() {
  }


  emitSearch(event) {
    this.search.emit(event);
  }

  emitContact() {
    this.contactClick.emit();
  }



  emitLanguageChange(language) {
    this.activeLanguage = language;
    this.languageChange.emit(language);
  }

  toggleSearchBar() {
    this.searchbarVisible = !this.searchbarVisible;
    setTimeout(()=>{
      if(this.inputSearch)
      this.inputSearch.nativeElement.focus();
    },200);
  }

  searchChanged(event) {
    if(event){
      if(event.length>2) {
        this.emitSearch(event);
      }
    }
  }

  searchFocusOut() {
    if (this.searchbarVisible) {
      this.searchbarVisible = false;
    }
  }

  selectAnAutocompletedOption(option) {
    this.searchbarVisible = false;
    this.searchText = '';
    this.autocompleteClick.emit(option);
  }

  getTypeOf(option: object) {
    if (option instanceof Location) {
      return 'location';
    } else {
      return 'asset';
    }
  }

}
