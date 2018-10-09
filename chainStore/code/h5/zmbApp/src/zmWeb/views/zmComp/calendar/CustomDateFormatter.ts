import { CalendarDateFormatter, DateFormatterParams } from 'angular-calendar';
import { DatePipe } from '@angular/common';

export class CustomDateFormatter extends CalendarDateFormatter {

  public monthViewColumnHeader({date, locale}: DateFormatterParams): string {
    return new DatePipe(locale).transform(date, 'EEEEE', locale); // use short week days
  }

  public weekViewTitle({date, locale}: DateFormatterParams): string{
    return new DatePipe(locale).transform(date, '第w周 -- yyyy年', locale); // use short week days
  }
}

