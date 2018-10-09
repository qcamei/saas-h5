/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import {Component, OnDestroy, OnInit} from '@angular/core';
import {AnalyticsService} from './@core/utils/analytics.service';
import {ConfigService} from "../zmWeb/bsModule/config/ConfigService";

@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit,OnDestroy{

  constructor(private analytics: AnalyticsService, private configService:ConfigService) {
  }

  ngOnInit(): void {
    this.analytics.trackPageViews();
    // this.configService.initServiceConfig();
  }

  ngOnDestroy(): void {

  }
}

