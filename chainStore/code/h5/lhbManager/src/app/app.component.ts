import {Component, OnDestroy, OnInit} from '@angular/core';
import {AnalyticsService} from './@core/utils/analytics.service';

@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit,OnDestroy{

  constructor(private analytics: AnalyticsService) {
  }

  ngOnInit(): void {
    this.analytics.trackPageViews();
  }

  ngOnDestroy(): void {

  }
}

