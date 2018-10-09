import {Component, ElementRef, Injector, OnInit, ViewChild} from '@angular/core';
import {IonicPage, ModalController} from "ionic-angular";
import {AppCfg} from "../../comModule/AppCfg";
import {TimeSlotHelper} from "../zmComp/form/date/timeSlot/TimeSlotHelper";
import {TimeSlotEnum} from "../zmComp/form/date/timeSlot/TimeSlotEnum";
import {AppRouter} from "../zmComUtils/AppRouter";

@IonicPage()
@Component({
  template: `


        <zm-page-header title="header"></zm-page-header>
        <!--&lt;!&ndash;<zm-root-page-header title="header"></zm-root-page-header>&ndash;&gt;-->
        <zm-page-content>

          <!--<button ion-button block icon-left color="light" (tap)="showAreasSelect()">地区选择</button>-->
          <!--<areas-select #areasSelect [level]="3" (cancel)="closeSelect()" (done)="done($event)"></areas-select>-->

          <!--<button ion-button block icon-left color="light" (tap)="showPickerSelect()">自定义选择器</button>-->
          <!--<zmb-picker-select #pickerSelect [level]="3" (cancel)="closeSelect()" (done)="done($event)"></zmb-picker-select>-->
        <!---->
        <!--&lt;!&ndash;客户信息组件&ndash;&gt;-->
        <!--&lt;!&ndash;<zmbUser-info [imgUrl]="'assets/img/avatar.jpeg'" [name]="'小妹妹'" [sex]="true" [phone]="'184844584545454'"></zmbUser-info>&ndash;&gt;-->
        <!--&lt;!&ndash;<zmbSms-phone [startActive]="true" [showStar]="true" (zmbtnClick)="zmClick($event)"></zmbSms-phone>&ndash;&gt;-->
         <!--<zmbAppoint-list [imgUrl]="'assets/img/avatar.jpeg'" [itemName]="'拉世纪东方6'" [itemTag]="'jsdf'" [count]="'2'"></zmbAppoint-list>-->
          <!---->
          <!--<zmk-appointment-list dateTime="'151514'" appoinTime="215141" productList=""></zmk-appointment-list>-->
          <!--<zmk-appointment-item createTime="'2018:12:21'" time="18:60" state="state"buserName="buserName" itemList="itemList" ></zmk-appointment-item>-->
          <!--<zmk-store-card></zmk-store-card>-->
          <!--<zmk-inner-item></zmk-inner-item>    -->
          <!--<zm-calendar-show></zm-calendar-show>-->
          <!--日期时间选择组件-->
          <!--<zm-date></zm-date>-->
          <!--<zm-time></zm-time>-->
          <zm-date-time></zm-date-time>
          <!--<zm-select-timePeriod [timeSlotEnums]="timeSlotEnums" (action)="findList($event)"></zm-select-timePeriod>-->
         
          <!--<zm_up_file [maxCount]="9" [limitCount]="6" [label]="'上传图片'" [requestUrl]="requestUrl" [appendKey]="'imgs'" [AppearanceButton]="false" (callback)="uploadCallback($event)"></zm_up_file>-->
         <!--<zm-img-upload [(imgList)]="imgList"></zm-img-upload>-->
         
         <!--<zm-city-picker></zm-city-picker>-->
         <!--<zm-input-textarea></zm-input-textarea>-->
         <!--<zm-btn-sub [name]="'测试'" (zmbtnClick)="openModal()"></zm-btn-sub>-->
         <!--<zm-big-img-preview [(imgList)]="imgList" ></zm-big-img-preview>-->

         
        </zm-page-content>
            `,

})

export class TestPage implements OnInit {
  isTrue = true;
  buserName;
  itemList;

  constructor( private modalCtrl:ModalController,protected rt: ElementRef, protected ij: Injector) {

  }

  ngOnInit() {

  }

  zmClick(e) {
    if (e == 2) {
      this.isTrue = !this.isTrue;
    }
  }

  changess(timeSlot) {
    console.log("timeSlot: " + JSON.stringify(timeSlot));
    console.log("timeSlot string: " + TimeSlotHelper.formatTimeSlot(timeSlot));
  }

  findList() {
    console.log("do find ");
  }

  openModal() {
    AppRouter.getInstance().openModelWithTargetObj("zmTimeSlot", this.timeSlotEnums, this.changess.bind(this));
  }


  timeSlotEnums = [TimeSlotEnum.TODAY, TimeSlotEnum.THIS_MONTH, TimeSlotEnum.LAST_MONTH];
  requestUrl = AppCfg.getInstance().getServiceAddress() + "/img/saveImgs/img/product/" + 15 + "_" + 123;
  imgList = ["http://192.168.40.220/img/logo/goods/goodList.png", "http://192.168.40.220/img/logo/goods/goodList.png", "http://192.168.40.220/img/logo/goods/goodList.png"];

  onDayClick(ev) {
    console.log(ev);
  }

  uploadCallback(ev) {
    console.log("uploadCallback： " + ev);
  }

  //
  // @ViewChild(PageContent) loadRef: PageContent;
  // ionViewDidEnter(){
  //   if(this.loadRef){
  //     this.loadRef.startLoad();
  //     setTimeout(() => {
  //       console.log('Async operation has ended');
  //       this.loadRef.endLoad();
  //     }, 4000);
  //   }
  //
  // }


  /*
  @ViewChild('areasSelect') areasSelect;
  showAreasSelect() {
    this.areasSelect.open();
  }
  done(data) {
    console.log(JSON.stringify(data));
  }
  closeSelect() {
    console.log('you click close');
  }

  @ViewChild('pickerSelect') pickerSelect;
  showPickerSelect() {
    this.pickerSelect.open();
  }
*/


}

