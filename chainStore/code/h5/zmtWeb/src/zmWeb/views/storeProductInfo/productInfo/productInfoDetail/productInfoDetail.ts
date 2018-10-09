import {Component, ChangeDetectionStrategy, OnInit, OnDestroy, ChangeDetectorRef} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {AppUtils, ZmMap} from "../../../../comModule/AppUtils";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {StoreProductInfoSynDataHolder} from "../../../../bsModule/StoreProductInfo/StoreProductInfoSynDataHolder";
import {StoreProductInfoViewDataMgr} from "../../storeProductViewDataMgr";
import {StoreProductInfo} from "../../../../bsModule/StoreProductInfo/data/StoreProductInfo";
import {
  ProductDetailCacheDataHolder
} from "../../../../bsModule/productDetail/ProductDetailCacheDataHolder";
import {ProductDetail} from "../../../../bsModule/productDetail/data/ProductDetail";
import {ProductType} from "../../../../bsModule/StoreProductInfo/data/ProductType";
import {AppRouter} from "../../../../comModule/AppRouter";
import {Constants} from "../../../common/Util/Constants";


@Component({
  selector: 'page-storePro-productDetail',
  template: `
          
              <view-body-comp [headerArr]="['项目列表','查看项目']">
                <div style="max-width: 100%">
                  <zm-table-detail>
                    <tbody>
                    <tr >
                      <th style="width:200px;">项目名称</th>
                      <td >{{viewData.productDetail.name}}</td>
                    </tr>
                    <tr>
                      <th>项目编号</th>
                      <td>{{viewData.productDetail.number}}</td>
                    </tr>
                    <tr>
                      <th>项目分类</th>
                      <td>{{viewData.productDetail.typeId | productTypePipe:viewData.productTypeMap}}</td>
                    </tr>
                    <tr>
                      <th>售价</th>
                      <td><i class="fa fa-yen mr-1"></i>{{viewData.productDetail.price |number:'1.2-2'}}</td>
                    </tr>
                    <tr>
                      <th>成本</th>
                      <td><i class="fa fa-yen mr-1"></i>{{viewData.productDetail.cost|number:'1.2-2'}}</td>
                    </tr>
                    <tr>
                      <th>状态</th>
                      <td>{{viewData.productDetail.state | productStatePipe}}</td>
                    </tr>
                    <tr>
                      <th>是否促销</th>
                      <td>{{viewData.productDetail.promotionFlag==0?'否':'是'}}</td>
                    </tr>
                    <tr *ngIf="viewData.productDetail.promotionFlag == 1">
                      <th>促销价格</th>
                      <td><i class="fa fa-yen mr-1"></i>{{viewData.productDetail.promotionPrice|number:'1.2-2'}}</td>
                    </tr>
                    <tr>
                      <th>项目介绍</th>
                      <td >{{viewData.productDetail.descript?viewData.productDetail.descript:"-"}} </td>
                    </tr>
                    <tr>
                      <th>项目图片</th>
                      <td>
                        <ul style="max-width:600px;">
                          <div *ngIf="viewData.productDetail.imgPathList!=null" fxLayout="row wrap"   fxLayoutAlign="start center">
                              <li style="width:100px;height:100px;margin:0 10px 10px 0;" *ngFor="let item of viewData.productDetail.imgPathList">
                                <img class="w-100 h-100" src="{{item | imgPrePath}}" alt="Avatar" >
                              </li>
                          </div>
                          <li style="width:100px;height:100px;margin:5px 5px 0 0;" *ngIf="viewData.productDetail.imgPathList==null && viewData.productDetail.defaultImg">
                            <img class="w-100 h-100" src="{{viewData.productDetail.defaultImg |imgPrePath}} " alt="">
                          </li>
                          <li style="width:100px;height:100px;margin:5px 5px 0 0;" *ngIf="viewData.productDetail.imgPathList==null && !viewData.productDetail.defaultImg">
                            <img class="w-100 h-100" src="{{viewData.defaultImg |imgPrePath}} " alt="">
                          </li>
                    </ul>
                  </td>
                </tr>
               </tbody>
             </zm-table-detail>
          </div>
          <div class="mt-5" style="max-width:100%;margin-top: 20px;" fxLayout="row" fxLayoutAlign="end">
                  
            <zm-btn-large *ngIf="viewData.productDetail.origin == 0 && viewData.productDetail.state==2" name="编辑" (zmbtnClick)="goEditPage(viewData.productDetail.id)"></zm-btn-large>
          </div>
    </view-body-comp>
            
`,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProductInfoDetailPage implements OnInit,OnDestroy {
  private viewDataSub: any;
  private paramsSub: any;
  private service: ProductInfoDetailService;
  public viewData: ProductInfoDetailViewData;

  constructor(private storeProductInfoSynDataHolder: StoreProductInfoSynDataHolder,
              private storeProductInfoViewDataMgr: StoreProductInfoViewDataMgr,
              private productDetailCacheDataHolder: ProductDetailCacheDataHolder,
              private cdRef: ChangeDetectorRef,
              public route: ActivatedRoute) {
    this.service = new ProductInfoDetailService(
      this.storeProductInfoSynDataHolder,
      this.storeProductInfoViewDataMgr,
      this.productDetailCacheDataHolder);
  }

  ngOnInit() {
    this.viewDataSub = this.storeProductInfoViewDataMgr.subscribeProductInfoDetailVD((viewDataP: ProductInfoDetailViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.paramsSub = this.route.params.subscribe(params => {
      let productDetailId = params['productDetailId'];
      console.log("productDetailId  " + productDetailId);
      this.service.initViewData(productDetailId);
    });

  }

  ngOnDestroy() {
    if (!AppUtils.isNullObj(this.viewDataSub)) {
      this.viewDataSub.unsubscribe();
    }
    if (!AppUtils.isNullObj(this.paramsSub)) {
      this.paramsSub.unsubscribe();
    }
  }

  goEditPage(productDetailId) {
    AppRouter.goEditProductInfo(productDetailId);
  }
}


export class ProductInfoDetailViewData {
  productDetail: ProductDetail = new ProductDetail();
  productTypeMap: ZmMap<ProductType>;
  defaultImg: string = Constants.PRODUCT_DEFAULT_IMG;
}


class ProductInfoDetailService {

  constructor(private storeProductInfoSynDataHolder: StoreProductInfoSynDataHolder,
              private storeProductInfoViewDataMgr: StoreProductInfoViewDataMgr,
              private productDetailCacheDataHolder: ProductDetailCacheDataHolder) {
  }

  public initViewData(productDetailId: number): void {
    this.storeProductInfoViewDataMgr.setProductInfoDetailViewData(new ProductInfoDetailViewData());
    this.buildViewData(productDetailId).then((viewDataTmp: ProductInfoDetailViewData) => {
      this.handleViewData(viewDataTmp);
    }).catch(error => {
      AppUtils.handleError(error);
    });

  }

  public handleViewData(viewDataP: ProductInfoDetailViewData) {
    this.storeProductInfoViewDataMgr.setProductInfoDetailViewData(viewDataP);
  }


  /**
   * 组装viewData
   * @param storeId:string
   * @param prdId:number
   * @returns Promise<StorePrdInfoDetailViewData>
   */
  public async buildViewData(productDetailId: number): Promise<ProductInfoDetailViewData> {

    let storeId = SessionUtil.getInstance().getStoreId();
    let viewDataTmp: ProductInfoDetailViewData = new ProductInfoDetailViewData();

    let storePrd: StoreProductInfo = await this.storeProductInfoSynDataHolder.getData(storeId);
    let targetPrd: ProductDetail = await this.productDetailCacheDataHolder.getData(productDetailId.toString());
    if (!AppUtils.isNullObj(targetPrd)) {
      viewDataTmp.productDetail = targetPrd;
    }
    if (storePrd) {
      viewDataTmp.productTypeMap = storePrd.getAllProductTypeMap();
    }
    return new Promise<ProductInfoDetailViewData>(resolve => {
      resolve(viewDataTmp);
    });
  }


}
