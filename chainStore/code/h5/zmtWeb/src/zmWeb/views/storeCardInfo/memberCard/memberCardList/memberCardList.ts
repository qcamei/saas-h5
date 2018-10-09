import {Component, ChangeDetectionStrategy, OnInit, OnDestroy, ChangeDetectorRef} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {AppUtils} from "../../../../comModule/AppUtils";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {StoreCardInfoMgr} from "../../../../bsModule/storeCardInfo/StoreCardInfoMgr";
import {StoreCardInfoViewDataMgr} from "../../StoreCardInfoViewDataMgr";
import {UpdMemberCardStateData} from "../../../../bsModule/storeCardInfo/apiData/UpdMemberCardStateData";
import {BatchUpdMemberCardStateData} from "../../../../bsModule/storeCardInfo/apiData/BatchUpdMemberCardStateData";
import {AppRouter} from "../../../../comModule/AppRouter";
import {Constants} from "../../../common/Util/Constants";
import {DelMembershipCard} from "../../../../bsModule/storeCardInfo/apiData/DelMembershipCard";
import {PromptMsg} from "../../../common/Util/PromptMsg";
import {MembershipCardDetailQueryForm} from "../../../../bsModule/MembershipCardDetail/apiData/MembershipCardDetailQueryForm";
import {PageResp} from "../../../../comModule/PageResp";
import {MembershipCardDetailMgr} from "../../../../bsModule/MembershipCardDetail/MemCardDetailMgr";
import {MembershipCardDetail} from "../../../../bsModule/MembershipCardDetail/data/MembershipCardDetail";
import {Popup} from "../../../common/popup/popup";
import {CardStatusEnum} from "../../../../bsModule/storeCardInfo/data/CardStatusEnum";
import {MgrPool} from "../../../../comModule/MgrPool";

