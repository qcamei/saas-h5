import {Component, ChangeDetectionStrategy, OnInit, OnDestroy, ChangeDetectorRef} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {AppUtils} from "../../../../comModule/AppUtils";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {StoreCardInfoMgr} from "../../../../bsModule/storeCardInfo/StoreCardInfoMgr";
import {StoreCardInfoViewDataMgr} from "../../StoreCardInfoViewDataMgr";
import {StoreCardInfoUpdateApiForm} from "../../../../bsModule/storeCardInfo/apiData/StoreCardInfoUpdateApiForm";
import {StoreCardInfoUpdateType} from "../../../../bsModule/storeCardInfo/apiData/StoreCardInfoUpdateType";
import {StoreCardInfo} from "../../../../bsModule/storeCardInfo/data/StoreCardInfo";
import {UpdMembershipCard} from "../../../../bsModule/storeCardInfo/apiData/UpdMembershipCard";
import {ChooseCardModal} from "../../Comp/ChooseImgComp/ChooseCardModal.Component";

import {AppRouter} from "../../../../comModule/AppRouter";
import {StoreCardInfoSynDataHolder} from "../../../../bsModule/storeCardInfo/StoreCardInfoSynDataHolder";
import {PromptMsg} from "../../../common/Util/PromptMsg";
import {MembershipCardDetailCacheDataHolder} from "../../../../bsModule/MembershipCardDetail/MemCardDetailCacheDataHolder";
import {MembershipCardDetail} from "../../../../bsModule/MembershipCardDetail/data/MembershipCardDetail";
import {CardStatusEnum} from "../../../../bsModule/storeCardInfo/data/CardStatusEnum";
import {MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../../zmComp/modal/ZmModalMgr";

@Component({
  selector: 'page-storeCard-updateMemberCard',
  templateUrl: 'updateMemberCard.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class UpdateMemberCardPage implements OnInit,OnDestroy {
  private viewDataSub: any;
  private paramsSub: any;
  private service: UpdateMemberCardService;
  public viewData: UpdateMemberCardViewData;


  constructor(private storeCardInfoSynDataHolder: StoreCardInfoSynDataHolder,
              private storeCardInfoMgr: StoreCardInfoMgr,
              private storeCardInfoViewDataMgr: StoreCardInfoViewDataMgr,
              private membershipCardDetailCacheDataHolder:MembershipCardDetailCacheDataHolder,
              private cdRef: ChangeDetectorRef,
              public route: ActivatedRoute,
              matDialog: MatDialog) {

    ZmModalMgr.getInstance().reset(matDialog);

    this.service = new UpdateMemberCardService(this.storeCardInfoSynDataHolder, this.storeCardInfoMgr, this.storeCardInfoViewDataMgr,this.membershipCardDetailCacheDataHolder);
  }

  ngOnInit() {
    this.viewDataSub = this.storeCardInfoViewDataMgr.subscribeUpdateMemberCardVD((viewDataP: UpdateMemberCardViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.paramsSub = this.route.params.subscribe(params => {
      let mbCardId = params['mbCardId'];
      this.service.initViewData(mbCardId);
    });

  }

  ngOnDestroy() {
    if (!AppUtils.isNullObj(this.viewDataSub)) {
      this.viewDataSub.unsubscribe();
    }
    if (!AppUtils.isNullObj(this.viewDataSub)) {
      this.paramsSub.unsubscribe();
    }

  }

  /**
   * 选择图片
   */
  showMemCardModal() {
    // const activeModal = this.modalService.open(ChooseCardModal, {size: 'lg',backdrop:'static'});
    const activeModal = ZmModalMgr.getInstance().newLgModal(ChooseCardModal, null,null);
    for (let i = 1; i < 7; i++) {
      let imageStr = `img/logo/card/pic_membership_card${i}.png`;
      activeModal.componentInstance.imageList.push(imageStr);
    }
    activeModal.componentInstance.callBackSub.subscribe(imgUrl => {
      if (imgUrl != null) {
        this.viewData.imgUrl = imgUrl;
      }
      this.cdRef.markForCheck();
    });
  }

  /**number唯一性*/
  checkNumber() {
    if (!AppUtils.isNullOrWhiteSpace(this.viewData.defaultNumber)){
      let number = this.viewData.memberCardDetail.number;
      let numberList: Array<string> = this.viewData.numberList;

      if(this.viewData.defaultNumber != number){
        if(AppUtils.arrayContains(numberList,this.viewData.defaultNumber)) {
          this.viewData.isExitNumber = true;
        } else {
          this.viewData.isExitNumber = false;
        }
      }

      if(this.viewData.defaultNumber.match("^\\s*[\\w-]+\\s*$")){
        this.viewData.notRightNumber = false;
      }else{
        this.viewData.notRightNumber = true;
      }
    }
  }

  public checkDiscount(e){
    e.target.value = this.validateValue(e.target.value);
  }

  private validateValue(value) {
    if(!AppUtils.isNumber(value.toString())) {
      value = "";
    }else{
      value = AppUtils.aDecimal(value);
      if(value<0 || value>10){
        value = "";
      }
    }
    return value;
  }

  /**
   * 编辑会员卡  点击事件
   * @param prdId:number
   */
  public async updateMemberCard(mdCardId: string) {
    let checkSuccess = this.checkForm();
    if(checkSuccess){
      let formData: UpdMembershipCard = this.getUpdateMemberCardForm(mdCardId);
      let success = await this.service.updateMemberCard(formData);
      this.handleResult(success);
    }

  }

  private getUpdateMemberCardForm(mdCardId:string){
    let formData: UpdMembershipCard = new UpdMembershipCard();
    this.viewData.state === true ? this.viewData.memberCardDetail.status = CardStatusEnum.OPEN : this.viewData.memberCardDetail.status = CardStatusEnum.CLOSE;
    this.viewData.memberCardDetail.imgPath = this.viewData.imgUrl;
    this.viewData.memberCardDetail.number = this.viewData.defaultNumber;
    AppUtils.copy(formData, this.viewData.memberCardDetail);
    formData.id = mdCardId;
    return formData;
  }

  private checkForm():boolean{
    this.checkNumber();
    let checkSuccess = true;
    if (AppUtils.isNullOrWhiteSpace(this.viewData.defaultNumber)
      || AppUtils.isNullObj(this.viewData.memberCardDetail.freeMoney)
      || AppUtils.isNullOrWhiteSpace(this.viewData.memberCardDetail.name)
      || AppUtils.isNullObj(this.viewData.memberCardDetail.goodsDiscount)
      || AppUtils.isNullObj(this.viewData.memberCardDetail.prodDiscount)
      || AppUtils.isNullObj(this.viewData.memberCardDetail.prdCardDiscount)
      || AppUtils.isNullObj(this.viewData.memberCardDetail.packagePrjDiscount)
      || this.viewData.isExitNumber == true){
      AppUtils.showWarn("提示", "必填项未按要求填写");
      checkSuccess = false;
    }
    return checkSuccess;
  }

  /**
   * 处理结果
   */
  private handleResult(successP: boolean): void {
    if (successP) {
      AppUtils.showSuccess(PromptMsg.PROMPT, PromptMsg.EDIT_SUCCESS);
      AppRouter.goMemberCardList();
    } else {
      AppUtils.showError(PromptMsg.PROMPT, PromptMsg.EDIT_ERROR);
    }
  }

}


export class UpdateMemberCardViewData {
  public memberCardDetail: MembershipCardDetail = new MembershipCardDetail();
  public state: boolean;//上下架状态
  public imgUrl: string;//选择图片路径

  public numberList: Array<string> = new Array<string>();//编号列表
  public isExitNumber:boolean = false;
  public notRightNumber:boolean = false;
  public defaultNumber:string;
  public defaultNumberPass:boolean;
}


class UpdateMemberCardService {

  constructor(private storeCardInfoSynDataHolder: StoreCardInfoSynDataHolder,
              private storeCardInfoMgr: StoreCardInfoMgr,
              private storeCardInfoViewDataMgr: StoreCardInfoViewDataMgr,
              private membershipCardDetailCacheDataHolder:MembershipCardDetailCacheDataHolder) {
  }

  public initViewData(mbCardId: string): void {
    this.storeCardInfoViewDataMgr.setUpdateMemberCardViewData(new UpdateMemberCardViewData());

    this.buildViewData(mbCardId).then((viewDataTmp: UpdateMemberCardViewData) => {
      this.handleViewData(viewDataTmp);
    }).catch(error => {
      AppUtils.handleError(error);
    });

  }

  public handleViewData(viewDataP: UpdateMemberCardViewData) {
    this.storeCardInfoViewDataMgr.setUpdateMemberCardViewData(viewDataP);
  }


  /**
   * 组装viewData
   * @param storeId:string
   * @param mbCardId:string
   * @returns Promise<UpdateMemberCardViewData>
   */
  public async buildViewData(mbCardId: string): Promise<UpdateMemberCardViewData> {

    let storeId = SessionUtil.getInstance().getStoreId();
    let viewDataTmp: UpdateMemberCardViewData = new UpdateMemberCardViewData();

    let storeCardInfo: StoreCardInfo = await this.storeCardInfoSynDataHolder.getData(storeId);
    let memCardList = storeCardInfo.getMemberCardList();
    if (storeCardInfo && memCardList) {
      viewDataTmp.numberList = this.bulidMbCardNumberList(memCardList);
    }

    let targetMbCard: MembershipCardDetail = await this.membershipCardDetailCacheDataHolder.getData(mbCardId);
    if (targetMbCard) {
      viewDataTmp.memberCardDetail = targetMbCard;
      targetMbCard.status == 1 ? viewDataTmp.state = true : viewDataTmp.state = false;
      viewDataTmp.imgUrl = targetMbCard.imgPath;
      viewDataTmp.defaultNumber = targetMbCard.number;
    }
    return new Promise<UpdateMemberCardViewData>(resolve => {
      resolve(viewDataTmp);
    });
  }

  /**
   * 会员卡编号列表
   * 新建时保证编号唯一性
   */
  private bulidMbCardNumberList(memCardList):Array<string>{
    let mbCardNumberList = new Array<string>();
    for (let mbCard of memCardList) {
      mbCardNumberList.push(mbCard.number);
    }
    return mbCardNumberList;
  }

  public updateMemberCard(formData: UpdMembershipCard): Promise<boolean> {
    let storeId = SessionUtil.getInstance().getStoreId();
    let updateForm = new StoreCardInfoUpdateApiForm();
    updateForm.updateType = StoreCardInfoUpdateType.UpdMembershipCard;
    updateForm.updMembershipCard = formData;//formData
    return new Promise<boolean>(resolve => {
      this.storeCardInfoMgr.updateStoreCardInfo(storeId, updateForm).then(
        function (success) {
          resolve(success);
        }
      );
    });
  }


}
