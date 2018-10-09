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
import {ListItem} from "./layout/ListItem";
import {PerformanceHeader} from "./layout/PerformanceHeader";
import {ZmBtnSubmit} from "./btn/ZmBtnSubmit";
import {ZmUpFile} from "./form/file/ZmUpFile";
import {ZmListInfinit} from "./list/ZmListInfinit";
import { ZmBtnImg } from './btn/ZmBtnImg';
import {FlexLayoutModule} from "@angular/flex-layout";
import {PaginationComponent} from "./pagination/pagination.component";
import { ZmTabsCustom } from './tab/ZmTabs-custom';
import {ZmBtnUpDown} from "./btn/ZmBtnUpDown";
import {ZmTabSort} from "./tab/ZmTabSort";
import {ZmInputModule} from "./form/zmInput.module";
import {NgxEchartsModule} from "ngx-echarts";
import {ZmLineCharts} from "./charts/lineCharts/ZmLineCharts";

@NgModule({
  declarations: [

    //layout
    RootPageHeader,
    PageHeader,
    ModalHeader,
    PageContent,
    ZmCard,
    ZmCollapse,
    ListItem,
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
    ZmBtnUpDown,

    //calendar
    ZmCalendar4Show,

    ZmNoData,

    ZmTabs,
    ZmTabsCustom,
    ZmTabSort,
    ZmPage,
    PaginationComponent,
    ZmUpFile,

    //charts
    ZmLineCharts,

  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ZmPipeModule,
    CalendarModule,
    FlexLayoutModule,
    NgxEchartsModule,
    ZmInputModule,
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
    ListItem,
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
    ZmBtnUpDown,
    //calendar
    ZmCalendar4Show,
    ZmNoData,

    ZmTabs,
    ZmTabsCustom,
    ZmTabSort,
    ZmPage,
    PaginationComponent,
    ZmUpFile,
    //charts
    ZmLineCharts,

  ]
})
export class ZmCompModule {

  constructor(){
  }

}
