import {
  Output,
  Component,
  EventEmitter,
} from "@angular/core";
import {TimeSlotEnum} from "./TimeSlotEnum";
import {TimeSlot} from "./TimeSlot";
import {TimeSlotHelper} from "./TimeSlotHelper";
import {AppUtils} from "../../../../../comModule/AppUtils";
import {IonicPage, ViewController, NavParams} from "ionic-angular";
import {ModalCtrl} from "../../../../zmComUtils/ModalCtrl";
import {AppRouter} from "../../../../zmComUtils/AppRouter";

@IonicPage({
  name: "zmTimeSlot",
  segment: 'zmTimeSlot'
})
@Component({
  selector: 'zm-time-slot',
  template: `
      <zm-page-header title=""></zm-page-header>
      <zm-page-content [ftShow]="false">
          <div *ngFor="let item of selectList">
            <div><zm-img-radio [trackType]="itemIndex==item.timeSlotEnum" [label]="item.name" (zmClick)="changeOptions(item,item.timeSlotEnum)"></zm-img-radio></div>
          </div>
          
          <div fxLayout="row" fxLayoutAlign="start center" style="position:relative;">
              <zm-img-radio fxFlex="1 1 10%" [trackType]="itemIndex==-1" (zmClick)="changeOptions(item,-1)"></zm-img-radio>
              <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="10px">
                <div style="position: relative;"><date-pic [(currentValue)]="minTime"></date-pic></div>
                <span style="font-size:12px;">至</span>
                <div style="position:relative;"><date-pic  [(currentValue)]="maxTime"></date-pic></div>
              </div>
          </div>
          <zm-btn-sub [name]="'确定'" (zmbtnClick)="confirmTime()"></zm-btn-sub>
      </zm-page-content>
`
})
/**
 * 时间段选择组件
 */
export class ZmTimeSlot{

  public timeSlotEnums: Array<TimeSlotEnum>;
  @Output() zmValueChange: EventEmitter<any> = new EventEmitter<any>();

  public selectList:Array<ItemData> = new Array<ItemData>();
  public itemDataTmp:ItemData;
  public timeSlotTmp:TimeSlot;
  public itemIndex:number = TimeSlotEnum.TODAY;
  public minTime:string;
  public maxTime:string;

  public modalCtrl:ModalCtrl;
  constructor(private navParams: NavParams,
              private viewCtrl: ViewController){
    this.modalCtrl = ModalCtrl.newCtrl(viewCtrl);
  }

  ionViewDidEnter() {
    this.initData();
  }

  initData(){
    let targetObj = AppRouter.getInstance().getTargetObj(this.navParams);
    this.timeSlotEnums = targetObj.timeSlotEnums;
    this.timeSlotTmp = targetObj.curValue;
    this.itemIndex = targetObj.curValue.getTimeSlotEnum();

    this.buildSelectList();
    this.initTime();
  }



  /**
   * 构建 selectList 数组
   */
  buildSelectList(): void {
    if (!this.timeSlotEnums) return;
    this.timeSlotEnums.forEach((timeSlotEnum: TimeSlotEnum) => {
      let name: string = TimeSlotHelper.getLabelByEnum(timeSlotEnum);
      let timeSlot:TimeSlot = TimeSlotHelper.getTimeSlotByEnum(timeSlotEnum);
      let showText:string = TimeSlotHelper.formatTimeSlot(timeSlot);
      if (name) {
        let itemDataTmp = new ItemData(name,timeSlotEnum,timeSlot,showText);
        this.selectList.push(itemDataTmp);
      }
    });
  }

  initTime(){
    if(AppUtils.isNullObj(this.timeSlotTmp)){return;}
    this.minTime = AppUtils.dateToISOString(new Date(this.timeSlotTmp.getMinTime()));
    this.maxTime = AppUtils.dateToISOString(new Date(this.timeSlotTmp.getMaxTime()));
  }

  changeOptions(data:ItemData,index:number){
    this.itemDataTmp = data;
    this.itemIndex = index;
    this.getTimeSlot(this.itemDataTmp);
  }

  getTimeSlot(data:ItemData){
      if(data && this.itemIndex != -1){
        this.minTime = AppUtils.dateToISOString(new Date(data.timeSlot.getMinTime()));
        this.maxTime = AppUtils.dateToISOString(new Date(data.timeSlot.getMaxTime()));
        this.timeSlotTmp = data.timeSlot;
      }else{
        let minTime = AppUtils.isoStrToDate(this.minTime);
        let maxTime = AppUtils.isoStrToDate(this.maxTime);
        this.timeSlotTmp = new TimeSlot(minTime.getTime(),maxTime.getTime(),this.itemIndex);
      }
  }

  confirmTime(){
     if(this.itemIndex == -1){
       let minTime = AppUtils.isoStrToDate(this.minTime);
       let maxTime = AppUtils.isoStrToDate(this.maxTime);
       this.timeSlotTmp = new TimeSlot(minTime.getTime(),maxTime.getTime(),this.itemIndex);
     }

    if(!AppUtils.isNullObj(this.timeSlotTmp) && this.timeSlotTmp.getMinTime()>this.timeSlotTmp.getMaxTime()){
      AppUtils.showWarn("提示","结束时间不能早于开始时间");
      return;
    }
    this.modalCtrl.dismiss(this.timeSlotTmp);
  }

}
export class ItemData{
  name:string;
  timeSlotEnum:number;
  timeSlot:TimeSlot;
  showText:string;

  constructor(nameP:string,timeSlotEnumP:number,timeSlotP:TimeSlot,showTextP:string){
    this.name = nameP;
    this.timeSlotEnum = timeSlotEnumP;
    this.timeSlot = timeSlotP;
    this.showText = showTextP;
  }
}
