import {Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, OnDestroy} from "@angular/core";
import {AppUtils} from "../../../../comModule/AppUtils";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {ChainCardMgr} from "../../../../bsModule/chainCard/chainCardMgr";
import {AddMembershipCard} from "../../../../bsModule/chainCard/apiData/AddMembershipCard";
import {ChainCardViewDataMgr} from "../../ChainCardViewDataMgr";
import {ChooseCardModal} from "../../Comp/ChooseImgComp/ChooseCardModal.Component";
import {ChainCardSynDataHolder} from "../../../../bsModule/chainCard/chainCardSynDataHolder";
import {Constants} from "../../../common/Util/Constants";
import {PromptMsg} from "../../../common/Util/PromptMsg";
import {CardStatusEnum} from "../../../../bsModule/chainCard/data/CardStatusEnum";
import {StoreMgr} from "../../../../bsModule/store/storeMgr";
import {StoreListComp} from "../../../productionLibrary/Comp/storeListComp/StoreListComp";
import {StoreVD} from "../../../chainPackageProject/packageProject/addPackage/addPackage";
import {ZmModalMgr} from "../../../zmComp/modal/ZmModalMgr";
import {MatDialog} from "@angular/material";


@Component({
  selector: 'page-chainCard-addMemberCard',
  templateUrl: 'addMemberCard.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AddMemberCardPage implements OnInit,OnDestroy {

  private service: AddMemberCardService;
  public viewData: AddMemberCardViewData;
  private viewDataSub: any;
  public imgUrl: string = Constants.MEMBERCARD_DEFAULT_IMG;//默认会员卡图片

  constructor(
              private chainCardMgr: ChainCardMgr,
              private chainCardSynDataHolder: ChainCardSynDataHolder,
              private chainCardViewDataMgr: ChainCardViewDataMgr,
              private storeMgr:StoreMgr,
              private cdRef: ChangeDetectorRef,
              private matDialog: MatDialog) {
    ZmModalMgr.getInstance().reset(matDialog);

    this.service = new AddMemberCardService(this.chainCardMgr,this.chainCardSynDataHolder, this.chainCardViewDataMgr,this.storeMgr);
  }

  ngOnInit() {
    this.viewDataSub = this.chainCardViewDataMgr.subscribeAddMemberCardVD((viewDataP: AddMemberCardViewData) => {
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

    let imageArr = new Array<string>();
    for (let i = 1; i < 7; i++) {
      let imageStr = `img/logo/card/pic_membership_card${i}.png`;
      imageArr.push(imageStr);
    }

    let modalData = {imageList:imageArr};
    let tmp = this;
    let callBack = (imgUrl) => {
      if (imgUrl != null) {
        tmp.imgUrl = imgUrl;
      }
      tmp.cdRef.markForCheck();
    };
    ZmModalMgr.getInstance().newLgModal(ChooseCardModal,modalData,callBack);
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

  /**
   * 新建会员卡点击事件
   */
  public addFormData = new AddMembershipCard();
  public async addMemberCard() {
    let successForm = this.checkForm();
    if (successForm) {
      this.buildAddformData();
      let success = await this.service.addMemberCard(this.addFormData);
      this.handleResult(success);
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
    this.addFormData.index = this.viewData.index;
    this.addFormData.number = AppUtils.trimBlank(this.viewData.defaultNumber);
    this.addFormData.imgPath = this.imgUrl;
    this.addFormData.applyStoreIds = this.viewData.selectStoreIds;
  }



  /**
   * 处理结果
   */
  private handleResult(successP: boolean): void {
    if (successP) {
      history.go(-1);
      AppUtils.showSuccess(PromptMsg.PROMPT, PromptMsg.NEW_SUCCESS);
    } else {
      AppUtils.showError(PromptMsg.PROMPT, PromptMsg.NEW_ERROR);
    }
  }

  /**
   * 分配
   */
  public selectStore() {
    let modalData = {storeList:this.viewData.storeList};
    let tmp = this;
    let callBack = (storeList:Array<StoreVD>) => {
      tmp.getSelectedStore(storeList);//回调刷新列表
    };
    ZmModalMgr.getInstance().newModal(StoreListComp,modalData,callBack);
  }

  private getSelectedStore(storeList:Array<StoreVD>){
    this.viewData.selectStoreList = storeList;
    this.viewData.selectStoreIds = storeList.map((item)=>{
      return item.id;
    });
    this.service.handleViewData(this.viewData);
  }

  //移除店铺回调
  public removeStore(){
    this.viewData.selectStoreIds = this.viewData.selectStoreList.map((item)=>{
      return item.id;
    });
  }

}

export class AddMemberCardViewData {
  public index: number;//下标
  public state:boolean = true;

  public mbCardNumberList: Array<string> = new Array<string>();//编号列表
  public isExitNumber: boolean = false;//编号是否已经存在
  public defaultNumber:string;
  public defaultNumberPass:boolean;

  public storeList:Array<StoreVD> = new Array<StoreVD>();
  public selectStoreList:Array<StoreVD> = new Array<StoreVD>();
  public selectStoreIds:Array<string> = new Array<string>();
}

class AddMemberCardService {

  constructor(
      private chainCardMgr: ChainCardMgr,
      private chainCardSynDataHolder: ChainCardSynDataHolder,
      private chainCardViewDataMgr: ChainCardViewDataMgr,
      private storeMgr:StoreMgr,) {
  }

  public initViewData(): void {
    this.chainCardViewDataMgr.setAddMemberCardViewData(new AddMemberCardViewData());

    this.buildViewData().then(
      (viewDataP) => {
        this.handleViewData(viewDataP);
      }).catch(error => {
      AppUtils.handleError(error);
    });
  }

  public handleViewData(viewDataP: AddMemberCardViewData) {
    this.chainCardViewDataMgr.setAddMemberCardViewData(viewDataP);
  }


  /**
   * 组装viewData
   * @param chainId
   * @returns Promise<AddMemberCardViewData>
   */
  public async buildViewData(): Promise<AddMemberCardViewData> {

    let chainId = SessionUtil.getInstance().getChainId();
    let viewDataTmp = new AddMemberCardViewData();
    let pageResp = await this.storeMgr.findStoreByCond(chainId);
    if(pageResp){
      viewDataTmp.storeList = pageResp.list.map((store)=>{
        return StoreVD.fromStore(store);
      });
    }

    let chainCard = await this.chainCardSynDataHolder.getData(chainId);
    let memCardList = chainCard.getMemberCardMap().values();
    if (chainCard && memCardList) {
      viewDataTmp.mbCardNumberList = this.bulidMbCardNumberList(memCardList);
    }

    let mbCardIndex: number = await this.getMemberCardIndex(chainId);
    let tmpIndex = parseInt(mbCardIndex.toString()) + 1;
    viewDataTmp.index = tmpIndex;
    let tmpNo:number = 98000001+parseInt(mbCardIndex.toString());
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
   *@param chainId:string
   *@param formData:AddMembershipCard
   *@returns Promise<boolean>
   */
  public addMemberCard(formData: AddMembershipCard): Promise<boolean> {
    let chainId = SessionUtil.getInstance().getChainId();
    return new Promise<boolean>(resolve => {
      this.chainCardMgr.addMemCard(chainId, formData).then(
        (success) => {
          resolve(success);
        }
      )
    });
  }

  /**
   * 获取memberCardIndex,计算mdCardId
   * @param   chainId:string
   * @returns Promise<number>
   */
  public getMemberCardIndex(chainId: string): Promise<number> {
    return new Promise<number>(resolve => {
      this.chainCardSynDataHolder.getData(chainId).then(
        (chainCard) => {
          resolve(chainCard.membershipCardIndex);
        }
      );
    });
  }

}
