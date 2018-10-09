import {Component, ChangeDetectionStrategy, OnInit, OnDestroy, ChangeDetectorRef} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {AppUtils} from "../../../../comModule/AppUtils";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {ChainCardMgr} from "../../../../bsModule/chainCard/chainCardMgr";
import {ChainCardViewDataMgr} from "../../ChainCardViewDataMgr";
import {UpdMemberCardStateData} from "../../../../bsModule/chainCard/apiData/UpdMemberCardStateData";
import {BatchUpdMemberCardStateData} from "../../../../bsModule/chainCard/apiData/BatchUpdMemberCardStateData";
import {AppRouter} from "../../../../comModule/AppRouter";
import {Constants} from "../../../common/Util/Constants";
import {DelMembershipCard} from "../../../../bsModule/chainCard/apiData/DelMembershipCard";
import {PromptMsg} from "../../../common/Util/PromptMsg";
import {Popup} from "../../../common/popup/popup";
import {CardStatusEnum} from "../../../../bsModule/chainCard/data/CardStatusEnum";
import {MembershipCardDetailMgr} from "../../../../bsModule/chainCard/MemCardDetailMgr";
import {MembershipCardDetail} from "../../../../bsModule/chainCard/data/MembershipCardDetail";
import {MembershipCardDetailQueryForm} from "../../../../bsModule/chainCard/apiData/MembershipCardDetailQueryForm";
import {MemberCardBatchAllotForm} from "../../../../bsModule/chainCard/apiData/MemberCardBatchAllotForm";
import {MemberCardAllotForm} from "../../../../bsModule/chainCard/apiData/MemberCardAllotForm";
import {StoreMgr} from "../../../../bsModule/store/storeMgr";
import {StoreListComp} from "../../../productionLibrary/Comp/storeListComp/StoreListComp";
import {StoreVD} from "../../../chainPackageProject/packageProject/addPackage/addPackage";
import {ZmModalMgr} from "../../../zmComp/modal/ZmModalMgr";
import {MatDialog} from "@angular/material";
import {PageResp} from "../../../../comModule/PageResp";
import {MgrPool} from "../../../../comModule/MgrPool";

