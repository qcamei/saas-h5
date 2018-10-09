import {IonicPage, NavParams, ViewController} from "ionic-angular";
import {ChangeDetectorRef, Component} from "@angular/core";
import {ProductSelectListViewDataMgr} from "./productSelectListViewDataMgr";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {ProductInfo} from "../../../bsModule/StoreProductInfo/data/ProductInfo";
import {ProductType} from "../../../bsModule/StoreProductInfo/data/ProductType";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {BUser} from "../../../bsModule/buser/data/BUser";
import {StoreProductInfoMgr} from "../../../bsModule/StoreProductInfo/StoreProductInfoMgr";
import {AppRouter} from "../../zmComUtils/AppRouter";
import {ModalCtrl} from "../../zmComUtils/ModalCtrl";

@IonicPage({
  name: "productSelectList",
  segment: 'productSelectList'
})

@Component({
  template: `
    <zm-page-header title="选择项目"></zm-page-header>
    <!--<zm-modal-header title="选择项目" [cancel]="modalCtrl.cancelFunc()"></zm-modal-header>-->
    <zm-page-content>
      <ng-container *ngIf="viewData.productList">
        <zmb-appoint-product-item
          *ngFor="let item of viewData.productList"
          [item]="item"
          [typeMap]="viewData.productTypeMap">
        </zmb-appoint-product-item>

        <zm-no-data *ngIf="viewData.productList&&viewData.productList.length==0"  text="没有数据" ></zm-no-data>
      </ng-container>
    </zm-page-content>
    <ion-footer>
      <div style="padding:0 15px;">
        <button ion-button block (click)="confirmClick()"> 确定</button>
      </div>
    </ion-footer>
  `
})

export class ProductSelectListPage {


  public viewData: ProductSelectListViewData = new ProductSelectListViewData();
  private service: ProductSelectListService;
  public modalCtrl:ModalCtrl;

  callback: (selectedProductList:Array<ProductItemData>)=>void;

  constructor(private cdRef: ChangeDetectorRef,
              public navParams: NavParams,
              private viewCtrl: ViewController) {
    this.modalCtrl = ModalCtrl.newCtrl(viewCtrl);
    this.service = new ProductSelectListService();
    ProductSelectListViewDataMgr.getInstance().onDataChange(new ProductSelectListViewData(), (viewDataP => {
      if (viewDataP) {
        this.viewData = viewDataP;
        this.cdRef.markForCheck();
      }
    }));

    this.callback = AppRouter.getInstance().getTargetObj(this.navParams);
  }

  ionViewWillEnter() {
    this.service.buildViewData();
  }

  confirmClick(){
    this.viewData.selectedProductList = new Array();
    this.viewData.productList.forEach((item)=>{
      if(item.selected){
        this.viewData.selectedProductList.push(item);
      }
    });
    // this.modalCtrl.dismiss(this.viewData.selectedProductList);
    this.callback(this.viewData.selectedProductList);
    AppRouter.getInstance().pop();
  }

}

export class ProductSelectListService {

  public async buildViewData() {
    let viewDataTmp:ProductSelectListViewData = new ProductSelectListViewData();
    ProductSelectListViewDataMgr.getInstance().setData(viewDataTmp);

    let storeId = SessionUtil.getInstance().getCurStoreId();

    /********************************项目数据*************************************/
    let storeProductInfo = await StoreProductInfoMgr.getInstance().get(storeId);
    if(!AppUtils.isNullObj(storeProductInfo)) {
      viewDataTmp.productList = storeProductInfo.getOpenProductInfoMap().values().map((item:ProductInfo)=>{
        let productItemData = ProductItemData.fromProduct(item);
        viewDataTmp.buserList.forEach((item:BUser)=>{
          productItemData.staffList.push(StaffItemData.fromBuser(item));
        })
        return productItemData;
      });
      viewDataTmp.productTypeMap = storeProductInfo.getAllProductTypeMap();
    }

    ProductSelectListViewDataMgr.getInstance().setData(viewDataTmp);
  }

}

export class ProductSelectListViewData {

  /*****************************项目列表数据***************************************/
  selectedProductList: Array<ProductItemData> = new Array<ProductItemData>();
  productList: Array<ProductItemData> = new Array<ProductItemData>();
  productTypeMap: ZmMap<ProductType> = new ZmMap<ProductType>();

  /*****************************服务人员数据***************************************/
  buserList: Array<BUser> = new Array<BUser>();
  selectedProductItem:ProductItemData;

}


export class ProductItemData{
  id: string;
  name: string;
  typeId: string;
  defaultImg: string;
  price:number=0;
  count:number=0; //预约的项目数量
  staffList:Array<StaffItemData> = new Array<StaffItemData>(); //服务人员
  staffIds:Array<string> = new Array<string>(); //选中的服务人员id
  selected:boolean = false; //是否选中

  public static fromProduct(item:ProductInfo):ProductItemData{
    let productItemData = new ProductItemData();
    productItemData.id = item.id;
    productItemData.name = item.name;
    productItemData.typeId = item.typeId;
    productItemData.defaultImg = item.defaultImg;
    productItemData.price = item.price;
    return productItemData;
  }
}

export class StaffItemData{
  id:string;
  name:string;
  phone:string;
  headImg:string;
  gender:number;
  selected:boolean = false; //是否选中

  public static fromBuser(item:BUser):StaffItemData{
    let staffItemData = new StaffItemData();
    staffItemData.id = item.id;
    staffItemData.name = item.name;
    staffItemData.phone = item.phone;
    staffItemData.headImg = item.headImg;
    staffItemData.gender = item.gender;
    return staffItemData;
  }
}
