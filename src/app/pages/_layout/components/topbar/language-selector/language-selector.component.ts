import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TranslationService } from '../../../../../core/i18n/translation.service';

interface LanguageFlag {
  lang: string;
  name: string;
  flag: string;
  active?: boolean;
}

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss'],
})
export class LanguageSelectorComponent implements OnInit {
  language: LanguageFlag;
  languages: LanguageFlag[] = [
    {
      lang: 'fa',
      name: 'فارسی',
      flag: './assets/media/svg/flags/iran.svg',
    },
    {
      lang: 'en',
      name: 'English',
      flag: './assets/media/svg/flags/226-united-states.svg',
    },
    {
      lang: 'ch',
      name: 'Mandarin',
      flag: './assets/media/svg/flags/015-china.svg',
    },
    {
      lang: 'es',
      name: 'Spanish',
      flag: './assets/media/svg/flags/128-spain.svg',
    },
    {
      lang: 'jp',
      name: 'Japanese',
      flag: './assets/media/svg/flags/063-japan.svg',
    },
    {
      lang: 'de',
      name: 'German',
      flag: './assets/media/svg/flags/162-germany.svg',
    },
    {
      lang: 'fr',
      name: 'French',
      flag: './assets/media/svg/flags/195-france.svg',
    },
  ];
  constructor(
    private translationService: TranslationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.setSelectedLanguage();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe((event) => {
        this.setSelectedLanguage();
      });
  }

  setLanguageWithRefresh(lang): void {
    this.setLanguage(lang);
    window.location.reload();
  }

  setLanguage(lang): void {
    this.languages.forEach((language: LanguageFlag) => {
      if (language.lang === lang) {
        language.active = true;
        this.language = language;
      } else {
        language.active = false;
      }
    });
    this.translationService.setLanguage(lang);
  }

  setSelectedLanguage(): any {
    this.setLanguage(this.translationService.getSelectedLanguage());
  }
}
