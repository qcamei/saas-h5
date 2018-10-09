import {Component, OnInit, OnChanges, Input} from '@angular/core';
import {AppointDataWraper, ProductData, LeaguerCompData} from "../../addAppointWraper/AddAppointDataWraper";

import {AppointDataWraperMgr} from "../../addAppointWraper/AddAppointDataWraperMgr";
import {AppUtils, ZmMap} from "../../../../comModule/AppUtils";
import {MemberCardStateEnum} from "../../../../bsModule/storeLeaguerInfo/data/MemberCardStateEnum";
import {Leaguer} from "../../../../bsModule/storeLeaguerInfo/data/Leaguer";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {MembershipCard} from "../../../../bsModule/storeCardInfo/data/MembershipCard";
import {LeaguerMemberCard} from "../../../../bsModule/storeLeaguerInfo/data/LeaguerMemberCard";
import {StoreLeaguerInfoSynDataHolder} from "../../../../bsModule/storeLeaguerInfo/StoreLeaguerInfoSynDataHolder";
import {StoreCardInfoSynDataHolder} from "../../../../bsModule/storeCardInfo/StoreCardInfoSynDataHolder";
import {LeaguerPopup, LeaguerPopupViewData} from "./leaguerPopupComp/leaguerPopup";
import {LeaguerDetail} from "../../../../bsModule/leaguerDetail/data/LeaguerDetail";
import {Popup} from "../../../common/popup/popup";
import {MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../../zmComp/modal/ZmModalMgr";
import {LeaguerLabel} from "../../../../bsModule/storeLeaguerInfo/data/LeaguerLabel";


/**
 * 选择会员组件
 */
@Component({
  selector: 'leaguer-comp',
  template: `
    <!-- 选择会员 start -->
    <zm-card-box [withCollapse]="true"  [expanded]="contentExpanded">
       <header fxLayout="row wrap" fxLayoutAlign="start center" >
         <label style="width:140px;color:#2a2a2a;font-size:18px;" class="text-bold">选择会员</label>
          <div class="nameDiv fz-14 cur-hand" (click)="selectCustomer($event)">
            {{leaguerCompData.selectLeaguer.name}}
           <span *ngIf=" !leaguerCompData.selectLeaguer.name" style="color: #A4ABB3">请选择会员</span>
            <i class="fa fa-plus" style="position:absolute;right:10px;top:8px;color:#03a9f4;"></i>
          </div>
         <button *ngIf="leaguerCompData.memberCard.origin == 1" class="px-4 ml-12" style="height:30px;width:60px;background:#03a9f4;border-radius:5px;color:#fff;font-size:14px;">集团卡</button>
       </header>
       <content>
      
        <div fxLayout="row wrap" class="fz-14" *ngIf="leaguerCompData.selectLeaguer.id">
           
               <label style="width:140px;"></label>
                <div fxLayout="column" fxLayoutAlign="start">
                  <div fxLayout="row" fxLayoutGap="20px" fxLayoutAlign="start center">
                    <span>{{leaguerCompData.selectLeaguer.phone && leaguerCompData.selectLeaguer.phone.length > 0?leaguerCompData.selectLeaguer.phone:'-'}}</span>
                    <div style="color:#999;" *ngIf="hasMbCard">
                    <span class="mr-8">({{leaguerCompData.memberCard.name}}</span>
                    ￥{{leaguerCompData.leaguerMemberCard.balance == 0.0?"-":leaguerCompData.leaguerMemberCard.balance |number:'1.2-2'}} )
                    </div>
                  </div>
                  <div *ngIf="viewData.leaguerLabelList && viewData.leaguerLabelList.length>0" class="library" fxLayout="row wrap" fxLayoutAlign="start center">
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
      line-height: 31px;
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
  `]
})


export class LeaguerComp implements OnInit,OnChanges {

  private service: LeaguerCompService;
  public viewData: LeaguerCompViewData = new LeaguerCompViewData();

  public contentExpanded = false;
  public hasLeaguer: boolean = false;
  public hasMbCard: boolean = false;//无会员卡

  @Input() appointWraper: AppointDataWraper;
  public leaguerCompData: LeaguerCompData = new LeaguerCompData();

  constructor(private storeLeaguerInfoSynDataHolder: StoreLeaguerInfoSynDataHolder,
              private storeCardInfoSynDataHolder: StoreCardInfoSynDataHolder,
              public matDialog: MatDialog,
              private appointDataWraperMgr: AppointDataWraperMgr,) {
    ZmModalMgr.getInstance().reset(matDialog);
    this.service = new LeaguerCompService(this.storeLeaguerInfoSynDataHolder, this.storeCardInfoSynDataHolder);
  }

  ngOnInit(): void {
    this.viewData = new LeaguerCompViewData();
    this.service.initViewData((viewDataTmp: LeaguerCompViewData) => {
      if (viewDataTmp) {
        this.viewData = viewDataTmp;
      } else {
        AppUtils.showError("提示", "加载数据失败");
      }
    });
  }

