import {NgModule} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {ZmTabs} from "./tab/ZmTabs";
import {IonicModule} from "ionic-angular";
import {RootPageHeader} from "./layout/RootPageHeader";
import {PageHeader} from "./layout/PageHeader";
import {PageContent} from "./layout/PageContent";
import {ZmBtnNew} from "./btn/ZmBtnNew";
import {ZmBtnSmall} from "./btn/ZmBtnSmall";
import {ZmNoData} from "./others/ZmNoData";
import {ZmPipeModule} from "./pipe/zmPipe.module";
import {ModalHeader} from "./layout/ModalHeader";
import {ZmCard} from "./layout/ZmCard";
import {ZmCollapse} from "./layout/ZmCollapse";
import {ZmBtnIcon} from "./btn/ZmBtnIcon";
import {ZmBtnCount} from "./btn/ZmBtnCount";
import {ZmBtnItemPush} from "./btn/ZmBtnPush";
import {ZmCalendar4Show} from "./calendar/ZmCalendar4Show";
import {CalendarModule, CalendarDateFormatter} from "angular-calendar";
import {CustomDateFormatter} from "./calendar/CustomDateFormatter";
import {ZmPage} from "./pagination/ZmPage";
import {InfoPictureTemplate} from "./layout/InfoPictureTemplate";
import {ListViewModel} from "./layout/ListViewModel";
import {PerformanceHeader} from "./layout/PerformanceHeader";
import {ZmBtnSubmit} from "./btn/ZmBtnSubmit";
import {ZmUpFile} from "./form/file/ZmUpFile";
import {ZmListInfinit} from "./list/ZmListInfinit";
import { ZmBtnImg } from './btn/ZmBtnImg';
import {FlexLayoutModule} from "@angular/flex-layout";
import {PaginationComponent} from "./pagination/pagination.component";
import { ZmTabsCustom } from './tab/ZmTabs-custom';

@NgModule({
  declarations: [

    //layout
    RootPageHeader,
    PageHeader,
    ModalHeader,
    PageContent,
    ZmCard,
    ZmCollapse,
    ListViewModel,
    InfoPictureTemplate,
    PerformanceHeader,
    ZmListInfinit,

    //btn
    ZmBtnNew,
    ZmBtnSmall,
    ZmBtnIcon,
    ZmBtnItemPush,
    ZmBtnCount,
    ZmBtnSubmit,
    ZmBtnImg,

    //calendar
    ZmCalendar4Show,

    ZmNoData,

    ZmTabs,
    ZmTabsCustom,
    ZmPage,
    PaginationComponent,
    ZmUpFile,

  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ZmPipeModule,
    CalendarModule,
    FlexLayoutModule,
  ],
  providers: [ { provide: CalendarDateFormatter, useClass: CustomDateFormatter}],
  exports:[
    FlexLayoutModule,
    ZmPipeModule,

    //layout
    RootPageHeader,
    PageHeader,
    ModalHeader,
    PageContent,
    ZmCard,
    ZmCollapse,
    ListViewModel,
    InfoPictureTemplate,
    PerformanceHeader,
    ZmListInfinit,

    //btn
    ZmBtnNew,
    ZmBtnSmall,
    ZmBtnIcon,
    ZmBtnItemPush,
    ZmBtnCount,
    ZmBtnSubmit,
    ZmBtnImg,
    //calendar
    ZmCalendar4Show,

    ZmNoData,

    ZmTabs,
    ZmTabsCustom,
    ZmPage,
    PaginationComponent,
    ZmUpFile,


  ]
})
export class ZmCompModule {

  constructor(){
  }

}
