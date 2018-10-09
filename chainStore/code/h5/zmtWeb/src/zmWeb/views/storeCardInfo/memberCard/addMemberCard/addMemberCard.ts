import {Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, OnDestroy} from "@angular/core";
import {AppUtils} from "../../../../comModule/AppUtils";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {StoreCardInfoMgr} from "../../../../bsModule/storeCardInfo/StoreCardInfoMgr";
import {AddMembershipCard} from "../../../../bsModule/storeCardInfo/apiData/AddMembershipCard";
import {StoreCardInfoViewDataMgr} from "../../StoreCardInfoViewDataMgr";

import {ChooseCardModal} from "../../Comp/ChooseImgComp/ChooseCardModal.Component";
import {StoreCardInfoSynDataHolder} from "../../../../bsModule/storeCardInfo/StoreCardInfoSynDataHolder";
import {Constants} from "../../../common/Util/Constants";
import {PromptMsg} from "../../../common/Util/PromptMsg";
import {CardStatusEnum} from "../../../../bsModule/storeCardInfo/data/CardStatusEnum";
import {MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../../zmComp/modal/ZmModalMgr";
import {RestResp} from "../../../../comModule/RestResp";


@Component({
  selector: 'page-storeCardInfo-addMemberCard',
  templateUrl: 'addMemberCard.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AddMemberCardPage implements OnInit,OnDestroy {

  private service: AddMemberCardService;
  public viewData: AddMemberCardViewData;
  private viewDataSub: any;
  public imgUrl: string = Constants.MEMBERCARD_DEFAULT_IMG;//默认会员卡图片

  constructor(
              private storeCardInfoMgr: StoreCardInfoMgr,
              private storeCardInfoSynDataHolder: StoreCardInfoSynDataHolder,
              private storeCardInfoViewDataMgr: StoreCardInfoViewDataMgr,
              private cdRef: ChangeDetectorRef,
              matDialog: MatDialog) {

    ZmModalMgr.getInstance().reset(matDialog);

    this.service = new AddMemberCardService(this.storeCardInfoMgr,this.storeCardInfoSynDataHolder, this.storeCardInfoViewDataMgr);
  }

  ngOnInit() {
    this.viewDataSub = this.storeCardInfoViewDataMgr.subscribeAddMemberCardVD((viewDataP: AddMemberCardViewData) => {
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
   * 选择图片
   */
  showMemCardModal() {
    // const activeModal = this.modalService.open(ChooseCardModal, {size: 'lg',backdrop:'static'});
    const activeModal = ZmModalMgr.getInstance().newModal(ChooseCardModal, null,null);
    for (let i = 1; i < 7; i++) {
      let imageStr = `img/logo/card/pic_membership_card${i}.png`;
      activeModal.componentInstance.imageList.push(imageStr);
    }
    activeModal.componentInstance.callBackSub.subscribe(imgUrl => {
      if (imgUrl != null) {
        this.imgUrl = imgUrl;
      }
      this.cdRef.markForCheck();
    });
  }

  /**number唯一性*/
  public checkNumber() {
    let number = AppUtils.trimBlank(this.viewData.defaultNumber);
    let numberList: Array<string> = this.viewData.mbCardNumberList;
    if (AppUtils.arrayContains(numberList, number)) {
      this.viewData.isExitNumber = true;
    } else {
      this.viewData.isExitNumber = false;
    }
  }

  public checkDiscount(e){
    e.target.value = this.validateValue(e.target.value);
  }

  private validateValue(value) {
    if(!AppUtils.isNumber(value.toString())) {
      value = "";
    }else{
      value = AppUtils.roundPoint(value,1);
    }
    return value;
  }

  /**
   * 新建会员卡点击事件
   */
  public addFormData = new AddMembershipCard();

  public async addMemberCard() {
    let successForm = this.checkForm();

    if (successForm) {
      this.buildAddformData();
      let restResp:RestResp = await this.service.addMemberCard(this.addFormData);
      this.handleResult(restResp);
    }

  }

  private checkForm() {
    this.checkNumber();
    let checkSuccess = true;
    if (AppUtils.isNullOrWhiteSpace(this.viewData.defaultNumber)
      || AppUtils.isNullOrWhiteSpace(this.addFormData.name)
      || AppUtils.isNullObj(this.addFormData.freeMoney)
      || AppUtils.isNullObj(this.addFormData.prodDiscount)
      || AppUtils.isNullObj(this.addFormData.goodsDiscount)
      || AppUtils.isNullObj(this.addFormData.prdCardDiscount)
      || AppUtils.isNullObj(this.addFormData.packagePrjDiscount)
      || this.viewData.isExitNumber == true) {
      AppUtils.showWarn("提示", "必填项未按要求填写");
      checkSuccess = false;
    }

    return checkSuccess;
  }

  /**组装addForm*/
  private buildAddformData() {
    (this.viewData.state === true) ? this.addFormData.status = CardStatusEnum.OPEN : this.addFormData.status = CardStatusEnum.CLOSE;
    this.addFormData.id = this.viewData.mbCardId;
    this.addFormData.index = this.viewData.index;
    this.addFormData.number = AppUtils.trimBlank(this.viewData.defaultNumber);
    this.addFormData.imgPath = this.imgUrl;
  }



  /**
   * 处理结果
   */
  private handleResult(restResp:RestResp): void {
    if (!AppUtils.isNullObj(restResp)){
      if(restResp.code == 200){
        AppUtils.showSuccess(PromptMsg.PROMPT, PromptMsg.NEW_SUCCESS);
        history.go(-1);
      }else if(restResp.code == 500){
        AppUtils.showError(PromptMsg.PROMPT,PromptMsg.NEW_ERROR);
      }else{
        AppUtils.showError(PromptMsg.PROMPT,restResp.tips);
      }
    }else{
      AppUtils.showError(PromptMsg.PROMPT,PromptMsg.NEW_ERROR);
    }
  }
}

export class AddMemberCardViewData {
  public mbCardId: string;//会员卡ID
  public index: number;//下标
  public state:boolean = true;

  public mbCardNumberList: Array<string> = new Array<string>();//编号列表
  public isExitNumber: boolean = false;//编号是否已经存在
  public defaultNumber:string;
  public defaultNumberPass:boolean;

}

class AddMemberCardService {

  constructor(
      private storeCardInfoMgr: StoreCardInfoMgr,
      private storeCardInfoSynDataHolder: StoreCardInfoSynDataHolder,
      private storeCardInfoViewDataMgr: StoreCardInfoViewDataMgr) {
  }

  public initViewData(): void {
    this.storeCardInfoViewDataMgr.setAddMemberCardViewData(new AddMemberCardViewData());

    this.buildViewData().then(
      (viewDataP) => {
        this.handleViewData(viewDataP);
      }).catch(error => {
      AppUtils.handleError(error);
    });
  }

  public handleViewData(viewDataP: AddMemberCardViewData) {
    this.storeCardInfoViewDataMgr.setAddMemberCardViewData(viewDataP);
  }


  /**
   * 组装viewData
   * @param storeId
   * @returns Promise<AddMemberCardViewData>
   */
  public async buildViewData(): Promise<AddMemberCardViewData> {

    let storeId = SessionUtil.getInstance().getStoreId();
    let viewDataTmp = new AddMemberCardViewData();

    let storeCardInfo = await this.storeCardInfoSynDataHolder.getData(storeId);
    let memCardList = storeCardInfo.getMemberCardList();
    if (storeCardInfo && memCardList) {
      viewDataTmp.mbCardNumberList = this.bulidMbCardNumberList(memCardList);
    }

    let mbCardIndex: number = await this.getMemberCardIndex(storeId);
    let tmpIndex = parseInt(mbCardIndex + "") + 1;
    let mbCardId = "_mem_" + storeId + "_" + tmpIndex;
    viewDataTmp.mbCardId = mbCardId;
    viewDataTmp.index = tmpIndex;
    let tmpNo:number = 98000001+parseInt(mbCardIndex+"");
    viewDataTmp.defaultNumber = tmpNo+"";
    return new Promise<AddMemberCardViewData>(resolve => {
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

  /**
   *新建会员卡方法
   *@param storeId:string
   *@param formData:AddMembershipCard
   *@returns Promise<boolean>
   */
  public addMemberCard(formData: AddMembershipCard): Promise<RestResp> {
    let storeId = SessionUtil.getInstance().getStoreId();
    return new Promise<RestResp>(resolve => {
      this.storeCardInfoMgr.addMemCardCard(storeId, formData).then(
        (restResp) => {
          resolve(restResp);
        }
      )
    });
  }

  /**
   * 获取memberCardIndex,计算mdCardId
   * @param   storeId:string
   * @returns Promise<number>
   */
  public getMemberCardIndex(storeId: string): Promise<number> {
    return new Promise<number>(resolve => {
      this.storeCardInfoSynDataHolder.getData(storeId).then(
        (storeCardInfo) => {
          resolve(storeCardInfo.membershipCardIndex);
        }
      );
    });
  }

}
