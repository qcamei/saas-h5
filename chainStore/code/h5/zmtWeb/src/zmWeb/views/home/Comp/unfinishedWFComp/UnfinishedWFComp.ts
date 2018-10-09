import {Component, Input, OnChanges, OnInit, ChangeDetectorRef, OnDestroy} from "@angular/core";
import {AppUtils} from "../../../../comModule/AppUtils";
import {WorkFlowMgr} from "../../../../bsModule/workFlow/WorkFlowMgr";
import {AppRouter} from "../../../../comModule/AppRouter";
import {WorkFlowTypeMgr} from "../../../../bsModule/workFlowType/WorkFlowTypeMgr";
import {StoreLeaguerInfoSynDataHolder} from "../../../../bsModule/storeLeaguerInfo/StoreLeaguerInfoSynDataHolder";
import {UnfinishedWFViewDataMgr} from "./UnfinishedWFViewDataMgr";
import {PromptMsg} from "../../../common/Util/PromptMsg";
import {UnfinishedWFCompViewData} from "./UnfinishedWFCompViewData";
import {UnfinishedWFCompService} from "./UnfinishedWFCompService";
import {Popup} from "../../../common/popup/popup";

@Component({
  selector: 'home-unfinishedWF-comp',
  template: `
  <!--有开单收银|会员充值权限-->
    <div class=" addOrder" *ngIf="viewData.leaguerActive == true" >
      <div class="header fz-18">
        开单会员(七日内)
      </div>
      <div class="contet" fusePerfectScrollbar>
        <div class="item disFlex align-center mg-t-20 cur-hand" *ngFor="let item of viewData.workFlowViewDataList;let i = index;"
             (click)="joinWorkFlow(item.id,item.workFlowTypeId)" [ngStyle]="{'margin-top':i === 0 ? '0' : '' }">
          <img src="{{item.headImg|imgPrePath}}" alt="" class="avatar">
          <div class="dib c-message" style="margin-left: 1rem">
            <p class="font-bold fz-18 mg-b-0 c-message">{{item.leaguerName}}</p>
          </div>
          <div style="margin-left: 2.5rem;" class="disFlex flex mg-t-20">

            <div class="step-item text-center flex pos-r">
              <div class="imgDiv pos-r disFlex align-center hor-center imgDivActive" style="z-index: 2;"
                   [ngClass]="item.hasLeaguer==true?'imgDivActive':'' ">
                <img src="assets/images/selectCustomer.png" alt="">
              </div>
              <p class="fz-12 font-bold mg-b-0 mg-t-10 textActive" [ngClass]="item.hasLeaguer==true?'textActive':'' ">
                选择会员</p>
              <div class="progressbar pos-a "></div>
            </div>

            <div class="step-item text-center flex pos-r ">
              <div class="imgDiv pos-r disFlex align-center hor-center" style="z-index: 2;"
                   [ngClass]="item.hasFollowUserId==true?'imgDivActive':'' ">
                <img src="assets/images/selectFollowUp.png" alt="">
              </div>
              <p class="fz-12 font-bold mg-b-0 mg-t-10" [ngClass]="item.hasFollowUserId==true?'textActive':'' ">
                选择跟进人员</p>
              <div class="progressbar pos-a"></div>
            </div>

            <div class="step-item text-center flex pos-r " *ngIf="item.wfTypeFlag ==1">
              <div class="imgDiv pos-r disFlex align-center hor-center" style="z-index: 2;"
                   [ngClass]="item.hasCost==true?'imgDivActive':'' ">
                <img src="assets/images/addToSettlement.png" alt="">
              </div>
              <p class="fz-12 font-bold mg-b-0 mg-t-10" [ngClass]="item.hasCost==true?'textActive':'' ">金额充值</p>
              <div class="progressbar pos-a"></div>
            </div>

            <div class="step-item text-center flex pos-r " *ngIf="item.wfTypeFlag ==0">
              <div class="imgDiv pos-r disFlex align-center hor-center" style="z-index: 2;"
                   [ngClass]="item.hasUnsettledRecode==true?'imgDivActive':'' ">
                <img src="assets/images/addToSettlement.png" alt="">
              </div>
              <p class="fz-12 font-bold mg-b-0 mg-t-10" [ngClass]="item.hasUnsettledRecode==true?'textActive':'' ">
                添加待结算</p>
              <div class="progressbar pos-a"></div>
            </div>
            <!--<div class="step-item text-center flex pos-r ">-->
              <!--<div class="imgDiv pos-r disFlex align-center hor-center" style="z-index: 2;"-->
                   <!--[ngClass]="item.hasBonusInfo==true?'imgDivActive':'' ">-->
                <!--<img src="assets/images/drawPercentage.png" alt="">-->
              <!--</div>-->
              <!--<p class="fz-12 font-bold mg-b-0 mg-t-10" [ngClass]="item.hasBonusInfo==true?'textActive':'' ">设置提成</p>-->
              <!--<div class="progressbar pos-a"></div>-->
            <!--</div>-->

            <div class="step-item text-center flex pos-r " *ngIf="item.wfTypeFlag ==1">
              <div class="imgDiv pos-r disFlex align-center hor-center" style="z-index: 2;"
                   [ngClass]="item.hasSetMemCard==true?'imgDivActive':'' ">
                <img src="assets/images/addToSettlement.png" alt="">
              </div>
              <p class="fz-12 font-bold mg-b-0 mg-t-10" [ngClass]="item.hasSetMemCard==true?'textActive':'' ">设置会员卡</p>
              <div class="progressbar pos-a"></div>
            </div>

            <div class="step-item text-center flex pos-r ">
              <div class="imgDiv pos-r disFlex align-center hor-center" style="z-index: 2;">
                <img src="assets/images/pay.png" alt="">
              </div>
              <p class="fz-12 font-bold mg-b-0 mg-t-10">结算</p>
            </div>
          </div>

          <img src="assets/images/icon-delete.png" alt="" class="cur-hand" (click)="removeWorkFlow($event,item.id)">
        </div>

        <div *ngIf="viewData.loadingFinish && viewData.workFlowViewDataList.length == 0"
             class="text-center disFlex hor-center align-center" style="border-top: none;height: 100%;" >
          <div style="">
            <img src="assets/images/client.png" height="220" width="220"/>
            <h4 class="font-bold fz-18">暂无开单会员</h4>
          </div>
        </div>
        <!--<no-data [loadingFinish]="viewData.loadingFinish" [dataList]="viewData.workFlowViewDataList" [text]=" '暂无开单会员' " [showImg]="'client'"></no-data>-->
      </div>
    </div>
 `,
  styleUrls:['./UnfinishedWFComp.scss']
})
export class UnfinishedWFComp implements OnInit,OnChanges,OnDestroy {

