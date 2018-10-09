import {Component, OnInit, ChangeDetectorRef, OnDestroy, ChangeDetectionStrategy} from "@angular/core";
import {AppUtils} from "../../../../comModule/AppUtils";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {StoreCardInfoMgr} from "../../../../bsModule/storeCardInfo/StoreCardInfoMgr";
import {StoreCardInfoViewDataMgr} from "../../StoreCardInfoViewDataMgr";
import {AddProductCardForm} from "../../../../bsModule/storeCardInfo/apiData/AddProductCardForm";
import {ChooseCardModal} from "../../Comp/ChooseImgComp/ChooseCardModal.Component";
import {StoreCardInfoSynDataHolder} from "../../../../bsModule/storeCardInfo/StoreCardInfoSynDataHolder";
import {Constants} from "../../../common/Util/Constants";
import {PromptMsg} from "../../../common/Util/PromptMsg";

import {CardStatusEnum} from "../../../../bsModule/storeCardInfo/data/CardStatusEnum";
import {ProductData} from "../../Comp/productCardContentComp/ProductCardContentCompViewData";
import {StoreCardInfo} from "../../../../bsModule/storeCardInfo/data/StoreCardInfo";
import {PriceData} from "../../../storePackageProject/packageProject/addPackage/addPackage";
import {ProductCardItem} from "../../../../bsModule/productCardDetail/data/ProductCardItem";
import {PrdCardType} from "../../../../bsModule/storeCardInfo/data/PrdCardType";
import {AddProductCardTypeModal} from "../productCardType/addProductCardTypeCompl";
import {MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../../zmComp/modal/ZmModalMgr";
import {UseTypeEnum} from "../../../storePackageProject/pipe/UseTypeEnum";
import {RestResp} from "../../../../comModule/RestResp";
import {PromotionFlagEnum} from "../../../../comModule/enum/PromotionFlagEnum";


@Component({
  selector: 'page-storeCardInfo-addProductCard',
  templateUrl: 'addProductCard.html',
  changeDetection: ChangeDetectionStrategy.OnPush

})

export class AddProductCardPage implements OnInit,OnDestroy {

  private service: AddProductCardService;
  public viewData: AddProductCardViewData;
  private viewDataSub: any;
  public productCardContentList: Array<ProductData> = new Array<ProductData>();

  constructor(private storeCardInfoSynDataHolder: StoreCardInfoSynDataHolder,
              private storeCardInfoMgr: StoreCardInfoMgr,
              private storeCardInfoViewDataMgr: StoreCardInfoViewDataMgr,
              private cdRef: ChangeDetectorRef,
              matDialog: MatDialog) {

    ZmModalMgr.getInstance().reset(matDialog);
    this.service = new AddProductCardService(this.storeCardInfoSynDataHolder, this.storeCardInfoMgr, this.storeCardInfoViewDataMgr);
  }

  ngOnInit() {
    this.viewDataSub = this.storeCardInfoViewDataMgr.subscribeAddProductCardVD((viewDataP: AddProductCardViewData) => {
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
   * 新建次卡分类
   */
  public addType() {
    const activeModal = ZmModalMgr.getInstance().newSmallModal(AddProductCardTypeModal, null, null);
    activeModal.componentInstance.modalHeader = '新建分类';
    activeModal.componentInstance.addFunc = this.refreshTypeList.bind(this);
  }

  /**
   * 新建次卡分类 回调刷新分类列表
   */
  private refreshTypeList(addTypeId: string) {
    let storeId = SessionUtil.getInstance().getStoreId();
    this.addFormData.typeId = addTypeId;
    this.storeCardInfoMgr.getStoreCardInfo(storeId).then(
      (storeCardInfo) => {
        this.viewData.typeList = storeCardInfo.getValidProductCardTypeMap().values();
        this.service.handleViewData(this.viewData);
      });
  }

  /**
   *选择图片模态框
   */
  showPrdCardModal() {
    // const activeModal = this.modalService.open(ChooseCardModal, {size: 'lg', backdrop: 'static'});
    const activeModal = ZmModalMgr.getInstance().newModal(ChooseCardModal, null, null);
    for (var i = 1; i < 6; i++) {
      let imageStr = `img/logo/card/pic_consumption_card${i}.png`;
      activeModal.componentInstance.imageList.push(imageStr);
    }
    activeModal.componentInstance.callBackSub.subscribe(imgUrl => {
      if (imgUrl != null) {
        this.viewData.pageData.imgUrl = imgUrl;
      }
      this.cdRef.markForCheck();
    })

  }


  /**
   * 自动计算 单个平均价格
   */
  autoSetDiscount() {
    if (this.viewData.pageData.hasUnLimit) {
      return;
    }
    if (!this.addFormData.sellPrice){
      return;
    }
    if (this.productCardContentList.length == 0) {
      return;
    }

    let priceData = new PriceData();
    priceData.price = this.addFormData.sellPrice;
    this.productCardContentList.forEach(item => {
      priceData.totalPrice += item.price * item.count;
      priceData.totalPrice = AppUtils.twoDecimal(priceData.totalPrice);
    });
    let rate: number = priceData.price / priceData.totalPrice;

    for (let item of this.productCardContentList) {
      item.discountPrice = item.price * rate;
      item.discountPrice = AppUtils.twoDecimal(item.discountPrice);
      if (item.discountPrice > item.price) {
        item.discountPrice = item.price;
      }
    }
  }


  /**
   * 新建次卡点击事件
   */
  public addFormData = new AddProductCardForm();

  public async addProductCard() {
    let successForm = this.checkForm();

    if (successForm) {
      this.buildAddformData();
      let restResp:RestResp = await this.service.addProductCard(this.addFormData);
      this.handleResult(restResp);
    }
  }

  private checkForm() {
    let checkSuccess = true;
    if (AppUtils.isNullOrWhiteSpace(this.viewData.pageData.defaultNumber)
      || AppUtils.isNullObj(this.addFormData.typeId)
      || AppUtils.isNullOrWhiteSpace(this.addFormData.name)
      || AppUtils.isNullObj(this.addFormData.sellPrice)) {
      AppUtils.showWarn("提示", "必填项未按要求填写");
      checkSuccess = false;
    }

    if (AppUtils.isNullObj(this.productCardContentList)) {
      AppUtils.showWarn("提示", "请选择次卡内容");
      return;
    }

    if (this.addFormData.sellPrice > this.viewData.pageData.totalPrice) {
      AppUtils.showWarn("提示", "次卡售价不能大于产品总价");
      return;
    }

    if(this.addFormData.promotionPrice>this.addFormData.sellPrice){
      AppUtils.showWarn("提示","促销价不能大于售价");
      return;
    }

    return checkSuccess;
  }

  /**组装addForm*/
  private buildAddformData() {
    this.autoSetDiscount();
    this.viewData.pageData.state === true ? this.addFormData.status = CardStatusEnum.OPEN : this.addFormData.status = CardStatusEnum.CLOSE;
    this.viewData.pageData.promotionFlag === true ? this.addFormData.promotionFlag = PromotionFlagEnum.Yes : this.addFormData.promotionFlag = PromotionFlagEnum.No;
    this.addFormData.index = this.viewData.pageData.index;
    this.addFormData.number = AppUtils.trimBlank(this.viewData.pageData.defaultNumber);
    this.addFormData.imgPath = this.viewData.pageData.imgUrl;
    this.addFormData.productCardItems = this.buildProductCardItems();
  }

  private buildProductCardItems() {
    let productCardItems: Array<ProductCardItem> = new Array<ProductCardItem>();
    for (let item of this.productCardContentList) {
      let productCardItem = new ProductCardItem();
      productCardItem.pgId = item.id.toString();
      productCardItem.itemType = item.type;
      productCardItem.count = item.count;
      if(item.userType == UseTypeEnum.UNLIMIT_NUMBER){//无限次
        productCardItem.count = -1;
      }
      productCardItem.discountPrice = item.discountPrice;
      productCardItems.push(productCardItem);
    }
    return productCardItems;
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


class AddProductCardService {

  constructor(private storeCardInfoSynDataHolder: StoreCardInfoSynDataHolder,
              private storeCardInfoMgr: StoreCardInfoMgr,
              private storeCardInfoViewDataMgr: StoreCardInfoViewDataMgr) {
  }

  public initViewData(): void {
    this.storeCardInfoViewDataMgr.setAddProductCardViewData(new AddProductCardViewData());

    this.buildViewData().then(
      (viewDataP) => {
        this.handleViewData(viewDataP);
      }).catch(error => {
      AppUtils.handleError(error);
    });
  }

  public handleViewData(viewDataP: AddProductCardViewData) {
    this.storeCardInfoViewDataMgr.setAddProductCardViewData(viewDataP);
  }


  /**
   * 组装viewData
   * @param storeId
   * @returns Promise<AddProductCardViewData>
   */
  public async buildViewData(): Promise<AddProductCardViewData> {

    let storeId = SessionUtil.getInstance().getStoreId();
    let viewDataTmp = new AddProductCardViewData();

    let storeCardInfo: StoreCardInfo = await this.storeCardInfoSynDataHolder.getData(storeId);
    viewDataTmp.typeList = storeCardInfo.getValidProductCardTypeMap().values();
    // if(viewDataTmp.typeList.length>0){
    //   viewDataTmp.addFormData.typeId = viewDataTmp.typeList[0].id;
    // }

    let prdCardList = storeCardInfo.getProductCardList();
    viewDataTmp.productCardNumberList = this.bulidNumberList(prdCardList);

    let prdCardIndex: number = await this.getProductCardIndex(storeId);
    let tmpIndex = parseInt(prdCardIndex + "") + 1;
    viewDataTmp.pageData.index = tmpIndex;

    let tmpNo: number = 88000001 + parseInt(prdCardIndex + "");
    viewDataTmp.pageData.defaultNumber = tmpNo + "";

    viewDataTmp.flag = true;
    return new Promise<AddProductCardViewData>(resolve => {
      resolve(viewDataTmp);
    });
  }


  /**
   * 次卡编号列表
   * 新建时保证编号唯一性
   */
  private bulidNumberList(productCardList): Array<string> {
    let numberList = new Array<string>();
    for (let prdCard of productCardList) {
      numberList.push(prdCard.number);
    }
    return numberList;
  }


  /**
   *新建次卡方法
   *@param storeId:string
   *@param formData:AddProductCardForm
   *@returns Promise<boolean>
   */
  public addProductCard(formData: AddProductCardForm): Promise<RestResp> {
    let storeId = SessionUtil.getInstance().getStoreId();
    return new Promise<RestResp>(resolve => {
      this.storeCardInfoMgr.addProdutCard(storeId, formData).then(
        (restResp) => {
          resolve(restResp);
        }
      )
    });
  }

  /**
   * 获取productCardIndex,计算prdCardId
   * @param   storeId:string
   * @returns Promise<number>
   */
  public getProductCardIndex(storeId: string): Promise<number> {
    return new Promise<number>(resolve => {
      this.storeCardInfoSynDataHolder.getData(storeId).then(
        (storeCardInfo) => {
          resolve(storeCardInfo.productCardIndex);
        }
      );
    });
  }

}

export class AddProductCardViewData {
  public typeList: Array<PrdCardType> = new Array<PrdCardType>();

  public productCardNumberList: Array<string> = new Array<string>();

  public pageData: PageData = new PageData();

  public flag: boolean = false;//模态框数据是否已经初始化

}

export class PageData {

  public index: number;

  public defaultNumber: string;
  public defaultNumberPass: boolean;

  public state: boolean = true;
  public promotionFlag:boolean = false;

  public imgUrl: string = Constants.PRDCARD_DEFAULT_IMG;

  public hasUnLimit: boolean = false;
  public totalPrice: number = 0;

}

