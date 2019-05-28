import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

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
  styleUrls: ['./top-menu.component.css']
})
export class TopMenuComponent implements OnInit {
  @Input() config: TopMenuConfig = {
    contact: {
      label: 'Contact',
      visible: true
    },
    search: {
      visible: true,
      placeholder: 'Search'
    },
    languages: [{label: 'EN', value: 'en'}, {label: 'NL', value: 'nl'}, {label: 'FR', value: 'fr'}],
    activeLanguage: {label: 'EN', value: 'en'},
    languageVisible: true
  };

  @Output() search: EventEmitter<string> = new EventEmitter();
  @Output() contactClick: EventEmitter<void> = new EventEmitter();
  @Output() languageChange: EventEmitter<{ label: string; value: string; }> = new EventEmitter();

  searchModel = '';

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

  // Catch enter key for emitting search event
  checkEnter(event: KeyboardEvent) { // with type info
    if (this.searchModel.length) {
      if (event.code === 'Enter') {
        this.emitSearch();
      }
    } else {
      this.searchbarVisible = false;
    }
  }

  emitSearch() {
    this.search.emit(this.searchModel);
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
  }

  searchFocusOut() {
    if (this.searchbarVisible && !this.searchModel) {
      this.searchbarVisible = false;
    }
  }

}
