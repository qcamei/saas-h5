import {Component, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import {IonicPage, NavParams} from "ionic-angular";
import {AddOrderViewDataMgr} from "./addOrderViewDataMgr";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {AppRouter} from "../../zmComUtils/AppRouter";
import {Order} from "../../../bsModule/order/data/Order";
import {StoreGoods} from "../../../bsModule/storeGoods/data/StoreGoods";
import {StoreGoodsSynDataHolder} from "../../../bsModule/storeGoods/StoreGoodsSynDataHolder";
import {Goods} from "../../../bsModule/storeGoods/data/Goods";
import {GoodsType} from "../../../bsModule/storeGoods/data/GoodsType";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {Store} from "../../../bsModule/store/data/Store";
import {BuyItem} from "../../../bsModule/order/data/BuyItem";
import {StoreProductInfo} from "../../../bsModule/StoreProductInfo/data/StoreProductInfo";
import {StoreProductInfoSynDataHolder} from "../../../bsModule/StoreProductInfo/StoreProductInfoSynDataHolder";
import {StorePackageProject} from "../../../bsModule/storePackageProject/data/StorePackageProject";
import {StorePackageProjectSynDataHolder} from "../../../bsModule/storePackageProject/StorePackageProjectSynDataHolder";
import {StoreCardInfo} from "../../../bsModule/storeCardInfo/data/StoreCardInfo";
import {StoreCardInfoSynDataHolder} from "../../../bsModule/storeCardInfo/StoreCardInfoSynDataHolder";
import {ProductInfo} from "../../../bsModule/StoreProductInfo/data/ProductInfo";
import {ProductType} from "../../../bsModule/StoreProductInfo/data/ProductType";
import {PackageProject} from "../../../bsModule/storePackageProject/data/PackageProject";
import {PackageProjectType} from "../../../bsModule/storePackageProject/data/PackageProjectType";
import {ProductCard} from "../../../bsModule/storeCardInfo/data/ProductCard";
import {PrdCardType} from "../../../bsModule/storeCardInfo/data/PrdCardType";
import {BuyTypeEnum} from "../../../bsModule/order/data/BuyTypeEnum";
import {PreOrderData, MallItemData} from "../list/mallListViewData";
import {PreOrderForCuserAddForm} from "../../../bsModule/order/apiData/PreOrderForCuserAddForm";
import {OrderMgr} from "../../../bsModule/order/orderMgr";
import {LeaguerDetail} from "../../../bsModule/leaguerDetail/data/LeaguerDetail";
import {LeaguerDetailMgr} from "../../../bsModule/leaguerDetail/LeaguerDetailMgr";
import {MembershipCard} from "../../../bsModule/storeCardInfo/data/MembershipCard";
import {BuyItemForCuser} from "../../../bsModule/order/apiData/BuyItemForCuser";
import {MallItemEnum} from "../../../comModule/enum/MallItemEnum";
import {Constants} from "../../zmComUtils/Constants";
import {ReceiverAddress} from "../../../bsModule/cuser/data/ReceiverAddress";
import {CUser} from "../../../bsModule/cuser/data/CUser";
import {CUserMgr} from "../../../bsModule/cuser/CUserMgr";
import {OrderTrackTypeEnum} from "../../../bsModule/orderTrack/data/OrderTrackTypeEnum";
import {PromotionFlagEnum} from "../../../comModule/enum/PromotionFlagEnum";

@IonicPage({
  name: "addOrder",
  segment: 'addOrder'
})

@Component({
  template: `
    <zm-page-header title="填写订单"></zm-page-header>
    <zm-page-content>
        <div mb-100-p>
        
          <div *ngIf="viewData.type==1 &&viewData.hasGoods">
            <ion-card style="padding: 5px 5px;margin-bottom:5px;">
              <span  item-subtitle>由于属性原因，仅支持商品快递配送。购买信息中包含的项目、或套餐、或次卡等产品，在支付完成后会默认进入我的预存，仅支持到店自提，商家不进行快递配送。
              </span>
            </ion-card>
          </div>
          
          
          <ion-card>
            <zm-img-radio [trackType]="viewData.type==0" [label]="'到店自提'" (zmClick)="selectTrackType(0)"></zm-img-radio>
            <zmk-address  class="mycheckbox" [storeName]="viewData.store.name" [phone]="viewData.store.tel"  [area]="viewData.store.area" [address]="viewData.store.address"></zmk-address>
          </ion-card>
          
          <ion-card style="margin-top:5px;" *ngIf="viewData.onlyHasGoods || viewData.hasGoods">
            <zm-img-radio [trackType]="viewData.type==1" [label]="'快递配送'" (zmClick)="selectTrackType(1)"></zm-img-radio>
          
            <address-select-comp [(addressVD)]= "viewData.address" ></address-select-comp>
          </ion-card>

            <zmk-title name="购买" ></zmk-title>
            
            <div *ngIf="viewData.preOrderData && viewData.preOrderData.buyProjectList">
              <ion-list *ngFor="let item of viewData.preOrderData.buyProjectList">

              <div *ngIf="item" [class.item-grey]="viewData.type==1 && item.itemType !=0">
                <zmk-goods-item  zmk-item-lg    imgSrc="{{item.defaultImg|zmImgPath}}" name="{{item.name}}" price="{{item.price}}"  promotionPrice="{{item.promotionPrice}}" typeName="{{item.typeName}}" hotSales="{{item.promotionFlag}}" [(zmCount)] = "item.count" (zmCountChange)="getTotalData()"></zmk-goods-item>
              </div>
               
            </ion-list>
            </div>
            
            <div style="padding:15px 10px;border-bottom:1px solid #ccc;" w-100 fxLayout="row" fxLayoutAlign="space-between center">
              <span>商品总计</span>
              <span>￥{{viewData.preOrderData.totalPrice|number:'1.2-2'}}</span>
            </div>
            <div style="padding:15px 10px;border-bottom:1px solid #ccc;"w-100 fxLayout="row" fxLayoutAlign="space-between center">
              <span>折扣总计</span>
              <span>￥{{(viewData.preOrderData.totalPrice-viewData.preOrderData.totalDisCountPrice)|number:'1.2-2'}}</span>
            </div>
          </div>

    </zm-page-content>

    
    <ion-footer>
        <ion-row style="background:#ffffff;padding:0px 15px;border-top:3px solid #F7F7F7;" w-100 fxLayout="row" fxLayoutAlign="space-between center">
            <div style="font-size:16px;">
                  应付金额：<span style="color:red;">￥{{viewData.preOrderData.totalDisCountPrice|number:'1.2-2'}}</span>
            </div>
            <div>
              <button ion-button small  (click)="addOrder()" style="padding:15px 5px;">提交订单</button>
            </div>
        </ion-row>

    </ion-footer>
  `,
  styles: [`
  [bg-shopping]{
    background:#4C4C4C;
  }
  .item-grey{
    opacity: 0.5;
  }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class AddOrderPage {

  private service: AddOrderService;
  private viewDataSub: any;
  public viewData: AddOrderViewData = new AddOrderViewData;

  constructor(private cdRef: ChangeDetectorRef, private navParams: NavParams) {

    this.service = new AddOrderService();

    let initData = new AddOrderViewData();
    this.viewDataSub = AddOrderViewDataMgr.getInstance().onDataChanged(initData, (viewDataP: AddOrderViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });

  }

  ionViewDidEnter() {
    this.initData();
  }

  private initData() {
    let targetId = AppRouter.getInstance().getTargetId(this.navParams);
    this.service.initViewData(targetId);
  }

  goPrdCardDetailPage(prdCardId: string) {
    AppRouter.getInstance().goPrdCardDetailPage(prdCardId);
  }

  selectTrackType(val: number) {
    this.viewData.type = val;
    if (AppUtils.isNullOrWhiteSpace(this.viewData.address.receiver)) {
      AppRouter.getInstance().goAddressListPage();
    }
  }

  public getTotalData() {
    let buyProjectList = this.viewData.preOrderData.buyProjectList.filter(
      (item) => {
        if (item.count > 0) {
          return item;
        }
      });
    if (buyProjectList.length == 0) {
      AppRouter.getInstance().goMallPage();
    }
    let preOrderData = new PreOrderData();
    preOrderData.buyProjectList = buyProjectList;
    buyProjectList.forEach((item: MallItemData) => {
      preOrderData.totalPrice += parseInt((item.price * item.count * 100).toString()) / 100;
      if (item.promotionFlag == PromotionFlagEnum.Yes) {//促销
        let sellPrice = item.promotionPrice * item.count;
        preOrderData.totalDisCountPrice += parseInt((sellPrice * 100).toString()) / 100;
      }
    });
    buyProjectList.forEach((item: MallItemData) => {
      if (item.promotionFlag == PromotionFlagEnum.No) {//促销
        let sellPrice = item.price * item.count * (item.discount / 10);
        preOrderData.totalDisCountPrice += parseInt((sellPrice * 100).toString()) / 100;
      }
    });
    this.viewData.preOrderData = preOrderData;

  }

  /**
   * 添加订单
   */
  public addOrder() {
    let addOrderForm = new PreOrderForCuserAddForm();
    let cuserId = SessionUtil.getInstance().getLoginCUserId();
    let storeId = SessionUtil.getInstance().getCurStoreId();
    addOrderForm.creatorId = cuserId;
    addOrderForm.leaguerId = storeId + "_" + cuserId;
    addOrderForm.cost = this.viewData.preOrderData.totalDisCountPrice;
    addOrderForm.storeId = storeId;
    addOrderForm.memberCardId = this.viewData.memCard && this.viewData.memCard.id ? this.viewData.memCard.id : '';
    addOrderForm.buyItemForCusers = this.getBuyItems();
    addOrderForm.type = this.viewData.type;
    if (addOrderForm.type == OrderTrackTypeEnum.Express) {
      addOrderForm.receiver = this.viewData.address.receiver;
      addOrderForm.phone = this.viewData.address.phone;
      addOrderForm.address = this.viewData.address.getFullAddressStr();
    }

    this.service.addOrder(addOrderForm).then((order: Order) => {
      if (!AppUtils.isNullObj(order)) {
        AppUtils.showSuccess("提示", "添加订单成功");
        AppRouter.getInstance().goPayTypeSelectPage(order.id);
      } else {
        AppUtils.showError("提示", "添加订单失败");
      }
    });
  }

  private getBuyItems() {
    let list: Array<MallItemData> = this.viewData.preOrderData.buyProjectList;
    let buyItemForCusers = new Array<BuyItemForCuser>();
    if (list.length > 0) {
      for (let item of list) {
        let buyItem = new BuyItemForCuser();
        buyItem.pgId = item.id;
        buyItem.oldPrice = item.price;
        buyItem.count = item.count;
        buyItem.restCount = item.count;
        buyItem.discount = item.discount;

        if (item.itemType == MallItemEnum.Goods) {
          buyItem.buyType = BuyTypeEnum.GOODS;
        } else if (item.itemType == MallItemEnum.Product) {
          buyItem.buyType = BuyTypeEnum.PRODUCT;
        } else if (item.itemType == MallItemEnum.Package) {
          buyItem.buyType = BuyTypeEnum.PACKAGE;
        } else if (item.itemType == MallItemEnum.ProductCard) {
          buyItem.buyType = BuyTypeEnum.PRDCARD;
        }
        buyItemForCusers.push(buyItem);
      }
    }
    return buyItemForCusers;
  }

}

export class AddOrderService {

  constructor() {
  }

  private static preOrderData: PreOrderData = new PreOrderData();

  private  getPreOrderData() {
    return AddOrderService.preOrderData;
  }

  public static setPreOrderData(preOrderDataP: PreOrderData) {
    AddOrderService.preOrderData = preOrderDataP;
  }


  public initViewData(orderId?: string) {
    let viewDataTmp = new AddOrderViewData();
    AddOrderViewDataMgr.getInstance().setData(viewDataTmp);

    this.buildViewData(orderId).then((viewData: AddOrderViewData) => {
      this.handleViewData(viewData);
    });


  }

  /**
   * 处理回调
   * @param viewDataP
   */
  public handleViewData(viewDataP: AddOrderViewData) {
    AddOrderViewDataMgr.getInstance().setData(viewDataP);
  }

  public async buildViewData(orderId?: string): Promise<AddOrderViewData> {
    let viewDataTmp = new AddOrderViewData();
    let storeId = SessionUtil.getInstance().getCurStoreId();
    let store: Store = await SessionUtil.getInstance().getCurStore();
    viewDataTmp.store = store;

    let cuserId = SessionUtil.getInstance().getLoginCUserId();
    let leaguerId = AppUtils.format("{0}_{1}", storeId, cuserId);
    let leaguerDetail: LeaguerDetail = await LeaguerDetailMgr.getInstance().get(storeId, leaguerId);
    let storeCardInfo: StoreCardInfo = await StoreCardInfoSynDataHolder.getInstance().getData(storeId);
    if (leaguerDetail && leaguerDetail.leaguerMemberCard) {
      let memCardId = leaguerDetail.leaguerMemberCard.cardId;
      if (storeCardInfo) {
        viewDataTmp.memCard = storeCardInfo.getMemberCardMap().get(memCardId);
      }
    }
    if (!AppUtils.isNullObj(storeCardInfo)) {
      viewDataTmp.allProductCardMap = storeCardInfo.getAllProductCardMap();
      viewDataTmp.allProductCardTypeMap = storeCardInfo.getAllProductCardTypeMap();
    }

    let storeGoods: StoreGoods = await StoreGoodsSynDataHolder.getInstance().getData(storeId);
    if (!AppUtils.isNullObj(storeGoods)) {
      viewDataTmp.allGoodsMap = storeGoods.getAllGoodsMap();
      viewDataTmp.allGoodsTypeMap = storeGoods.getAllGoodsTypeMap();
    }
    let storeProductInfo: StoreProductInfo = await StoreProductInfoSynDataHolder.getInstance().getData(storeId);
    if (!AppUtils.isNullObj(storeProductInfo)) {
      viewDataTmp.allProductMap = storeProductInfo.getAllProductInfoMap();
      viewDataTmp.allProductTypeMap = storeProductInfo.getAllProductTypeMap();
    }

    let storePackageProject: StorePackageProject = await StorePackageProjectSynDataHolder.getInstance().getData(storeId);
    if (!AppUtils.isNullObj(storePackageProject)) {
      viewDataTmp.allPackageMap = storePackageProject.getAllPackageProjectMap();
      viewDataTmp.allPackageTypeMap = storePackageProject.getAllPackageTypeMap();
    }

    //再次购买
    if (!AppUtils.isNullOrWhiteSpace(orderId)) {
      let orderTmp: Order = await OrderMgr.getInstance().get(storeId, orderId);
      let preOrderData = new PreOrderData();
      let buyProjectList = this.buildBuyProjectList(orderTmp.buyItems, viewDataTmp);
      preOrderData.buyProjectList = buyProjectList;

      let itemTypeList = new Array<number>();
      buyProjectList.forEach((item: MallItemData) => {
        itemTypeList.push(item.itemType);

        preOrderData.totalPrice += parseInt((item.price * item.count * 100).toString()) / 100;
        if (item.promotionFlag == PromotionFlagEnum.No) {
          let sellPrice = item.price * item.count * (item.discount / 10);
          preOrderData.totalDisCountPrice += parseInt((sellPrice * 100).toString()) / 100;
        }
      });
      buyProjectList.forEach((item: MallItemData) => {
        if (item.promotionFlag == PromotionFlagEnum.Yes) {
          let sellPrice = item.price * item.count;
          preOrderData.totalDisCountPrice += parseInt((sellPrice * 100).toString()) / 100;
        }
      });
      viewDataTmp.preOrderData = preOrderData;

      if (AppUtils.arrayContains(itemTypeList, MallItemEnum.Goods) &&
        (AppUtils.arrayContains(itemTypeList, MallItemEnum.Product) || AppUtils.arrayContains(itemTypeList, MallItemEnum.Package) || AppUtils.arrayContains(itemTypeList, MallItemEnum.ProductCard))) {
        viewDataTmp.hasGoods = true;
      }
      if (!AppUtils.arrayContains(itemTypeList, MallItemEnum.Product)
        && (!AppUtils.arrayContains(itemTypeList, MallItemEnum.Package))
        && (!AppUtils.arrayContains(itemTypeList, MallItemEnum.ProductCard))) {
        viewDataTmp.onlyHasGoods = true;
      }
    } else {
      viewDataTmp.preOrderData = this.getPreOrderData();

      let itemTypeList = new Array<number>();
      viewDataTmp.preOrderData.buyProjectList.forEach((item: MallItemData) => {
        itemTypeList.push(item.itemType);
      });
      if (AppUtils.arrayContains(itemTypeList, MallItemEnum.Goods) &&
        (AppUtils.arrayContains(itemTypeList, MallItemEnum.Product) || AppUtils.arrayContains(itemTypeList, MallItemEnum.Package) || AppUtils.arrayContains(itemTypeList, MallItemEnum.ProductCard))) {
        viewDataTmp.hasGoods = true;
      }
      if (!AppUtils.arrayContains(itemTypeList, MallItemEnum.Product)
        && (!AppUtils.arrayContains(itemTypeList, MallItemEnum.Package))
        && (!AppUtils.arrayContains(itemTypeList, MallItemEnum.ProductCard))) {
        viewDataTmp.onlyHasGoods = true;
      }
    }

    /****************** 加载cuser的默认收货地址 ****************/
    let cuser: CUser = await CUserMgr.getInstance().getCUser(cuserId);
    if (!AppUtils.isNullObj(cuser)) {
      viewDataTmp.address = cuser.getDefaultAddress();
    }

    return new Promise<AddOrderViewData>(resolve => {
      resolve(viewDataTmp);
    });
  }

  private buildBuyProjectList(buyItems: Array<BuyItem>, viewDataTmp: AddOrderViewData) {
    let targetList = new Array<MallItemData>();
    if (buyItems && buyItems.length > 0) {
      for (let buyItem of buyItems) {
        let target = new MallItemData();
        target.id = buyItem.pgId;
        target.name = buyItem.pgName;
        target.itemType = this.getType(buyItem.buyType);
        target.price = buyItem.price;
        target.count = buyItem.count;
        target.discount = buyItem.discount;
        if (buyItem.buyType == BuyTypeEnum.PRODUCT) {
          let productInfo: ProductInfo = viewDataTmp.allProductMap.get(buyItem.pgId);
          if (productInfo) {
            target.number = productInfo.number;
            target.topFlag = productInfo.topFlag;
            target.promotionFlag = productInfo.promotionFlag;
            target.promotionPrice = productInfo.promotionPrice;
            if (productInfo.defaultImg) {
              target.defaultImg = productInfo.defaultImg;
            } else {
              target.defaultImg = Constants.PRODUCT_DEFAULT_IMG;
            }
            let productType: ProductType = viewDataTmp.allProductTypeMap.get(productInfo.typeId);
            if (productType) {
              target.typeId = productType.id;
              target.typeName = productType.name;
            }
          }
        } else if (buyItem.buyType == BuyTypeEnum.GOODS) {
          let goods: Goods = viewDataTmp.allGoodsMap.get(buyItem.pgId);
          if (goods) {
            target.number = goods.number;
            target.topFlag = goods.topFlag;
            target.promotionFlag = goods.promotionFlag;
            target.promotionPrice = goods.promotionPrice;
            if (goods.defaultImg) {
              target.defaultImg = goods.defaultImg;
            } else {
              target.defaultImg = Constants.GOODS_DEFAULT_IMG;
            }
            let goodsType: GoodsType = viewDataTmp.allGoodsTypeMap.get(goods.typeId);
            if (goodsType) {
              target.typeId = goodsType.id;
              target.typeName = goodsType.name;
            }
          }
        } else if (buyItem.buyType == BuyTypeEnum.PACKAGE) {
          let packageProject: PackageProject = viewDataTmp.allPackageMap.get(buyItem.pgId);
          if (packageProject) {
            target.number = packageProject.number;
            target.topFlag = packageProject.topFlag;
            target.promotionFlag = packageProject.promotionFlag;
            target.promotionPrice = packageProject.promotionPrice;
            if (packageProject.defaultImg) {
              target.defaultImg = packageProject.defaultImg;
            } else {
              target.defaultImg = Constants.PACKAGE_DEFAULT_IMG;
            }
            let packageProjectType: PackageProjectType = viewDataTmp.allPackageTypeMap.get(packageProject.typeId);
            if (packageProjectType) {
              target.typeId = packageProjectType.id;
              target.typeName = packageProjectType.name;
            }
          }
        } else if (buyItem.buyType == BuyTypeEnum.PRDCARD) {
          let productCard: ProductCard = viewDataTmp.allProductCardMap.get(buyItem.pgId);
          if (productCard) {
            target.number = productCard.number;
            target.topFlag = productCard.topFlag;
            target.promotionFlag = productCard.promotionFlag;
            target.promotionPrice = productCard.promotionPrice;
            if (productCard.imgPath) {
              target.defaultImg = productCard.imgPath;
            } else {
              target.defaultImg = Constants.PRDCARD_DEFAULT_IMG;
            }
            let productCardType: PrdCardType = viewDataTmp.allProductCardTypeMap.get(productCard.typeId);
            if (productCardType) {
              target.typeId = productCardType.id;
              target.typeName = productCardType.name;
            }
          }
        }

        if (target.count > 0) {
          targetList.push(target);
        }
      }
    }

    return targetList;
  }

  private getType(buyType: number) {
    let itemType = null;
    if (buyType == BuyTypeEnum.GOODS) {
      itemType = MallItemEnum.Goods;
    } else if (buyType == BuyTypeEnum.PRODUCT) {
      itemType = MallItemEnum.Product;
    } else if (buyType == BuyTypeEnum.PACKAGE) {
      itemType = MallItemEnum.Package;
    } else if (buyType == BuyTypeEnum.PRDCARD) {
      itemType = MallItemEnum.ProductCard;
    }
    return itemType;
  }


  public addOrder(addOrderForm: PreOrderForCuserAddForm): Promise<Order> {
    return new Promise<Order>(resolve => {
      OrderMgr.getInstance().addOrder(addOrderForm).then(
        (order) => {
          resolve(order);
        }
      )
    });
  }

}

export class AddOrderViewData {
  public allGoodsMap: ZmMap<Goods>;
  public allGoodsTypeMap: ZmMap<GoodsType>;

  public allProductMap: ZmMap<ProductInfo>;
  public allProductTypeMap: ZmMap<ProductType>;

  public allPackageMap: ZmMap<PackageProject>;
  public allPackageTypeMap: ZmMap<PackageProjectType>;

  public allProductCardMap: ZmMap<ProductCard>;
  public allProductCardTypeMap: ZmMap<PrdCardType>;

  public memCard: MembershipCard = new MembershipCard();
  public preOrderData: PreOrderData = new PreOrderData();

  public type: number = 0;//快递类别

  public order: AddOrderVD = new AddOrderVD();
  public store: Store = new Store();
  public address: ReceiverAddress = new ReceiverAddress(); //快递配送的收货地址

  public hasGoods: boolean = false;
  public onlyHasGoods: boolean = false;

}
export class AddOrderVD {
  id: string;
  number: string;
  cost: number;//订单折后价
  realPay: number;//订单实付
  status: number;//OrderStatusEnum
  buyItems: Array<BuyItemData> = new Array<BuyItemData>();
  storeId: number;
  createdTime: number;
  payTime: number;

  totalPrice: number = 0;//订单总折扣价
  totalCost: number = 0;//订单总价
  totalDiscount: number = 0;//总折扣
  constructor() {
  }

  public static fromOrder(order: Order) {
    let target = new AddOrderVD();
    target.id = order.id;
    target.number = order.number;
    target.status = order.status;
    target.storeId = order.storeId;
    target.cost = order.cost;
    target.realPay = order.realPay;

    target.createdTime = order.createdTime;
    target.payTime = order.payTime;
    return target;
  }
}

class BuyItemData {
  pgId: string;
  pgName: string;
  pgImg: string;
  pgTypeId: string;
  pgTypeName: string;

  price: number;//单个折后价
  sellPrice: number;//原价
  count: number;
  discount: number;
  cost: number;//总原价
  pay: number;//总的折后价
  constructor() {
  }

  public static fromBuyItem(buyItem: BuyItem) {
    let itemData = new BuyItemData();
    itemData.pgId = buyItem.pgId;
    itemData.count = buyItem.count;
    itemData.discount = buyItem.discount;
    itemData.price = buyItem.price;
    itemData.sellPrice = buyItem.price * (buyItem.discount / 10);
    itemData.cost = buyItem.cost;
    itemData.pay = buyItem.pay;
    return itemData;
  }
}






