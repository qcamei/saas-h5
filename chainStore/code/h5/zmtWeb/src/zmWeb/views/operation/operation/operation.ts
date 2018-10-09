import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy} from '@angular/core';
import {WorkFlowMgr} from "../../../bsModule/workFlow/WorkFlowMgr";
import { AppUtils} from "../../../comModule/AppUtils";
import {WorkFlowTypeMgr} from "../../../bsModule/workFlowType/WorkFlowTypeMgr";
import {OperationViewDataMgr} from "../OperationViewDataMgr";

import {OperationDialog} from "./../dialog/operationDialog"
import {AppRouter} from "../../../comModule/AppRouter";
import {StoreLeaguerInfoSynDataHolder} from "../../../bsModule/storeLeaguerInfo/StoreLeaguerInfoSynDataHolder";
import {PromptMsg} from "../../common/Util/PromptMsg";
import {OperationViewData} from "./OperationViewData";
import {OperationService} from "./OperationService";
import {Popup} from "../../common/popup/popup";
import {MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../zmComp/modal/ZmModalMgr";



/**
 * 店务流程页面
 */
@Component({
  selector:'operation',
  templateUrl:'operation.html',
  styleUrls: ['operation.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class OperationPage implements OnInit,OnDestroy {

  public  viewDataSub:any;
  private service: OperationService;
  public viewData:OperationViewData;

  constructor(private workFlowMgr:WorkFlowMgr,
              private workFlowTypeMgr:WorkFlowTypeMgr,
              private storeLeaguerInfoSynDataHolder:StoreLeaguerInfoSynDataHolder,
              private operationViewDataMgr:OperationViewDataMgr,
              private cdRef: ChangeDetectorRef,
              private matDialog: MatDialog) {
    ZmModalMgr.getInstance().reset(matDialog);
    this.service = new OperationService(
      this.workFlowMgr,
      this.workFlowTypeMgr,
      this.storeLeaguerInfoSynDataHolder,
      this.operationViewDataMgr);
  }



  ngOnInit(){
    this.operationViewDataMgr.setOperationListViewData(new OperationViewData());
    this.viewDataSub = this.operationViewDataMgr.subscribeOperationListViewDataVD((viewDataP: OperationViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.service.initViewData(this.viewData.curPage);
  }

  ngOnDestroy(): void {
    if(!AppUtils.isNullObj(this.viewDataSub)){
      this.viewDataSub.unsubscribe();
    }
  }

  //跳转会员详情
  goLeaguer(leaguerId):void{
    AppRouter.goLeaguerDetail(leaguerId);
  }


  /**
   * 进入工作流
   */
  public async  joinWorkFlow(workFlowId, workFlowTypeId) {
    let workFlowTypeMap = this.viewData.wFTypeMap;
    let workFlowType = workFlowTypeMap.get(workFlowTypeId);
    if (workFlowType) {
      if (workFlowType.wfCompName == "开单收银") {
        AppRouter.goConsume(workFlowId);
      }
      if (workFlowType.wfCompName == "会员充值") {
        AppRouter.goRecharge(workFlowId);
      }
    }
  }

  /**
   * 删除工作流
   */
  removeWorkFlow(workFlowId) {

    Popup.getInstance().open("提示", "确定删除工作流？", () => {
      this.workFlowMgr.deleteWorkFlow(workFlowId).then(
        (success) => {
          this.service.initViewData(this.viewData.curPage);
          this.dealResult(success);
        }
      );
    });
  }

  private  dealResult(successP: boolean) {
    if (successP == true) {
      AppUtils.showSuccess(PromptMsg.PROMPT, PromptMsg.DELETE_SUCCESS);
    } else {
      AppUtils.showError(PromptMsg.PROMPT, PromptMsg.DELETE_ERROR);
    }

  }

  /**
   * 分页回调
   */
  public getPageData(curPage){
    this.service.getPageData(curPage,this.viewData,(viewDataTmp: OperationViewData) => {
      this.service.handleViewData(viewDataTmp);
    })
  }

  public queryByNameOrPhone(){
    if(!AppUtils.isNullObj(this.viewData.leaguerNameOrPhone)){
      this.viewData.leaguerNameOrPhone = AppUtils.trimBlank(this.viewData.leaguerNameOrPhone);
    }
    this.service.getPageData(1,this.viewData,(viewDataTmp: OperationViewData) => {
      this.handleResult(viewDataTmp);
    });
  }


  private handleResult(viewDataTmp){
    viewDataTmp.curPage = 1;
    this.service.handleViewData(viewDataTmp);
  }

  openDialog():void{
    ZmModalMgr.getInstance().newModal(OperationDialog,null,null);
  }

}

