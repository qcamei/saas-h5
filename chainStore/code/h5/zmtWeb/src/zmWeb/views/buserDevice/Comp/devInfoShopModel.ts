import {Component, Input, Output, OnInit, Inject} from '@angular/core';
import {AddStoreDeviceData} from "../../../bsModule/buserDevice/apiData/AddStoreDeviceData";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {BUserDeviceUpdateForm} from "../../../bsModule/buserDevice/apiData/BUserDeviceUpdateForm";
import {BUserDeviceUpdateType} from "../../../bsModule/buserDevice/apiData/BUserDeviceUpdateType";
import {BUserDeviceMgr} from "../../../bsModule/buserDevice/BUserDeviceMgr";
import {Store} from "../../../bsModule/store/apiData/Store";
import {AppUtils} from "../../../comModule/AppUtils";

import {RadioItem} from "../../zmComp/form/ZmInputRadio";
import {MAT_DIALOG_DATA} from "@angular/material";


@Component({
  selector: 'devInfo-modal',
  template: `
  <div>
   <div  mat-dialog-title>
      <span class="font-bold">分配到店</span>
    </div>
    <div  mat-dialog-content fxLayout="row wrap" fxLayoutAlign="start center">

      <label class="text-truncate custom-control input-group-lg  custom-radio" style="margin:0 10px 10px 0;width:23%;" *ngFor="let item of storeList">
          <input type="radio"  required class="custom-control-input" name="customRadio" [checked]="selectStoreId==item.id" (click)="selectedStore(item.id)">
          <span class="custom-control-indicator"></span>
          <span class="custom-control-description">{{item.name}}</span>
      </label><br>
                        
    </div>
    <div fxLayout="row" fxLayoutAlign="end" mat-dialog-actions class="mt-20">
      <button class="btn c-md-btn-modal c-close-btn-modal" style="margin-right: 20px;"  (click)="closeModal()">取消</button>
      <button class="btn c-md-btn-modal c-btn-blue" (click)="addStoreDevice()" >确认</button>
     
    </div>
  </div>
  `,
  styles:[`
    .custom-control .custom-control-input:checked ~ .custom-control-indicator{
      background-color:#4678fa !important;
    }
    .c-md-btn-modal{
      width: 140px;
      padding: 12px 0 !important;
      outline: none;
    }
    .c-close-btn-modal{
      border: 2px solid#03a9f4 !important;
      color:#03a9f4 !important;
      background-color: #fff;
    }
    .c-btn-blue {
      color: #fff;
      border-color:#03a9f4 !important;
      background-color:#03a9f4 !important;
    }
    
  `]
})
export class DevInfoComponent implements OnInit{


  private service: DevInfoCompSevice;
  public storeId:string = "";
  public curValue:RadioItem;
  @Input() storeList: Array<Store>;
  @Input() selectStoreId: string;
  @Input() id:number;
  @Output() callBack: (success) => boolean;
  private activeModal:any;

  constructor(@Inject(MAT_DIALOG_DATA) public dataInput:any,private buserDeviceMgr: BUserDeviceMgr,) {
    this.activeModal = dataInput.modalCtrl;
    this.service = new DevInfoCompSevice(this.buserDeviceMgr);
  }

  ngOnInit(){

  }


  closeModal() {
    this.activeModal.close();
  }

  public selectedStore(storeId:string){
    this.selectStoreId = storeId;
  }

  public addStoreDevice() {
    let arr = this.hasCheckedStore();

    if(AppUtils.arrayContains(arr,true)){
      let updateForm:BUserDeviceUpdateForm = this.getUpdateForm();

      this.service.addStoreDevice(this.id, updateForm).then(
        (success) => {
          this.handleResult(success);
        }
      );

    }else{
      AppUtils.showWarn("提示","请选择店铺");
    }

  }

  private hasCheckedStore(){
    let a = document.getElementsByTagName("input");
    let arr = [];
    for(let i = 0;i<a.length;i++){
      arr.push(a[i].checked);
    }
    return arr;
  }

  private getUpdateForm(){
    let addStoreDeviceData: AddStoreDeviceData = new AddStoreDeviceData();
    addStoreDeviceData.buserId = SessionUtil.getInstance().getUserId();
    addStoreDeviceData.storeId = this.selectStoreId;

    let updateForm: BUserDeviceUpdateForm = new BUserDeviceUpdateForm();
    updateForm.buserId = SessionUtil.getInstance().getUserId();
    updateForm.updateType = BUserDeviceUpdateType.AddStoreDevice;
    updateForm.addStoreDeviceData = addStoreDeviceData;

    return updateForm;
  }

  private handleResult(success) {
    if (success) {
      AppUtils.showSuccess("提示","分配到店成功");
      this.closeModal();
      this.callBack(success);
    } else {
      AppUtils.showError("提示","分配到店失败");
      this.callBack(success);
    }
  }

}

export class DevInfoCompSevice {
  constructor(private buserDeviceMgr: BUserDeviceMgr,) {

  }



  public addStoreDevice(id, updateForm: BUserDeviceUpdateForm): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.buserDeviceMgr.update(id, updateForm).then(
        (success) => {
          resolve(success);
        });

    });
  }
}
