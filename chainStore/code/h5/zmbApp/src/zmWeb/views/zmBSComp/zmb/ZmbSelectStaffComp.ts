import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit,Output} from "@angular/core";
import {AppRouter} from "../../zmComUtils/AppRouter";
import {StaffExChangeData} from "../../storeLeaguerInfo/selectStaff/StaffExChangeData";
import {StaffItemData} from "../../storeLeaguerInfo/selectStaff/StaffItemData";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {StoreClerkInfo} from "../../../bsModule/storeClerkInfo/data/StoreClerkInfo";
import {StoreClerkInfoMgr} from "../../../bsModule/storeClerkInfo/StoreClerkInfoMgr";
import {AppUtils} from "../../../comModule/AppUtils";
import {BUser} from "../../../bsModule/buser/data/BUser";
import {BUserMgr} from "../../../bsModule/buser/BUserMgr";

/**
 * 选择跟进人员/服务人员组件 多选
 * <zmb-select-staff [placeHolder]="'请选择跟进人员'" [(idArr)]="viewData.addForm.buserIds"></zmb-select-staff>
 */
@Component({
  selector: 'zmb-select-staff',
  template: `
              <div *ngIf="!Background" >
                  <div  *ngIf="getStaffName()==''" (click)="goSelectStaff()" w-100 fxLayout="row" fxLayoutAlign="end center" style="color:#999;"><span>{{placeHolder}}</span> <ion-icon style="color:#999;"  name="arrow-forward"></ion-icon></div>
              
                  <div *ngIf="getStaffName() !=''" (click)="goSelectStaff()" fxLayout="row" fxLayoutAlign="space-between center"
                      style="color:#333;">
                      <span style="width:100%;" text-right overflow-hidden-1>{{getStaffName()}}</span>
                  </div>
              </div>

              <div *ngIf="Background" style="padding:0 10px;background:#f4f4f4;">
                  <div  *ngIf="getStaffName()==''" (click)="goSelectStaff()" w-100 fxLayout="row" fxLayoutAlign="space-between center" style="padding:10px 0;color:#999;border-top:1px solid #ccc;"><span>{{placeHolder}}</span> <ion-icon style="color:#999;"  name="arrow-forward"></ion-icon></div>
              
                  <div *ngIf="getStaffName() !=''" (click)="goSelectStaff()" fxLayout="row" fxLayoutAlign="space-between center"
                      style="color:#333;border-top:1px solid #ccc;padding:10px 0;">
                      <span>{{label}}</span>
                      <span style="width:80%;" text-right overflow-hidden-1>{{getStaffName()}}</span>
                  </div>
              </div>
  `
})
export class ZmbSelectStaffComp implements OnInit {

  @Input() placeHolder:string="请选择跟进人员";
  @Input() label:string="跟进人员";
  @Input() Background:boolean=false;
  @Output() selectCallback = new EventEmitter();
  @Output() idArrChange = new EventEmitter();
  private idArrTmp:Array<string>;

  private staffList:Array<StaffItemData> = new Array<StaffItemData>();//跟进人员列表

  @Input()
  get idArr() :Array<string>{
    return this.idArrTmp;
  }

  set idArr(val:Array<string>) {
    this.idArrTmp = val;
    this.idArrChange.emit(this.idArrTmp);
  }

  ngOnInit() {
    this.buildData();
  }

  /**
   * 获取跟进人员名称
   * @returns {any}
   */
  getStaffName():string{
    let nameArr = [];
    this.staffList.forEach((item:StaffItemData)=>{
      if(item.selected){
        nameArr.push(item.name);
      }
    });
    if(nameArr.length>0){
      return nameArr.join("、");
    }else{
      return "";
    }
  }

  /**
   * 初始换跟进人员列表
   * @returns {Promise<void>}
   */
  async buildData(){
    let storeId = SessionUtil.getInstance().getStoreId();
    let storeClerkInfoId = SessionUtil.getInstance().getIdByStoreId(storeId);
    let storeClerkInfo: StoreClerkInfo = await StoreClerkInfoMgr.getInstance().get(storeClerkInfoId);
    if (!AppUtils.isNullObj(storeClerkInfo)) {
      let idArr = storeClerkInfo.getClerkMap().keys();
      if (idArr.length > 0) {
        let buserList: Array<BUser> = await BUserMgr.getInstance().findByMultitId(idArr);
        this.staffList = buserList.map((buser: BUser) => {
          return StaffItemData.fromBuser(buser);
        })
      }
    }

    if(this.idArr && this.idArr.length>0){
      for(let i=0;i<this.idArr.length;i++){
        let id = this.idArr[i];
        for(let j=0;j<this.staffList.length;j++){
          let staffItem = this.staffList[j];
          if(staffItem.id == id){
            staffItem.selected = true;
            break;
          }
        }
      }
    }
  }

  /**
   * 跳转选择跟进人员
   */
  // goSelectStaff() {
  //   StaffExChangeData.getInstance().setStaffList(this.staffList);
  //   AppRouter.getInstance().goSelectStaffPage(()=>{
  //     this.idArr.splice(0,this.idArr.length);
  //     this.staffList.forEach((item:StaffItemData)=>{
  //       if(item.selected){
  //         this.idArr.push(item.id);
  //       }
  //     })
  //     console.log(this.idArr)
  //     this.selectCallback.emit();
  //   });
  // }

  /**
   * 跳转选择跟进人员
   */
  goSelectStaff() {
    AppRouter.getInstance().goSelectStaffPage(this.staffList, this.selectedCallback.bind(this));
  }

  selectedCallback(staffList:Array<StaffItemData>){
    this.idArr.splice(0,this.idArr.length);
    let selectedIds = [];
    staffList.forEach((item:StaffItemData)=>{
      if(item.selected){
        selectedIds.push(item.id);
      }
    });
    this.idArr = selectedIds;
  }


}
