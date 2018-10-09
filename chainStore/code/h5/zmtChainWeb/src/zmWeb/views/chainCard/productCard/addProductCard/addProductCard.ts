import {Component, OnInit, ChangeDetectorRef, OnDestroy} from "@angular/core";
import {AppUtils} from "../../../../comModule/AppUtils";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {ChainCardMgr} from "../../../../bsModule/chainCard/chainCardMgr";
import {ChainCardViewDataMgr} from "../../ChainCardViewDataMgr";
import {AddProductCardForm} from "../../../../bsModule/chainCard/apiData/AddProductCardForm";
import {ChooseCardModal} from "../../Comp/ChooseImgComp/ChooseCardModal.Component";
import {ChainCardSynDataHolder} from "../../../../bsModule/chainCard/chainCardSynDataHolder";
import {Constants} from "../../../common/Util/Constants";
import {PromptMsg} from "../../../common/Util/PromptMsg";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CardStatusEnum} from "../../../../bsModule/chainCard/data/CardStatusEnum";
import {ProductData} from "../../Comp/productCardContentComp/ProductCardContentCompViewData";
import {ChainCard} from "../../../../bsModule/chainCard/data/ChainCard";
import {PrdCardType} from "../../../../bsModule/chainCard/data/PrdCardType";
import {AddProductCardTypeModal} from "../productCardType/addProductCardTypeCompl";
import {PriceData, StoreVD} from "../../../chainPackageProject/packageProject/addPackage/addPackage";
import {ProductCardItem} from "../../../../bsModule/chainCard/data/ProductCardItem";
import {StoreMgr} from "../../../../bsModule/store/storeMgr";
import {StoreListComp} from "../../../productionLibrary/Comp/storeListComp/StoreListComp";
import {ZmModalMgr} from "../../../zmComp/modal/ZmModalMgr";
import {AddProductCardTypeWithReturnComp} from "../../Comp/addTypeWithReturn/addPrdCardTypeWithReturn";


@Component({
  selector: 'page-chainCard-addProductCard',
  templateUrl: 'addProductCard.html',
})

export class AddProductCardPage implements OnInit,OnDestroy {

  private service: AddProductCardService;
  public viewData: AddProductCardViewData;
  private viewDataSub: any;
  public productCardContentList: Array<ProductData> = new Array<ProductData>();

  constructor(private chainCardSynDataHolder: ChainCardSynDataHolder,
              private chainCardMgr: ChainCardMgr,
              private chainCardViewDataMgr: ChainCardViewDataMgr,
              private storeMgr: StoreMgr,
              private cdRef: ChangeDetectorRef,
              private modalService: NgbModal) {
    this.service = new AddProductCardService(this.chainCardSynDataHolder, this.chainCardMgr, this.chainCardViewDataMgr, this.storeMgr);
  }