  private service: UnfinishedWFCompService;
  public viewData: UnfinishedWFCompViewData;

  @Input() storeId:string;


  constructor(private workFlowMgr: WorkFlowMgr,
              private workFlowTypeMgr: WorkFlowTypeMgr,
              private storeLeaguerInfoSynDataHolder: StoreLeaguerInfoSynDataHolder,
              private cdRef: ChangeDetectorRef) {
    this.service = new UnfinishedWFCompService(this.workFlowMgr,this.workFlowTypeMgr,this.storeLeaguerInfoSynDataHolder);
  }

  private isInited:boolean = false;
  ngOnInit(): void {
    UnfinishedWFViewDataMgr.getInstance().onDataChanged(new UnfinishedWFCompViewData(),(viewDataTmp: UnfinishedWFCompViewData)=>{
      this.viewData = viewDataTmp;
      this.cdRef.markForCheck();
    });
    UnfinishedWFViewDataMgr.getInstance().onInformDataChanged(( )=>{
      this.service.initViewData();
    });
    this.service.initViewData();
    this.isInited = true;
  }

  ngOnChanges(): void {
    if(this.isInited){
      this.service.initViewData();
    }
  }

  ngOnDestroy():void{
    UnfinishedWFViewDataMgr.getInstance().onViewDestroy();
  }

  /**
   * 进入工作流
   */
  public async  joinWorkFlow(workFlowId, workFlowTypeId) {
    let workFlowTypeMap = this.viewData.workFlowTypeMap;
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
  removeWorkFlow(ev, workFlowId) {
    this.cancelBubble(ev);

    Popup.getInstance().open("提示", "确定删除工作流？", () => {
      this.workFlowMgr.deleteWorkFlow(workFlowId).then(
        (success) => {
          this.service.initViewData();
          this.handleResult(success);
        }
      );
    });
  }

  /***
   * 防止点击事件冒泡 （删除事件）
   */
  public cancelBubble(e) {
    var evt = e ? e : window.event;
    if (evt.stopPropagation) {
      evt.stopPropagation();
    } else {       //IE
      evt.cancelBubble = true;
    }
  }

  private  handleResult(successP: boolean) {
    if (successP == true) {
      AppUtils.showSuccess(PromptMsg.PROMPT,PromptMsg.DELETE_SUCCESS );
    } else {
      AppUtils.showError(PromptMsg.PROMPT, PromptMsg.DELETE_ERROR);
    }

  }


}



