import {BrowserModule, HAMMER_GESTURE_CONFIG} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import {StatusBar} from '@ionic-native/status-bar';
import {MyApp} from "./app.component";
import {ZmComModule} from "../zmWeb/comModule/ZmCom.module";
import {CalendarModule} from "angular-calendar";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
// import { zhcn, extra } from './zh-cn/locale';
import {registerLocaleData} from "@angular/common";

import localeZh from "@angular/common/locales/zh"
import {ConfigBsModule} from "../zmWeb/comModule/config/Config.bsModule";
import {Keyboard} from "@ionic-native/keyboard";
import {HttpInterceptorService} from "ng-http-interceptor";
import {ZmHttpInterceptor} from "../zmWeb/comModule/ZmHttpInterceptor";
import {FlexLayoutModule} from "@angular/flex-layout";
import { MultiPickerModule } from '../../node_modules/ion-multi-picker';
import {FileTransfer} from "@ionic-native/file-transfer";
import {Camera} from "@ionic-native/camera";
import {GalleryModalModule, GalleryModalHammerConfig} from "ionic-gallery-modal";
// import {MultiPickerModule} from 'ion-multi-areasPicker';
registerLocaleData(localeZh, 'zh-cn');
// registerLocaleData(zhcn, 'zh-cn');


@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    MultiPickerModule,
    BrowserModule,
    BrowserAnimationsModule,

    CalendarModule.forRoot(),
    IonicModule.forRoot(MyApp, {
      mode: 'ios',
      backButtonText: '返回',
      scrollPadding: false,
      scrollAssist: false,
      autoFocusAssist: false
    }),
    IonicStorageModule.forRoot({
      name: 'com.zenmind.zmApp',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
    ZmComModule,
    //app module
    ConfigBsModule,
    FlexLayoutModule,
    GalleryModalModule,

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    Keyboard,
    HttpInterceptorService,
    ZmHttpInterceptor,
    { provide: ErrorHandler,useClass: IonicErrorHandler},
    { provide: HAMMER_GESTURE_CONFIG,useClass: GalleryModalHammerConfig},


    Camera,
    FileTransfer,
  ],
  exports:[
  ]
})

export class AppModule {

  constructor(){
  }
}