  ngOnInit() {
    this.viewDataSub = this.chainCardViewDataMgr.subscribeAddProductCardVD((viewDataP: AddProductCardViewData) => {
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

  hasUnlimitCallback(hasUnLimit: boolean) {
    this.viewData.pageData.hasUnLimit = hasUnLimit;
  }

  /**
   * 新建次卡分类
   */
  public addType() {
    let modalData = {modalHeader: '新建分类',};
    let tmp = this;
    let callBack = (addTypeId:string) => {
      tmp.refreshTypeList(addTypeId);//回调刷新列表
    };
    ZmModalMgr.getInstance().newSmallModal(AddProductCardTypeWithReturnComp,modalData,callBack);
  }

  /**
   * 新建次卡分类 回调刷新分类列表
   */
  private refreshTypeList(addTypeId: string) {
    let chainId = SessionUtil.getInstance().getChainId();
    this.chainCardMgr.getChainCard(chainId).then(
      (chainCard) => {
        this.viewData.typeList = chainCard.getValidProductCardTypeMap().values();
        this.viewData.pageData.typeId = Constants.PRODUCTCARD_TYPE_PREFIX + chainId + "_" + addTypeId;
        this.addFormData.typeId = addTypeId;
        this.service.handleViewData(this.viewData);
      });
  }

  /**
   *选择图片模态框
   */
  showPrdCardModal() {

    let imageArr = new Array<string>();
    for (let i = 1; i < 7; i++) {
      let imageStr = `img/logo/card/pic_consumption_card${i}.png`;
      imageArr.push(imageStr);
    }

    let modalData = {imageList:imageArr};
    let tmp = this;
    let callBack = (imgUrl) => {
      if (imgUrl != null) {
        tmp.viewData.pageData.imgUrl = imgUrl;
      }
      tmp.cdRef.markForCheck();
    };
    ZmModalMgr.getInstance().newLgModal(ChooseCardModal,modalData,callBack);

  }


  /**
   * 自动计算 单个平均价格
   */
  autoSetDiscount() {
    if (this.viewData.pageData.hasUnLimit) {
      return;
    }
    if (!this.addFormData.sellPrice) {
      return;
    }
    if (this.productCardContentList.length==0) {
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
      let success = await this.service.addProductCard(this.addFormData);
      this.handleResult(success);
    }
  }

  private checkForm() {
    this.checkNumber();
    let checkSuccess = true;
    if (AppUtils.isNullOrWhiteSpace(this.viewData.pageData.defaultNumber)
      || AppUtils.isNullObj(this.viewData.pageData.typeId)
      || AppUtils.isNullOrWhiteSpace(this.addFormData.name)
      || AppUtils.isNullObj(this.addFormData.sellPrice)
      || this.viewData.pageData.isExitNumber == true) {
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

    return checkSuccess;
  }

  /**组装addForm*/
  private buildAddformData() {
    this.viewData.pageData.state === true ? this.addFormData.status = CardStatusEnum.OPEN : this.addFormData.status = CardStatusEnum.CLOSE;
    this.addFormData.index = this.viewData.pageData.index;
    this.addFormData.number = AppUtils.trimBlank(this.viewData.pageData.defaultNumber);
    this.addFormData.imgPath = this.viewData.pageData.imgUrl;
    this.addFormData.productCardItems = this.buildProductCardItems();
    this.addFormData.typeId = this.viewData.pageData.typeId;
    this.addFormData.applyStoreIds = this.viewData.selectStoreIds;
  }

  private buildProductCardItems() {
    let productCardItems: Array<ProductCardItem> = new Array<ProductCardItem>();
    for (let item of this.productCardContentList) {
      let productCardItem = new ProductCardItem();
      productCardItem.pgId = item.id.toString();
      productCardItem.itemType = item.type;
      productCardItem.count = item.count;
      productCardItem.discountPrice = item.discountPrice;
      productCardItems.push(productCardItem);
    }
    return productCardItems;
  }

  /**
   * 处理结果
   */
  private handleResult(successP: boolean): void {
    if (successP) {
      AppUtils.showSuccess(PromptMsg.PROMPT, PromptMsg.NEW_SUCCESS);
      history.go(-1);
    } else {
      AppUtils.showError(PromptMsg.PROMPT, PromptMsg.NEW_ERROR);
    }
  }

  /**number唯一性*/
  checkNumber() {
    let number = AppUtils.trimBlank(this.viewData.pageData.defaultNumber);
    let numberList: Array<string> = this.viewData.productCardNumberList;
    if (AppUtils.arrayContains(numberList, number)) {
      this.viewData.pageData.isExitNumber = true;
    } else {
      this.viewData.pageData.isExitNumber = false;
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

  private getSelectedStore(storeList: Array<StoreVD>) {
    this.viewData.selectStoreList = storeList;
    this.viewData.selectStoreIds = storeList.map((item) => {
      return item.id;
    });
  }

  public removeStore() {
    this.viewData.selectStoreIds = this.viewData.selectStoreList.map((item) => {
      return item.id;
    });
  }


}


class AddProductCardService {

  constructor(private chainCardSynDataHolder: ChainCardSynDataHolder,
              private chainCardMgr: ChainCardMgr,
              private chainCardViewDataMgr: ChainCardViewDataMgr,
              private storeMgr: StoreMgr,) {
  }

  public initViewData(): void {
    this.chainCardViewDataMgr.setAddProductCardViewData(new AddProductCardViewData());

    this.buildViewData().then(
      (viewDataP) => {
        this.handleViewData(viewDataP);
      }).catch(error => {
      AppUtils.handleError(error);
    });
  }

  public handleViewData(viewDataP: AddProductCardViewData) {
    this.chainCardViewDataMgr.setAddProductCardViewData(viewDataP);
  }


  /**
   * 组装viewData
   * @param chainId
   * @returns Promise<AddProductCardViewData>
   */
  public async buildViewData(): Promise<AddProductCardViewData> {

    let chainId = SessionUtil.getInstance().getChainId();
    let viewDataTmp = new AddProductCardViewData();
    let pageResp = await this.storeMgr.findStoreByCond(chainId);
    if (pageResp) {
      viewDataTmp.storeList = pageResp.list.map((store) => {
        return StoreVD.fromStore(store);
      });
    }

    let chainCard: ChainCard = await this.chainCardSynDataHolder.getData(chainId);
    viewDataTmp.typeList = chainCard.getValidProductCardTypeMap().values();

    let prdCardList = chainCard.getProductCardMap().values();
    viewDataTmp.productCardNumberList = this.bulidNumberList(prdCardList);

    let prdCardIndex: number = await this.getProductCardIndex(chainId);
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
   *@param chainId:string
   *@param formData:AddProductCardForm
   *@returns Promise<boolean>
   */
  public addProductCard(formData: AddProductCardForm): Promise<boolean> {
    let chainId = SessionUtil.getInstance().getChainId();
    return new Promise<boolean>(resolve => {
      this.chainCardMgr.addProdutCard(chainId, formData).then(
        (success) => {
          resolve(success);
        }
      )
    });
  }

  /**
   * 获取productCardIndex,计算prdCardId
   * @param   chainId:string
   * @returns Promise<number>
   */
  public getProductCardIndex(chainId: string): Promise<number> {
    return new Promise<number>(resolve => {
      this.chainCardSynDataHolder.getData(chainId).then(
        (chainCard) => {
          resolve(chainCard.productCardIndex);
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

  public storeList: Array<StoreVD> = new Array<StoreVD>();
  public selectStoreList: Array<StoreVD> = new Array<StoreVD>();
  public selectStoreIds: Array<string> = new Array<string>();

}

export class PageData {

  public index: number;
  public typeId: string;

  public isExitNumber: boolean = false;
  public defaultNumber: string;
  public defaultNumberPass:boolean;

  public state: boolean = true;

  public imgUrl: string = Constants.PRDCARD_DEFAULT_IMG;

  public hasUnLimit: boolean = false;
  public totalPrice: number = 0;

}