@Component({
  template: `
  
       <view-body-comp [headerArr]="['会员卡列表']">
    
       <mat-toolbar style="padding-top:15px;margin-bottom:15px;">
            <mat-toolbar-row fxLayout="row" fxLayoutAlign="space-between center" fxLayoutGap="20px" class="zmFullWidth">
              <div fxLayout="row "  fxLayoutGap="20px" >
  
                <div style="width:150px">
                    <zm-select-number [label]="'状态'" [selectList]="[{name:'启用',value:0},{name:'停用',value:1}]" [(zmValue)]="viewData.status" (selectCallback)="getMemCardDetailListByReq()"></zm-select-number>
                </div>
                <div  fxFlexAlign="center"  >
                  <zm_search_box [label]=" '会员卡查询'" [placeholder]="'会员卡编号/名称'" [(zmValue)]="viewData.queryForm.cardNameOrNumber" (callBack)="getMemCardDetailListByReq()"></zm_search_box>
                </div>
              </div>
              
              <div fxLayout="row "  fxLayoutGap="20px" >
                <div fxFlexAlign="center" ><zm_btn_small [name]="'启用'" (zmbtnClick)="batchChangeState(0)"></zm_btn_small></div>
                <div fxFlexAlign="center" ><zm_btn_small [name]="'停用'" (zmbtnClick)="batchChangeState(1)"></zm_btn_small></div>
                <div fxFlexAlign="center" ><zm_btn_new [name]="'新建'" (zmbtnClick)="goAddMemberCard()"></zm_btn_new></div>
           
              </div>
            </mat-toolbar-row>
       </mat-toolbar>
       
       <ng-template #tdA let-item="item">
          <div class="zmImgDiv">
            <img  *ngIf="item.imgPath" src="{{item.imgPath|imgPrePath}}" />
            <img *ngIf="!item.imgPath" src="{{item.defaultImg|imgPrePath}}" />
          </div>
        </ng-template>
        <ng-template #tdB let-item="item">{{item.number}}</ng-template>
        <ng-template #tdC let-item="item">{{item.name}}</ng-template>
        <ng-template #tdD let-item="item"><i class="fa fa-yen mr-1"></i>{{item.freeMoney|number:'1.2-2'}}</ng-template>
        <ng-template #tdE let-item="item">{{item.applyStoreIds && item.applyStoreIds.length}}</ng-template>
        <ng-template #tdF let-item="item">{{item.status | memCardStatePipe}}</ng-template>
        <ng-template #tdG let-item="item">
          <a class="zmCurHand" style="margin-right: 5px;"  *ngIf=" item.status == 0" (click)="changeState(item.id,1)">{{item.status | memCardStatePipe2}}</a>
          <a class="zmCurHand" style="margin-right: 5px;"  *ngIf=" item.status == 1" (click)="changeState(item.id,0)">{{item.status | memCardStatePipe2}}</a>
          <a class="zmCurHand" style="margin-right: 5px;"  [routerLink]="['/main/chainCard/memberCard/detail/'+item.id]">查看</a>
          <a class="zmCurHand" style="margin-right: 5px;"   *ngIf="item.status == 1" [routerLink]="['/main/chainCard/memberCard/update/'+item.id]">编辑</a>
          <a class="zmCurHand" style="margin-right: 5px;" (click)="allotStores(item)">分配</a>
          <!--<a class="zmCurHand" style="margin-right: 5px;"   *ngIf="item.status == 1" (click)="deleteMemCard(item)">删除</a>-->
        </ng-template>

                
        <zm-mat-table-checkbox [tdTemplateList]="[tdA,tdB,tdC,tdD,tdE,tdF,tdG]" [thNameList]="['图片','会员卡编号','会员卡名称','开卡赠送金额','适用门店','状态','操作']" [itemList]="viewData.memberCardList"></zm-mat-table-checkbox>
            
         <no_data [loadingFinish]="viewData.loadingFinish" [dataList]="viewData.memberCardList" [text]=" '没有数据'" [showImg]="'noData'"></no_data>
             
        <zm_page [totalSize]="viewData.recordCount" [curPage]="viewData.curPage" (pageChange) = "getPageData($event)"></zm_page>
   </view-body-comp>
`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MemberCardListPage implements OnInit,OnDestroy {

  public viewData: MemberCardListViewData;
  private viewDataSub: any;
  private service: MemberCardListService;
  private mbCardIdArray = new Array<string>();//batchChangeState

  constructor(private chainCardMgr: ChainCardMgr,
              private chainCardViewDataMgr: ChainCardViewDataMgr,
              private membershipCardDetailMgr: MembershipCardDetailMgr,
              private storeMgr: StoreMgr,
              private cdRef: ChangeDetectorRef,
              public route: ActivatedRoute,
              private matDialog: MatDialog) {
    ZmModalMgr.getInstance().reset(matDialog);

    this.service = new MemberCardListService(this.chainCardMgr, this.chainCardViewDataMgr, this.membershipCardDetailMgr, this.storeMgr);
  }

  ngOnInit() {

    this.viewDataSub = this.chainCardViewDataMgr.subscribeMemberCardListVD((viewDataP: MemberCardListViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.service.initViewData();

  }

  ngOnDestroy() {
    if (!AppUtils.isNullObj(this.viewDataSub)) {
      this.viewDataSub.unsubscribe();
    }
  }


  /**
   * 改变状态事件
   */
  changeState(mbCardId, state) {
    let title = "提示";
    let content = "";
    state == CardStatusEnum.OPEN ? content = "启用" : content = "停用";

    Popup.getInstance().open(title, "确定" + content + "吗?", () => {
      this.service.updateMbCardState(mbCardId, state).then(
        (success:boolean) => {
          if(success) {
            AppUtils.showSuccess(title, content + "成功");
            this.callbackRefreshData();
          } else {
            AppUtils.showError(title, content + "失败");
          }
        }
      );
    });
  }

  /**
   * 点击事件 跳转新建会员卡页面
   */
  goAddMemberCard() {
    AppRouter.goAddMemberCard();
  }


  buildIdArray() {
    for (let item of this.viewData.memberCardList) {
      if (item.checked == true) {
        this.mbCardIdArray.push(item.id);
      }
    }
  }

  /**
   * 批量改变状态事件
   */
  batchChangeState(state) {
    let title = "提示";
    let content = "";
    state === CardStatusEnum.OPEN ? content = "启用" : content = "停用";

    this.buildIdArray();

    if (this.mbCardIdArray.length != 0) {
      this.service.batchUpdateMbCardState(this.mbCardIdArray, state).then(
        (success) => {
          if (success) {
            this.mbCardIdArray = new Array<string>();
            AppUtils.showSuccess(title, content + "成功!");
            this.callbackRefreshData();
          } else {
            AppUtils.showError(title, content + "失败");
          }
        }
      );
    } else {
      AppUtils.showWarn("提示", "请至少选择一条数据");
    }

  }

  /**
   * 按条件查询
   */
  public getMemCardDetailListByReq() {
    if (!AppUtils.isNullObj(this.viewData.queryForm.cardNameOrNumber)) {
      this.viewData.queryForm.cardNameOrNumber = AppUtils.trimBlank(this.viewData.queryForm.cardNameOrNumber);
    }
    this.callbackRefreshData();

  }


  /**分页过滤数据*/
  getPageData(curPage) {
    this.viewData.curPage = curPage;
    this.callbackRefreshData();

  }

  //分配
  public allotStores(memCardDetail: MembershipCardDetail) {
    this.viewData.storeList.forEach((item) => {
      item.checked = false;
    });
    let ids = memCardDetail.applyStoreIds;
    if (ids) {
      for (let id of ids) {
        this.viewData.storeList.forEach((item) => {if (item.id == id) {item.checked = true;}});
      }
    }

    let modalData = {storeList:this.viewData.storeList};
    let tmp = this;
    let callBack = (storeList:Array<StoreVD>) => {
      tmp.getSelectedStore(memCardDetail,storeList);//回调刷新列表
    };
    ZmModalMgr.getInstance().newModal(StoreListComp,modalData,callBack);
  }

  private getSelectedStore(item: MembershipCardDetail, storeList: Array<StoreVD>) {
    if (storeList && storeList.length > 0) {
      this.viewData.selectStoreList = null;
      this.viewData.selectStoreList = storeList;
      this.viewData.selectStoreIds = storeList.map((item) => {
        return item.id;
      });
    }

    this.service.allotStore(item.id, this.viewData.selectStoreIds).then((success) => {
      if (success) {
        AppUtils.showSuccess("提示", "分配成功");
        this.callbackRefreshData();

      } else {
        AppUtils.showError("提示", "分配失败");
      }
    });
  }

  /**删除会员卡*/
  deleteMemCard(mbCard: MembershipCardDetail) {
    Popup.getInstance().open("删除会员卡", "确定删除#" + mbCard.name + "#?", () => {
      let deleteForm: DelMembershipCard = new DelMembershipCard();
      deleteForm.id = mbCard.id;
      this.service.deleteMemCard(deleteForm).then((success) => {
        if (success) {
          AppUtils.showSuccess(PromptMsg.PROMPT, PromptMsg.DELETE + "成功");
          this.callbackRefreshData();
        } else {
          AppUtils.showError(PromptMsg.PROMPT, PromptMsg.DELETE + "失败");
        }
      });
    });
  }

  private callbackRefreshData(){
    this.service.getPageData();
  }
}


export class MemberCardListViewData {
  public static getInstance():MemberCardListViewData{
    let target = MgrPool.getInstance().get("MemberCardListViewData",MemberCardListViewData);
    if(AppUtils.isNullObj(target)){
      target = new MemberCardListViewData();
    }
    return target;
  }

  public initData(){
    MgrPool.getInstance().setNull("MemberCardListViewData",MemberCardListViewData);
  }

  memberCardList: Array<MembershipCardDetail> = new Array<MembershipCardDetail>();
  recordCount: number;//分页条数
  loadingFinish: boolean = false;

  defaultImg: string = Constants.MEMBERCARD_DEFAULT_IMG;//默认会员卡图片

  curPage: number = 1;
  queryForm: MembershipCardDetailQueryForm = new MembershipCardDetailQueryForm();
  status: number = Constants.DEFAULT_STATE_VALUE;

  //分配门店相关
  public storeList: Array<StoreVD> = new Array<StoreVD>();
  public selectStoreList: Array<StoreVD> = new Array<StoreVD>();
  public selectStoreIds: Array<string> = new Array<string>();
}


class MemberCardListService {

  constructor(private chainCardMgr: ChainCardMgr,
              private chainCardViewDataMgr: ChainCardViewDataMgr,
              private membershipCardDetailMgr: MembershipCardDetailMgr,
              private storeMgr: StoreMgr,) {
  }

  public initViewData(): void {
    this.chainCardViewDataMgr.setMemberCardListViewData(MemberCardListViewData.getInstance());

    this.buildViewData().then((viewDataTmp: MemberCardListViewData) => {
      this.handleViewData(viewDataTmp);
    }).catch(error => {
      AppUtils.handleError(error);
    });

  }

  public handleViewData(viewDataP: MemberCardListViewData) {
    this.chainCardViewDataMgr.setMemberCardListViewData(viewDataP);
  }


  /**
   * 组装viewData
   * @param chainId:string
   * @param status:number
   * @returns Promise<MemberCardListViewData>
   */
  public async buildViewData(): Promise<MemberCardListViewData> {

    let viewDataTmp: MemberCardListViewData = MemberCardListViewData.getInstance();
    let chainId = SessionUtil.getInstance().getChainId();
    let storePageResp = await this.storeMgr.findStoreByCond(chainId);
    if (storePageResp) {
      viewDataTmp.storeList = storePageResp.list.map((store) => {
        return StoreVD.fromStore(store);
      });
    }
    let queryForm: MembershipCardDetailQueryForm = this.buildQueryForm(viewDataTmp);
    let pageResp: PageResp = await this.membershipCardDetailMgr.getMembershipCardDetailPageInfo(queryForm);
    viewDataTmp.memberCardList = pageResp.list;
    viewDataTmp.memberCardList.sort(function (item1, item2) {
      let a = item1.number;
      let b = item2.number;
      return a.localeCompare(b);
    });
    viewDataTmp.recordCount = pageResp.totalCount;
    viewDataTmp.loadingFinish = true;
    return new Promise<MemberCardListViewData>(resolve => {
      resolve(viewDataTmp);
    });

  }

  public async getPageData() {
    let viewDataTmp: MemberCardListViewData = MemberCardListViewData.getInstance();
    viewDataTmp.loadingFinish = false;

    let queryForm: MembershipCardDetailQueryForm = this.buildQueryForm(viewDataTmp);
    let pageResp: PageResp = await this.membershipCardDetailMgr.getMembershipCardDetailPageInfo(queryForm);
    viewDataTmp.memberCardList = pageResp.list;
    viewDataTmp.memberCardList.sort(function (item1, item2) {
      let a = item1.number;
      let b = item2.number;
      return a.localeCompare(b);
    });
    viewDataTmp.recordCount = pageResp.totalCount;
    viewDataTmp.loadingFinish = true;

    this.handleViewData(viewDataTmp);
  }

  private buildQueryForm(viewDataTmp: MemberCardListViewData) {
    let chainId = SessionUtil.getInstance().getChainId();
    let queryForm: MembershipCardDetailQueryForm = new MembershipCardDetailQueryForm();
    queryForm.chainId = chainId;
    queryForm.cardNameOrNumber = viewDataTmp.queryForm.cardNameOrNumber;
    if (viewDataTmp.status != Constants.DEFAULT_STATE_VALUE) {
      queryForm.statusSet.push(viewDataTmp.status);
    }
    queryForm.pageItemCount = 10;
    queryForm.pageNo = viewDataTmp.curPage;
    return queryForm;
  }


  /**
   * 修改会员卡状态
   * @param chainId:string
   * @param mbCardId:number
   * @param state:number
   * @returns Promise<boolean>
   */

  public updateMbCardState(mbCardId: string, state: number): Promise<boolean> {
    let chainId = SessionUtil.getInstance().getChainId();
    let updateMemberCardStateData = new UpdMemberCardStateData();
    updateMemberCardStateData.id = mbCardId;
    updateMemberCardStateData.state = state;
    return this.chainCardMgr.updateMemCardCardState(chainId, updateMemberCardStateData);
  }

  /**
   * 批量修改会员卡状态
   * @param chainId:string
   * @param mbCardIdSet:Array<string>
   * @param state:number
   * @returns Promise<boolean>
   */
  public batchUpdateMbCardState(mbCardIdSet: Array<string>, state: number): Promise<boolean> {
    let chainId = SessionUtil.getInstance().getChainId();
    let batchUpdMemberCardStateData = new BatchUpdMemberCardStateData();
    batchUpdMemberCardStateData.mbCardIdSet = mbCardIdSet;
    batchUpdMemberCardStateData.state = state;
    return new Promise(resolve => {
      this.chainCardMgr.batchUpdateMemCardCardState(chainId, batchUpdMemberCardStateData).then(
        (success) => {
          resolve(success);
        }
      );
    });

  };

  public allotStore(goodsId: string, applyStoreIds: Array<string>): Promise<boolean> {
    let chainId = SessionUtil.getInstance().getChainId();
    let allotForm = new MemberCardAllotForm();
    allotForm.id = goodsId;
    allotForm.applyStoreIds = applyStoreIds;
    return new Promise(resolve => {
      this.chainCardMgr.allotStore(chainId, allotForm).then(
        (success) => {
          resolve(success);
        }
      );
    });
  };

  public batchAllotStore(ids: Array<string>, applyStoreIds: Array<string>): Promise<boolean> {
    let chainId = SessionUtil.getInstance().getChainId();
    let batchAllotForm = new MemberCardBatchAllotForm();
    batchAllotForm.ids = ids;
    batchAllotForm.applyStoreIds = applyStoreIds;
    return new Promise(resolve => {
      this.chainCardMgr.batchAllotStore(chainId, batchAllotForm).then(
        (success) => {
          resolve(success);
        }
      );
    });
  };

  public deleteMemCard(deleteForm: DelMembershipCard): Promise<boolean> {
    let chainId = SessionUtil.getInstance().getChainId();
    return new Promise(resolve => {
      this.chainCardMgr.deleteMemCard(chainId, deleteForm).then(
        (success) => {
          resolve(success);
        }
      );
    });

  };


}
