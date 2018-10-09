
import { Component,Injectable,ElementRef,ViewChild,OnInit,AfterViewInit,Renderer,Input,Output,EventEmitter} from "@angular/core";
import {NgbDatepickerI18n,NgbDateStruct,NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';

const I18N_VALUES = {
  'fr': {
    weekdays: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
  }
  // other languages you would support
};

// Define a service holding the language. You probably already have one if your app is i18ned. Or you could also
// use the Angular LOCALE_ID value
@Injectable()
export class I18n {
  language = 'fr';
}

// Define custom service providing the months and weekdays translations
@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {

  constructor(private _i18n: I18n,private config: NgbDatepickerConfig,) {
    super();
    config.minDate = {year: 1949, month: 1, day: 1};
    config.maxDate = {year: 2099, month: 12, day: 31};
  }


  getWeekdayShortName(weekday: number): string {
    return I18N_VALUES[this._i18n.language].weekdays[weekday - 1];
  }
  getMonthShortName(month: number): string {
    return I18N_VALUES[this._i18n.language].months[month - 1];
  }
  getMonthFullName(month: number): string {
    return this.getMonthShortName(month);
  }
}