  ngOnChanges() {
    if (this.appointWraper) {
      this.leaguerCompData = this.appointWraper.getLeaguerCompData();
      let leaguer = this.appointWraper.getLeaguerCompData().selectLeaguer;
      if (!AppUtils.isNullObj(leaguer)) {
        this.leaguerCompData.selectLeaguer = leaguer;
        if (!AppUtils.isNullOrWhiteSpace(leaguer.name)) {
          this.hasLeaguer = true;
          this.contentExpanded = true;
          this.viewData.leaguerLabelList = this.getList(leaguer);
        }
        if (!AppUtils.isNullObj(leaguer.leaguerMemberCard)) {
          this.leaguerCompData.leaguerMemberCard = leaguer.leaguerMemberCard;
          let cardId = leaguer.leaguerMemberCard.cardId;
          if (!AppUtils.isNullOrWhiteSpace(cardId)) {
            this.hasMbCard = true;
            if (this.viewData.loadingFinish) {
              let memberCard = this.viewData.memberCardMap.get(cardId);
              if (memberCard) {
                this.leaguerCompData.memberCard = memberCard;
              } else {
                this.leaguerCompData.memberCard = new MembershipCard();
              }
            }
          } else {
            this.hasMbCard = false;
          }
        }
      } else {
        this.hasLeaguer = false;
        // this.leaguerCompData.selectLeaguer = new LeaguerDetail();
        // this.leaguerCompData.memberCard = new MembershipCard();
        // this.leaguerCompData.leaguerMemberCard = new LeaguerMemberCard();
        // this.appointDataWraperMgr.refreshWraper(this.appointWraper);
      }
    }
  }

  getList(leaguer: LeaguerDetail) {
    let leaguerLabelList: Array<LeaguerLabel> = new Array<LeaguerLabel>();
    if (leaguer.labelIds && leaguer.labelIds.length > 0) {
      leaguer.labelIds.forEach((labelId) => {
        let item = this.viewData.leaguerLabelMap.get(labelId);
        if (item) {
          leaguerLabelList.push(item);
        }
        ;
      });
    }
    return leaguerLabelList;
  }


  /**选择会员模态框*/
  selectCustomer(event): void {
    event.stopPropagation();
    this.contentExpanded = true;

    let modalData: LeaguerPopupViewData = LeaguerPopupViewData.fromParentComp(this.viewData);
    let callBack = this.selectLeaguer.bind(this);
    ZmModalMgr.getInstance().newModal(LeaguerPopup, modalData, callBack);

  }


  /**选择会员回调*/
  selectLeaguer(leaguer: LeaguerDetail) {
    this.hasLeaguer = true;
    this.viewData.leaguerLabelList = this.getList(leaguer);
    //会员卡
    if (leaguer && leaguer.leaguerMemberCard && leaguer.leaguerMemberCard.cardId) {
      let memberCard = this.viewData.memberCardMap.get(leaguer.leaguerMemberCard.cardId);
      this.appointWraper.getLeaguerCompData().memberCard = memberCard;
      this.appointWraper.getLeaguerCompData().leaguerMemberCard = leaguer.leaguerMemberCard;
      this.viewData.selectMemberCard = memberCard;
    } else {
      this.appointWraper.getLeaguerCompData().memberCard = new MembershipCard();
      this.appointWraper.getLeaguerCompData().leaguerMemberCard = new LeaguerMemberCard();
      this.viewData.selectMemberCard = new MembershipCard();
    }
    this.appointWraper.getLeaguerCompData().selectLeaguer = leaguer;

    let isCardPrd = this.hasCardProduct();
    if (isCardPrd) {
      Popup.getInstance().open("提示", "切换会员将清除划卡项目，请确认", () => {
        this.appointWraper.getProductCompData().productList = new Array<ProductData>();
        AppUtils.showSuccess("提示", "选择会员成功");
        this.appointDataWraperMgr.refreshWraper(this.appointWraper);
      });
    } else {
      this.appointWraper.getProductCompData().productList = new Array<ProductData>();
      AppUtils.showSuccess("提示", "选择会员成功");
      this.appointDataWraperMgr.refreshWraper(this.appointWraper);
    }

  }

  //是否已选次卡项目
  hasCardProduct() {
    let isCardPrd = false;
    let list = this.appointWraper.getProductCompData().productList;
    if (list.length > 0) {
      list.filter((item) => {
        if (item.payType == 1) {
          isCardPrd = true;
        }
      });
    }
    return isCardPrd;
  }

}

export class LeaguerCompService {

  constructor(private storeLeaguerInfoSynDataHolder: StoreLeaguerInfoSynDataHolder,
              private storeCardInfoSynDataHolder: StoreCardInfoSynDataHolder,) {
  }

  /**
   * 初始化页面数据
   * @param callback
   */
  public async initViewData(callback: (viewDataP: LeaguerCompViewData) => void) {
    let viewDataTmp = new LeaguerCompViewData();

    //请求storeLeaguerInfo 会员详情
    let storeId = SessionUtil.getInstance().getStoreId();
    let storeLeaguerInfo = await this.storeLeaguerInfoSynDataHolder.getData(storeId);
    viewDataTmp.leaguerMap = storeLeaguerInfo.getValidLeaguerMap();
    viewDataTmp.leaguerLabelMap = storeLeaguerInfo.getValidLeaguerLabelMap();
    viewDataTmp.leaguerList = viewDataTmp.leaguerMap.values();

    //请求storeCardInfo 会员卡信息
    let storeCardInfo = await this.storeCardInfoSynDataHolder.getData(storeId);
    if (storeCardInfo) {
      viewDataTmp.memberCardMap = storeCardInfo.getMemberCardMap();
    }
    viewDataTmp.loadingFinish = true;
    callback(viewDataTmp);
  }

}

export class LeaguerCompViewData {
  public leaguerMap: ZmMap<Leaguer>;
  public memberCardMap: ZmMap<MembershipCard>;
  public leaguerLabelMap: ZmMap<LeaguerLabel>;

  public leaguerLabelList: Array<LeaguerLabel> = new Array<LeaguerLabel>();
  public leaguerList: Array<Leaguer> = new Array();
  public selectLeaguer: LeaguerDetail = new LeaguerDetail();
  public selectMemberCard: MembershipCard = new MembershipCard();

  public loadingFinish: boolean = false;

}