@Component({
  template: `
    <view-body-comp [headerArr]="['会员卡列表']">
        <div style="margin-bottom:15px;" fxLayout="row" fxLayoutAlign="end"><zm-btn-md *ngIf="getPullDataPerm()" name="获取总部数据" (zmbtnClick)="goPullMemberCard()"></zm-btn-md></div>
       <mat-toolbar style="padding-top:15px;margin-bottom:15px;">
            <mat-toolbar-row fxLayout="row" fxLayoutAlign="space-between center" fxLayoutGap="20px" class="zmFullWidth">
              <div fxLayout="row "  fxLayoutGap="20px" >
  
                <div style="width:150px">
                    <zm-select [label]="'状态'" [selectList]="[{name:'启用',value:1},{name:'停用',value:2}]" [(zmValue)]="viewData.status" (selectCallback)="getMemCardDetailListByReq()"></zm-select>
                </div>
                <div  fxFlexAlign="center"  >
                  <zm-search-box [label]=" '会员卡查询'" [placeholder]="'会员卡编号/名称'" [(zmValue)]="viewData.queryForm.cardNameOrNumber" (callBack)="getMemCardDetailListByReq()"></zm-search-box>
                </div>
              </div>
              <div fxLayout="row "  fxLayoutGap="20px" >
                <div fxFlexAlign="center" ><zm-btn-small [name]="'启用'" (zmbtnClick)="batchChangeState(1)"></zm-btn-small></div>
                <div fxFlexAlign="center" ><zm-btn-small [name]="'停用'" (zmbtnClick)="batchChangeState(2)"></zm-btn-small></div>
                <div fxFlexAlign="center" ><zm-btn-new [name]="'新建'" (zmbtnClick)="goAddMemberCard()"></zm-btn-new></div>
              </div>
            </mat-toolbar-row>
       </mat-toolbar>
         <ng-template #tdA let-item="item">
          <div class="zmImgDiv" style="position: relative">
            <img *ngIf="item.origin==1" style="width:40%;height:50%;position:absolute;left:4px;top:5px;" src="assets/images/icon/ic_headquarters.png">
            <img  *ngIf="item.imgPath" src="{{item.imgPath|imgPrePath}}" style="width: 100%; height:100%;"/>
            <img *ngIf="!item.imgPath" src="{{item.defaultImg|imgPrePath}}" style="width: 100%; height:100%;"/>
          </div>
        </ng-template>
        <ng-template #tdB let-item="item">{{item.number}}</ng-template>
        <ng-template #tdC let-item="item"><span matTooltip="{{item.name.length>15?item.name:null}}">{{item.name.length>15?item.name.slice(0,15)+'...':item.name}}</span></ng-template>
        <ng-template #tdD let-item="item"><i class="fa fa-yen mr-1"></i>{{item.freeMoney|number:'1.2-2'}}</ng-template>
        <ng-template #tdE let-item="item">{{item.status | memCardStatePipe}}</ng-template>
        <ng-template #tdF let-item="item">
          <a class="zmCurHand" style="margin-right: 5px;"  *ngIf=" item.status == 1" (click)="changeState(item.id,2)">{{item.status | memCardStatePipe2}}</a>
          <a class="zmCurHand" style="margin-right: 5px;"  *ngIf=" item.status == 2" (click)="changeState(item.id,1)">{{item.status | memCardStatePipe2}}</a>
          <a class="zmCurHand" style="margin-right: 5px;"  (click)="goDetailPage(item.id)">查看</a>
          <a class="zmCurHand" style="margin-right: 5px;"   *ngIf="item.origin==0 && item.status == 2" (click)="goUpdatePage(item.id)">编辑</a>
          <a class="zmCurHand" style="margin-right: 5px;"   *ngIf="item.status == 2" (click)="deleteMemCard(item)">删除</a>
        </ng-template>

                
        <zm-mat-table-checkbox [tdTemplateList]="[tdA,tdB,tdC,tdD,tdE,tdF]" [thNameList]="['图片','会员卡编号','会员卡名称','开卡赠送金额','状态','操作']" [itemList]="viewData.memberCardList"></zm-mat-table-checkbox>
            
         <no-data [loadingFinish]="viewData.loadingFinish" [dataList]="viewData.memberCardList" [text]=" '没有数据'" [showImg]="'noData'"></no-data>
             
        <zm-page [totalSize]="viewData.recordCount" [curPage]="viewData.curPage" (pageChange) = "getPageData($event)"></zm-page>
   </view-body-comp>


`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MemberCardListPage implements OnInit {

  public viewData: MemberCardListViewData;
  private service: MemberCardListService;
  private mbCardIdArray = new Array<string>();//batchChangeState
  public isSelectedAll:boolean = false;

  constructor(
              private storeCardInfoMgr: StoreCardInfoMgr,
              private storeCardInfoViewDataMgr: StoreCardInfoViewDataMgr,
              private membershipCardDetailMgr:MembershipCardDetailMgr,
              private cdRef: ChangeDetectorRef,
              public route: ActivatedRoute) {
    this.service = new MemberCardListService(this.storeCardInfoMgr, this.storeCardInfoViewDataMgr,this.membershipCardDetailMgr);
  }

  ngOnInit() {

    this.storeCardInfoViewDataMgr.subscribeMemberCardListVD((viewDataP: MemberCardListViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });

    this.storeCardInfoViewDataMgr.setMemberCardListViewData(MemberCardListViewData.getInstance());
    this.service.initViewData();

  }


  /**
   * 是否显示获取总部数据
   * @returns {boolean}
   */
  public getPullDataPerm(): boolean {
    return SessionUtil.getInstance().getUserPermData().showSynData;
  }

  public goUpdatePage(cardId:string){
    AppRouter.goEditMemberCard(cardId);
  }

  public goDetailPage(cardId){
    AppRouter.goMemberCardDetail(cardId);
  }


  /**
   * 跳转获取总部数据
   */
  public goPullMemberCard() {
    AppRouter.goPullMemberCard();
  }

  /**全/反选***/

  public selectAll() {
    let listTmp: Array<MembershipCardDetail> = new Array<MembershipCardDetail>();
    let list = this.viewData.memberCardList;
    for (let item of list) {
      let membershipCardDetail = new MembershipCardDetail();
      AppUtils.copy(membershipCardDetail, item);
      membershipCardDetail.checked = this.isSelectedAll;
      listTmp.push(membershipCardDetail);
    }
    this.viewData.memberCardList = listTmp;
  }

  public checkList() {
    let checkList = new Array<boolean>();
    let list = this.viewData.memberCardList;
    for (let item of  list) {
      checkList.push(item.checked);
    }
    if (AppUtils.arrayContains(checkList, false)) {
      this.isSelectedAll = false;
    } else {
      this.isSelectedAll = true;
    }
  }

  /**删除会员卡*/
  deleteMemCard(mbCard:MembershipCardDetail) {
    Popup.getInstance().open("删除会员卡", "确定删除#" + mbCard.name + "#?", () => {
      let deleteForm: DelMembershipCard = new DelMembershipCard();
      deleteForm.id = mbCard.id;
      this.service.deleteMemCard(deleteForm).then((success) => {
        if (success) {
          AppUtils.showSuccess(PromptMsg.PROMPT, PromptMsg.DELETE + "成功");
          this.handleSuccessResult();
        } else {
          AppUtils.showError(PromptMsg.PROMPT, PromptMsg.DELETE + "失败");
        }
      });
    });
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
        (success) => {
          if (success) {
            AppUtils.showSuccess(title, content + "成功");
            this.handleSuccessResult();
          } else {
            AppUtils.showError(title, content + "失败");
          }
        }
      );
    });
  }

  private handleSuccessResult(){
    this.service.initViewData();
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
            this.handleSuccessResult();
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
    if(!AppUtils.isNullObj(this.viewData.queryForm.cardNameOrNumber)){
      this.viewData.queryForm.cardNameOrNumber = AppUtils.trimBlank(this.viewData.queryForm.cardNameOrNumber);
    }
    this.service.initViewData();
  }


  /**分页过滤数据*/
  getPageData(curPage) {
    this.viewData.curPage = curPage;
    this.service.initViewData();
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
  queryForm:MembershipCardDetailQueryForm = new MembershipCardDetailQueryForm();
  status:number = -1;
}


