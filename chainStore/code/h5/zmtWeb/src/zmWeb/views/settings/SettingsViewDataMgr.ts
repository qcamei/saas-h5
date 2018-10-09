import {Injectable} from "@angular/core";
import {SetSourceViewData} from "./setSource/setSource";
import {BehaviorSubject, Subject} from "rxjs";
import {SetTypeViewData} from "./setType/setType";
import {SetAppointmentViewData} from "./setAppointment/setAppointment";
import {SetAttributeViewData} from "./setAttribute/setAttributeViewData";
import {SetBossPayInfoViewData} from "./setBossPayInfo/setBossPayInfo";


@Injectable()
export class SettingsViewDataMgr {

  private setSourceVD: Subject<SetSourceViewData> = new BehaviorSubject<SetSourceViewData>(null);
  private setTypeVD: Subject<SetTypeViewData> = new BehaviorSubject<SetTypeViewData>(null);
  private setAppointVD: Subject<SetAppointmentViewData> = new BehaviorSubject<SetAppointmentViewData>(null);
  private setAttributeVD: Subject<SetAttributeViewData> = new BehaviorSubject<SetAttributeViewData>(null);
  private setBossPayInfoVD: Subject<SetBossPayInfoViewData> = new BehaviorSubject<SetBossPayInfoViewData>(null);

  //setSourceVD
  public setSourceViewData(setSourceViewData:SetSourceViewData):void{
    this.setSourceVD.next(setSourceViewData);
  }

  public subscribeSetSourceVD(func:(setSourceViewData:SetSourceViewData)=>void){
    this.setSourceVD.subscribe(func);
  }

  //setTypeVD
  public setTypeViewData(setTypeViewData:SetTypeViewData):void{
    this.setTypeVD.next(setTypeViewData);
  }

  public subscribeSetTypeVD(func:(setTypeViewData:SetTypeViewData)=>void){
    this.setTypeVD.subscribe(func);
  }

  //setAppointVD
  public setAppointViewData(setAppointmentViewData:SetAppointmentViewData):void{
    this.setAppointVD.next(setAppointmentViewData);
  }

  public subscribeSetAppointVD(func:(setAppointmentViewData:SetAppointmentViewData)=>void){
    this.setAppointVD.subscribe(func);
  }

  //setAttributeVD
  public setAttributeViewData(setAttributeViewData:SetAttributeViewData):void{
    this.setAttributeVD.next(setAttributeViewData);
  }

  public subscribeSetAttributeVD(func:(setAttributeViewData:SetAttributeViewData)=>void){
    this.setAttributeVD.subscribe(func);
  }

  //setBossPayInfoVD
  public setBossPayInfoViewData(setBossPayInfoViewData:SetBossPayInfoViewData):void{
    this.setBossPayInfoVD.next(setBossPayInfoViewData);
  }

  public subscribeSetBossPayInfoVD(func:(setBossPayInfoViewData:SetBossPayInfoViewData)=>void){
    this.setBossPayInfoVD.subscribe(func);
  }

}
