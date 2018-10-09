import {Component, Input, Inject} from '@angular/core';
import {Store} from "../../../bsModule/store/apiData/Store";
import {Leaguer} from "../../../bsModule/storeLeaguerInfo/data/Leaguer";
import {ImportSuccessPopup} from "../popup/ImportSuccessPopup";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {StoreLeaguerInfoMgr} from "../../../bsModule/storeLeaguerInfo/StoreLeaguerInfoMgr";
import {StoreLeaguerInfoSynDataHolder} from "../../../bsModule/storeLeaguerInfo/StoreLeaguerInfoSynDataHolder";
import {StoreLeaguerInfo} from "../../../bsModule/storeLeaguerInfo/data/StoreLeaguerInfo";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {RestResp} from "../../../comModule/RestResp";
import {setPopup} from "../popup/setPopup";
import {ImportDataViewData} from "../comp/importDataComponent";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../zmComp/modal/ZmModalMgr";

/**从店铺导入会员组件**/

@Component({
  selector: 'leaguerLead_modal',
  template: `


   <div animation-modal >
            <h2 mat-dialog-title>
               店铺会员导入
            </h2>
            <mat-dialog-content fusePerfectScrollbar>
                                              
                  <zm-select [noAll]="true" [label]="'选择会员来源'" name="name" value="id"  [selectList]="data.storeList" [(zmValue)]="data.storeId" (selectCallback)="queryListByStoreId()"></zm-select>            
                           
                   <ng-template #tdA let-item="item">{{item.name}}</ng-template>
                   <ng-template #tdB let-item="item">{{item.phone}}</ng-template>
                          
                   <zm-mat-table-checkbox  [tdTemplateList]="[tdA,tdB]" [thNameList]="['姓名','手机号']" [itemList]="data.leaguerList"></zm-mat-table-checkbox>
                      
                      
                   <no-data [loadingFinish]="viewData.loadingFinish" [dataList]="data.leaguerList" [text]=" '没有数据' " [showImg]="'noData'"></no-data>
            
            </mat-dialog-content>
            <mat-dialog-actions fxLayout="row" fxLayoutAlign="end" fxLayoutGap="20px">
                  <zm-btn-md  [stroked] = "true"(click)="closeModal()" name="取消"></zm-btn-md>
                <zm-btn-md  (click)="importData()" name="批量导入"></zm-btn-md>
            </mat-dialog-actions>
      </div>


  `,
  styleUrls: ['./modal.scss']
})
export class LeaguerLeadModal{

  @Input() data:LeaguerLeadViewData;
  public viewData: LeaguerLeadViewData = new LeaguerLeadViewData();
  public isSlectedAll:boolean = false;

  private activeModal: any;
  private modalService:any;
  constructor(
              private storeLeaguerInfoMgr: StoreLeaguerInfoMgr,
              private storeLeaguerInfoSynDataHolder: StoreLeaguerInfoSynDataHolder,
              @Inject(MAT_DIALOG_DATA) dataInput:any,
              matDialog: MatDialog) {
    this.activeModal = dataInput.modalCtrl;
    this.modalService = ZmModalMgr.newInstance(matDialog);
  }

  public selectAll(){
    let leaguerListTmp:Array<Leaguer> = new Array<Leaguer>();
    let list = this.data.leaguerList;
    for(let item of list){
      let leaguerTmp = new Leaguer();
      AppUtils.copy(leaguerTmp,item);
      leaguerTmp.checked = this.isSlectedAll;
      leaguerListTmp.push(leaguerTmp);
    }
    this.data.leaguerList = leaguerListTmp;
  }

  public checkList() {
    let checkList = new Array<boolean>();
    for (let item of  this.data.leaguerList) {
      checkList.push(item.checked);
    }
    if (AppUtils.arrayContains(checkList, false)) {
      this.isSlectedAll = false;
    } else {
      this.isSlectedAll = true;
    }
  }


  public closeModal() {
    this.activeModal.close();
  }

  public async queryListByStoreId(){
    let storeId = this.data.storeId;
    let storeLeaguerInfo:StoreLeaguerInfo = await this.storeLeaguerInfoSynDataHolder.getData(storeId);
    let leaguerLMap:ZmMap<Leaguer> = storeLeaguerInfo.getValidLeaguerMap();//显示简版信息
    this.data.leaguerList = leaguerLMap.values();
  }

  public async importData(){
      AppUtils.showMask("正在上传。。。");
      this.buildTargetList();
      if(this.viewData.targetList.length>0){
        this.activeModal.close();

        let leaguerIds:string = this.buildLeaguerIds();
        let storeId:string = SessionUtil.getInstance().getStoreId();
        let restResp:RestResp = await this.storeLeaguerInfoMgr.addListOfLeaguerIds(storeId,leaguerIds);
        AppUtils.closeMask();
        this.handleResult(restResp);
      }else{
        AppUtils.showWarn("提示","请至少选择一条数据");
      }

    }

  private buildTargetList(){
    this.viewData.targetList = this.data.leaguerList.filter(
      (item)=>{
        if(item.checked == true){
          return true;
        }
      }
    );
  }
  private buildLeaguerIds(){
    let idArr:Array<String> = new Array<String>();
    this.viewData.targetList.forEach((item:Leaguer)=>{
      idArr.push(item.id);
    });
    let leaguerIds = idArr.join(",");
    return leaguerIds;
  }


  private handleResult(restResp:RestResp){
    if(restResp.code == 200){
      // const activeModal = this.modalService.open(ImportSuccessPopup, {backdrop: 'static'});
      const activeModal = this.modalService.newModal(ImportSuccessPopup, null,null);
      activeModal.componentInstance.setContent = "会员" + "数据导入成功";
      activeModal.componentInstance.tips = restResp.tips;
      if(restResp.tips == "成功"){
        activeModal.componentInstance.tips = "";
      }
      activeModal.componentInstance.section = "会员";
    }else {
      this.failModal();
    }
  }

  private failModal(){
    // const activeModal = this.modalService.open(setPopup,{backdrop: 'static'});
    const activeModal = this.modalService.newModal(setPopup, null,null);
    activeModal.componentInstance.title = "导入失败";
    activeModal.componentInstance.setContent = "数据有误，请重新导入";
    activeModal.componentInstance.btnText = "";
    activeModal.componentInstance.confirmBtn = "确定";
  }
}

export class LeaguerLeadViewData{
  public storeId:string;
  public storeList:Array<Store> = new Array<Store>();
  public leaguerList:Array<Leaguer> = new Array<Leaguer>();

  public targetList:Array<Leaguer> =  new Array<Leaguer>();
  public loadingFinish:boolean = true;

  constructor(){

  }

  public static fromParentComp(viewData:ImportDataViewData){
    let leaguerLeadViewData = new LeaguerLeadViewData();
    leaguerLeadViewData.storeId = viewData.defaultStoreId;
    leaguerLeadViewData.storeList = viewData.storeList;
    leaguerLeadViewData.leaguerList = viewData.leaguerList;
    return leaguerLeadViewData;
  }
}