class MemberCardListService {

  constructor(
              private storeCardInfoMgr: StoreCardInfoMgr,
              private storeCardInfoViewDataMgr: StoreCardInfoViewDataMgr,
              private membershipCardDetailMgr:MembershipCardDetailMgr) {
  }

  public initViewData(): void {

    this.buildViewData().then((viewDataTmp: MemberCardListViewData) => {
      this.handleViewData(viewDataTmp);
    }).catch(error => {
      AppUtils.handleError(error);
    });

  }

  public handleViewData(viewDataP: MemberCardListViewData) {
    this.storeCardInfoViewDataMgr.setMemberCardListViewData(viewDataP);
  }


  /**
   * 组装viewData
   * @param storeId:string
   * @param status:number
   * @returns Promise<MemberCardListViewData>
   */
  public async buildViewData(): Promise<MemberCardListViewData> {

    let viewDataTmp = MemberCardListViewData.getInstance();
    viewDataTmp.loadingFinish = false;

    let queryForm: MembershipCardDetailQueryForm = this.buildQueryForm(viewDataTmp);
    let pageResp: PageResp = await this.membershipCardDetailMgr.getMembershipCardDetailPageInfo(queryForm);
    if(pageResp && pageResp.list){
      viewDataTmp.memberCardList = pageResp.list;
      viewDataTmp.memberCardList.sort(function (item1, item2) {
        let a = item1.number;
        let b = item2.number;
        return a.localeCompare(b);
      });
      viewDataTmp.recordCount = pageResp.totalCount;
    }

    viewDataTmp.loadingFinish = true;
    return new Promise<MemberCardListViewData>(resolve => {
      resolve(viewDataTmp);
    });

  }

  private buildQueryForm(viewDataTmp:MemberCardListViewData) {
    let storeId = SessionUtil.getInstance().getStoreId();
    let queryForm: MembershipCardDetailQueryForm = new MembershipCardDetailQueryForm();
    queryForm.storeId = storeId;
    queryForm.cardNameOrNumber = viewDataTmp.queryForm.cardNameOrNumber;
    queryForm.statusSet.push(viewDataTmp.status);
    AppUtils.uniquelize(viewDataTmp.queryForm.statusSet);
    queryForm.pageItemCount = 10;
    queryForm.pageNo = viewDataTmp.curPage;
    return queryForm;
  }




  /**
   * 修改会员卡状态
   * @param storeId:string
   * @param mbCardId:number
   * @param state:number
   * @returns Promise<boolean>
   */

  public updateMbCardState(mbCardId: string, state: number): Promise<boolean> {
    let storeId = SessionUtil.getInstance().getStoreId();
    let updateMemberCardStateData = new UpdMemberCardStateData();
    updateMemberCardStateData.id = mbCardId;
    updateMemberCardStateData.state = state;
    return new Promise(resolve => {
      this.storeCardInfoMgr.updateMemCardCardState(storeId, updateMemberCardStateData).then(
        (success) => {
          resolve(success);
        }
      );
    });
  };

  /**
   * 批量修改会员卡状态
   * @param storeId:string
   * @param mbCardIdSet:Array<string>
   * @param state:number
   * @returns Promise<boolean>
   */
  public batchUpdateMbCardState(mbCardIdSet: Array<string>, state: number): Promise<boolean> {
    let storeId = SessionUtil.getInstance().getStoreId();
    let batchUpdMemberCardStateData = new BatchUpdMemberCardStateData();
    batchUpdMemberCardStateData.mbCardIdSet = mbCardIdSet;
    batchUpdMemberCardStateData.state = state;
    return new Promise(resolve => {
      this.storeCardInfoMgr.batchUpdateMemCardCardState(storeId,batchUpdMemberCardStateData).then(
        (success) => {
          resolve(success);
        }
      );
    });

  };

  public deleteMemCard(deleteForm: DelMembershipCard): Promise<boolean> {
    let storeId = SessionUtil.getInstance().getStoreId();
    return new Promise(resolve => {
      this.storeCardInfoMgr.deleteMemCard(storeId, deleteForm).then(
        (success) => {
          resolve(success);
        }
      );
    });

  };


}
