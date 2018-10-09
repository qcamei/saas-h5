import {Component, OnInit, OnChanges, Input} from '@angular/core';
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {Leaguer} from "../../../bsModule/storeLeaguerInfo/data/Leaguer";
import {MembershipCard} from "../../../bsModule/storeCardInfo/data/MembershipCard";
import {LeaguerMemberCard} from "../../../bsModule/storeLeaguerInfo/data/LeaguerMemberCard";
import {WFDataWraper, CuserWFCompData} from "../wfComp/WFDataWraper";
import {WFDataWraperMgr} from "../wfComp/WFDataWraperMgr";
import {CuserWFPopup, CuserWFPopupViewData} from "./CuserWFPopup/CuserWFPopup";
import {StoreLeaguerInfoSynDataHolder} from "../../../bsModule/storeLeaguerInfo/StoreLeaguerInfoSynDataHolder";
import {LeaguerDetail} from "../../../bsModule/leaguerDetail/data/LeaguerDetail";
import {LeaguerDetailSynDataHolder} from "../../../bsModule/leaguerDetail/LeaguerDetailSynDataHolder";
import {StoreCardInfoSynDataHolder} from "../../../bsModule/storeCardInfo/StoreCardInfoSynDataHolder";
import {Popup} from "../../common/popup/popup";
import {Constants} from "../../common/Util/Constants";
import {MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../zmComp/modal/ZmModalMgr";
import {LeaguerLabel} from "../../../bsModule/storeLeaguerInfo/data/LeaguerLabel";
import {MgrPool} from "../../../comModule/MgrPool";

/**
 * 选择会员公共组件
 */
@Component({
  selector: 'select-leaguer-comp',
  template: `
    <!-- 选择会员 start -->
    <zm-card-box [withCollapse]="true"  [expanded]="contentExpanded">
         <header fxLayout="row wrap" fxLayoutAlign="start center" >
          <label style="width:140px;color:#2a2a2a;font-size:18px;" class="text-bold">选择会员</label>
          <div class="nameDiv fz-14 zmCurHand" (click)="selectCustomer($event)" >
            <span *ngIf="cuserWFCompData.selectLeaguer.name">
              {{cuserWFCompData.selectLeaguer.name}}
            </span>
            <span *ngIf="!cuserWFCompData.selectLeaguer.name" style="color: #A4ABB3">请选择会员</span>
            <i class="fa fa-plus" style="color:#03a9f4;position:absolute;right:0px;top: 10px;"></i>
          </div>
          <button *ngIf="cuserWFCompData.memberCard.origin == 1" class="px-4 ml-12" style="height:30px;width:60px;background:#03a9f4;border-radius:5px;color:#fff;font-size:14px;">集团卡</button>
         </header>
         <content>

            <div fxLayout="row wrap" class="fz-14" *ngIf="cuserWFCompData.selectLeaguer.id&&wFDataWraper.isLeaguer">
           
               <label style="width:140px;"></label>
                <div fxLayout="column" fxLayoutAlign="start">
                  <div fxLayout="row" fxLayoutGap="20px" fxLayoutAlign="start center">
                    <span>{{cuserWFCompData.selectLeaguer.phone && cuserWFCompData.selectLeaguer.phone.length > 0?cuserWFCompData.selectLeaguer.phone:'-'}}</span>
                    <div style="color:#999;" *ngIf="hasMbCard">
                    <span class="mr-8">({{cuserWFCompData.memberCard.name}}</span>
                    ￥{{cuserWFCompData.leaguerMemberCard.balance == 0.0?"-":cuserWFCompData.leaguerMemberCard.balance |number:'1.2-2'}} )
                    </div>
                  </div>
                  <div *ngIf="viewData && viewData.leaguerLabelList && viewData.leaguerLabelList.length>0" class="library" fxLayout="row wrap" fxLayoutAlign="start center">
                    <span *ngFor="let item of viewData.leaguerLabelList">{{item.name}}</span>
                  </div>
                </div>
              </div>
         </content>
    </zm-card-box>
    <!-- 选择会员 end -->
  `,
  styles: [`
    .nameDiv {
      display: inline-block;
      width: 200px;
      border: 2px solid#03a9f4;
      border-radius: 6px;
      // padding: 8px 10px;
      padding-left:15px;
      height:35px;
      line-height: 32px;
      position: relative;
    }

    .library{
      max-width:600px;
    }
    .library span{
      border:1px solid #03a9f4;
      border-radius:5px;
      font-size:12px;
      padding:0 5px;
      margin:8px 8px 0 0;
      cursor:pointer;
    }
  `],
})
export class CuserWFComp implements OnInit,OnChanges {

  private service: CuserWFCompService;
  public viewData: CuserWFCompViewData = new CuserWFCompViewData();
  public contentExpanded = false;

  @Input() wFDataWraper: WFDataWraper;
  @Input() fromPage:number;//AddLeaguerFromPageFlag

  public cuserWFCompData: CuserWFCompData;
  public hasMbCard: boolean = false;//无会员卡

  constructor(private wfDataWraperMgr: WFDataWraperMgr,
              private storeLeaguerInfoSynDataHolder: StoreLeaguerInfoSynDataHolder,
              private leaguerDetailSynDataHolder: LeaguerDetailSynDataHolder,
              private storeCardInfoSynDataHolder: StoreCardInfoSynDataHolder,
              private matDialog: MatDialog,) {
    ZmModalMgr.getInstance().reset(matDialog);
    this.service = new CuserWFCompService(this.storeLeaguerInfoSynDataHolder,
      this.storeCardInfoSynDataHolder,
      this.leaguerDetailSynDataHolder,);
  }

  ngOnInit(): void {
    this.viewData = CuserWFCompViewData.getInstance();
    this.service.initViewData((viewDataP: CuserWFCompViewData) => {
      if (viewDataP) {
        this.viewData = viewDataP;
        if ((!this.wFDataWraper.getCuserWFCompData().selectLeaguer.name) && (this.wFDataWraper.getWFTypeName() == Constants.CONSUMEWFNAME) && !this.wFDataWraper.getWorkFlowData()) {
          this.wFDataWraper.isLeaguer = false;
          this.setLeaguerData(this.viewData.defaultLeaguer);
          this.wfDataWraperMgr.setWFDataWraper(this.wFDataWraper);
        }
      } else {
        AppUtils.showError("提示", "加载数据失败");
      }
    });
  }


  ngOnChanges(changes) {
    //处理流程数据回填
    if (this.wFDataWraper && this.viewData) {
      this.cuserWFCompData = this.wFDataWraper.getCuserWFCompData();
      let leaguer = this.wFDataWraper.getCuserWFCompData().selectLeaguer;
      if (!AppUtils.isNullObj(leaguer)) {
        this.cuserWFCompData.selectLeaguer = leaguer;
        if (!AppUtils.isNullOrWhiteSpace(leaguer.name) && this.wFDataWraper.isLeaguer) {
          this.viewData.hasLeaguer = true;
          this.contentExpanded = true;
          this.viewData.leaguerLabelList = this.getList(leaguer);
        }
        if (!AppUtils.isNullObj(leaguer.leaguerMemberCard)) {
          this.cuserWFCompData.leaguerMemberCard = leaguer.leaguerMemberCard;
          let cardId = leaguer.leaguerMemberCard.cardId;
          if (!AppUtils.isNullOrWhiteSpace(cardId)) {
            this.hasMbCard = true;
            if (this.viewData.memberCardMap) {
              let memberCard = this.viewData.memberCardMap.get(cardId);
              if (memberCard) {
                this.cuserWFCompData.memberCard = memberCard;
              } else {
                this.cuserWFCompData.memberCard = new MembershipCard();
              }
            }
          } else {
            this.hasMbCard = false;
          }
        }
      } else {
        this.viewData.hasLeaguer = false;
        this.cuserWFCompData.selectLeaguer = new LeaguerDetail();
        this.cuserWFCompData.memberCard = new MembershipCard();
        this.cuserWFCompData.leaguerMemberCard = new LeaguerMemberCard();
        this.wfDataWraperMgr.setWFDataWraper(this.wFDataWraper);
      }
    }
  }

  getList(leaguer:LeaguerDetail){
    let leaguerLabelList:Array<LeaguerLabel> = new Array<LeaguerLabel>();
    if(leaguer.labelIds && leaguer.labelIds.length>0 && this.viewData.leaguerLabelMap){
      leaguer.labelIds.forEach((labelId)=>{
        let item = this.viewData.leaguerLabelMap.get(labelId);
        if(item){
          leaguerLabelList.push(item);
        };
      });
    }
    return leaguerLabelList;
  }

  /**选择会员回调*/
  selectLeaguer(leaguer: Leaguer, isLeaguer: boolean) {
    if (this.wFDataWraper.getCuserWFCompData().selectLeaguer && (this.wFDataWraper.getCuserWFCompData().selectLeaguer.id != leaguer.id)) {//是否已选择该会员
      this.contentExpanded = true;
      let isCardPrd = this.hasCardProduct();
      if (isCardPrd) {
        Popup.getInstance().open("提示", "切换会员将清除划卡项目，请确认", () => {
          this.leaguerDetailSynDataHolder.getData(leaguer.id).then((leaguerDetail) => {
            let leaguerDetailTmp = leaguerDetail.encryptLeaguerDetail();
            if (!AppUtils.isNullObj(leaguerDetailTmp)) {
              this.setLeaguerData(leaguerDetailTmp);
              this.wFDataWraper.isLeaguer = isLeaguer;
              this.wfDataWraperMgr.setWFDataWraper(this.wFDataWraper);
            } else {
              AppUtils.showError("提示", "设置会员失败");
            }
          })
        });
      } else {
        this.leaguerDetailSynDataHolder.getData(leaguer.id).then((leaguerDetail) => {
          let leaguerDetailTmp = leaguerDetail.encryptLeaguerDetail();
          if (!AppUtils.isNullObj(leaguerDetailTmp)) {
            this.setLeaguerData(leaguerDetailTmp);
            this.wFDataWraper.isLeaguer = isLeaguer;
            this.wfDataWraperMgr.setWFDataWraper(this.wFDataWraper);
          } else {
            AppUtils.showError("提示", "设置会员失败");
          }
        })
      }
    }
  }

  //是否已选次卡项目
  hasCardProduct() {
    let isCardPrd = false;
    let list = this.wFDataWraper.getDelimitCardRecordsWFCompData().reduceList;
    if (list.length > 0) {
      list.filter((item) => {
        if (item.payType == 1) {
          isCardPrd = true;
        }
      });
    }
    return isCardPrd;
  }

  private setLeaguerData(leaguer: LeaguerDetail) {
    this.viewData.hasLeaguer = true;
    this.viewData.leaguerLabelList = this.getList(leaguer);
    if (leaguer.leaguerMemberCard && leaguer.leaguerMemberCard.cardId) {
      this.wFDataWraper.getCuserWFCompData().leaguerMemberCard = leaguer.leaguerMemberCard;
      let memberCard = this.viewData.memberCardMap.get(leaguer.leaguerMemberCard.cardId);
      if (memberCard) {
        this.wFDataWraper.getCuserWFCompData().memberCard = memberCard;
        this.viewData.selectMemberCard = memberCard;
      }
    } else {
      this.wFDataWraper.getCuserWFCompData().memberCard = new MembershipCard();
      this.wFDataWraper.getCuserWFCompData().leaguerMemberCard = new LeaguerMemberCard();
      this.viewData.selectMemberCard = new MembershipCard();
    }
    this.wFDataWraper.getCuserWFCompData().selectLeaguer = leaguer;
    this.wFDataWraper.leaguerId = leaguer.id;
    this.wfDataWraperMgr.changeLeaguer(this.wFDataWraper);
  }

  /**选择会员模态框*/
  selectCustomer(event): void {
    event.stopPropagation();
    if (!AppUtils.isNullObj(this.wFDataWraper.getWorkFlowData())
      && !AppUtils.isNullObj(this.wFDataWraper.getWorkFlowData().appointInfo)
      && (this.wFDataWraper.getWorkFlowData().appointInfo.appointId > 0)) {
      AppUtils.showWarn("提示", "不能更换预约会员");
    } else {
      let modalData = {fromPage:this.fromPage};
      const selectLeaguerModal = ZmModalMgr.getInstance().newModal(CuserWFPopup,modalData, null);
      this.viewData.showIndividual = (this.wFDataWraper.getWFTypeName() == Constants.CONSUMEWFNAME);
      let data: CuserWFPopupViewData = CuserWFPopupViewData.fromParentComp(this.viewData);
      selectLeaguerModal.componentInstance.data = data;
      selectLeaguerModal.componentInstance.callBack = this.selectLeaguer.bind(this);
    }
  }

}

export class CuserWFCompService {

  constructor(private storeLeaguerInfoSynDataHolder: StoreLeaguerInfoSynDataHolder,
              private storeCardInfoSynDataHolder: StoreCardInfoSynDataHolder,
              private leaguerDetailSynDataHolder: LeaguerDetailSynDataHolder,) {
  }

  /**
   * 初始化页面数据
   * @param callback
   */
  public async initViewData(callback: (viewDataP: CuserWFCompViewData) => void) {
    let viewDataTmp = CuserWFCompViewData.getInstance();

    //请求storeLeaguerInfo 会员详情
    let storeId = SessionUtil.getInstance().getStoreId();
    let storeLeaguerInfo = await this.storeLeaguerInfoSynDataHolder.getData(storeId);
    if (!AppUtils.isNullObj(storeLeaguerInfo)) {
      viewDataTmp.leaguerMap = storeLeaguerInfo.getValidLeaguerMap();
      viewDataTmp.leaguerLabelMap = storeLeaguerInfo.getValidLeaguerLabelMap();
      viewDataTmp.leaguerList = viewDataTmp.leaguerMap.values();
      let nanId = AppUtils.format(Constants.LEAGUER_MALE_FORMAT, storeId);
      let nvId = AppUtils.format(Constants.LEAGUER_FEMALE_FORMAT, storeId);
      viewDataTmp.defaultNan = storeLeaguerInfo.getAllLeaguerMap().get(nanId);
      viewDataTmp.defaultNv = storeLeaguerInfo.getAllLeaguerMap().get(nvId);
      viewDataTmp.defaultLeaguer = await this.leaguerDetailSynDataHolder.getData(nvId);
    }

    //请求storeCardInfo 会员卡信息
    let storeCardInfo = await this.storeCardInfoSynDataHolder.getData(storeId);
    if (storeCardInfo) {
      viewDataTmp.memberCardMap = storeCardInfo.getMemberCardMap();
    }

    callback(viewDataTmp);
  }

}

export class CuserWFCompViewData {

  public static getInstance():CuserWFCompViewData{
    let target = MgrPool.getInstance().get("CuserWFCompViewData",CuserWFCompViewData);
    if(AppUtils.isNullObj(target)){
      target = new CuserWFCompViewData();
    }
    return target;
  }
  public leaguerMap: ZmMap<Leaguer>;
  public leaguerLabelMap: ZmMap<LeaguerLabel>;
  public memberCardMap: ZmMap<MembershipCard>;
  public leaguerList: Array<Leaguer> = new Array();
  public defaultNan: Leaguer;
  public defaultNv: Leaguer;
  public defaultLeaguer: LeaguerDetail;//默认会员
  public showIndividual: boolean = true;//显示散客

  //选中的会员
  public selectLeaguer: Leaguer = new Leaguer();
  //选中的会员对应的会员卡类型信息
  public selectMemberCard: MembershipCard = new MembershipCard();
  public hasLeaguer: boolean = false;

  public leaguerLabelList:Array<LeaguerLabel> = new Array<LeaguerLabel>();

}


