import {Component, ChangeDetectionStrategy, OnInit, OnDestroy, ChangeDetectorRef} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {AppUtils, ZmMap} from "../../../../comModule/AppUtils";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {ChainProductViewDataMgr} from "../../chainProductViewDataMgr";
import {AppRouter} from "../../../../comModule/AppRouter";
import {ChainProductSynDataHolder} from "../../../../bsModule/chainProduct/chainProductSynDataHolder";
import {ChainProductDetailCacheSynHolder} from "../../../../bsModule/chainProduct/chainProductDetailCacheSynHolder";
import {ProductDetail} from "../../../../bsModule/chainProduct/data/ProductDetail";
import {ProductType} from "../../../../bsModule/chainProduct/data/ProductType";
import {Constants} from "../../../common/Util/Constants";
import {ChainProduct} from "../../../../bsModule/chainProduct/data/ChainProduct";
import {Store} from "../../../../bsModule/store/data/Store";
import {StoreMgr} from "../../../../bsModule/store/storeMgr";


@Component({
  selector: 'page-storePro-productDetail',
  template: `
          <view-body-comp [headerArr]="['项目列表','查看项目']">
            <div style="max-width: 100%">
                  <zm_table_detail>
                    <tbody>
                    <tr >
                      <th class="bg-th" style="width:200px;">项目名称</th>
                      <td >{{viewData.productDetail.name}}</td>
                    </tr>
                    <tr>
                      <th class="bg-th">项目编号</th>
                      <td>{{viewData.productDetail.number}}</td>
                    </tr>
                    <tr>
                      <th class="bg-th">项目分类</th>
                      <td>{{viewData.productDetail.typeId | productTypePipe:viewData.productTypeMap}}</td>
                    </tr>
                    <tr>
                      <th class="bg-th">售价</th>
                      <td><i class="fa fa-yen mr-1"></i>{{viewData.productDetail.sellPrice |number:'1.2-2'}}</td>
                    </tr>
                    <tr>
                      <th class="bg-th">成本</th>
                      <td><i class="fa fa-yen mr-1"></i>{{viewData.productDetail.cost|number:'1.2-2'}}</td>
                    </tr>
                    <tr>
                      <th class="bg-th">状态</th>
                      <td>{{viewData.productDetail.state | statePipe}}</td>
                    </tr>
                    <tr>
                       <th class="bg-th">适用门店</th>
                       <td>{{viewData.applyStoreName?viewData.applyStoreName:"-"}}</td>
                    </tr>
                    <tr>
                      <th class="bg-th">项目介绍</th>
                      <td >{{viewData.productDetail.descript?viewData.productDetail.descript:"-"}} </td>
                    </tr>
                    <tr>
                    <th class="align-middle bg-th">项目图片</th>
                    <td >
                        <ul class="d-flex flex-wrap justify-content-between">
                          <div *ngIf="viewData.productDetail.imgPathList!=null" fxLayout="row" fxLayoutAlign="start center">
                              <li style="width:150px;height:150px;" *ngFor="let item of viewData.productDetail.imgPathList">
                                <img class="w-100 h-100" src="{{item | imgPrePath}}" alt="Avatar" >
                              </li>
                          </div>
                          <li style="width:150px;height:150px;margin:5px 5px 0 0;" *ngIf="viewData.productDetail.imgPathList==null && viewData.productDetail.defaultImg">
                            <img class="w-100 h-100" src="{{viewData.productDetail.defaultImg |imgPrePath}} " alt="">
                          </li>
                          <li style="width:150px;height:150px;margin:5px 5px 0 0;" *ngIf="viewData.productDetail.imgPathList==null && !viewData.productDetail.defaultImg">
                            <img class="w-100 h-100" src="{{viewData.defaultImg |imgPrePath}} " alt="">
                          </li>
                    </ul>
                  </td>
                </tr>
               </tbody>
             </zm_table_detail>
          </div>
          
            <div class="mt-5" style="max-width:100%;margin-top: 20px;" fxLayout="row" fxLayoutAlign="end">
              <zm_btn_large *ngIf="viewData.productDetail.state==1" name="编辑" (zmbtnClick)="goEditPage(viewData.productDetail.id)"></zm_btn_large>
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

  constructor(private chainProductSynDataHolder: ChainProductSynDataHolder,
              private chainProductViewDataMgr: ChainProductViewDataMgr,
              private chainProductDetailCacheSynHolder: ChainProductDetailCacheSynHolder,
              private storeMgr: StoreMgr,
              private cdRef: ChangeDetectorRef,
              public route: ActivatedRoute) {
    this.service = new ProductInfoDetailService(
      this.chainProductSynDataHolder,
      this.chainProductViewDataMgr,
      this.chainProductDetailCacheSynHolder,
      this.storeMgr);
  }

  ngOnInit() {
    this.viewDataSub = this.chainProductViewDataMgr.subscribeProductInfoDetailVD((viewDataP: ProductInfoDetailViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.paramsSub = this.route.params.subscribe(params => {
      let productDetailId = params['productDetailId'];
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
  applyStoreName: string;
  defaultImg: string = Constants.PRODUCT_DEFAULT_IMG;
}


class ProductInfoDetailService {

  constructor(private chainProductSynDataHolder: ChainProductSynDataHolder,
              private chainProductViewDataMgr: ChainProductViewDataMgr,
              private chainProductDetailCacheSynHolder: ChainProductDetailCacheSynHolder,
              private storeMgr: StoreMgr,) {
  }

  public initViewData(productDetailId: number): void {
    this.chainProductViewDataMgr.setProductInfoDetailViewData(new ProductInfoDetailViewData());
    this.buildViewData(productDetailId).then((viewDataTmp: ProductInfoDetailViewData) => {
      this.handleViewData(viewDataTmp);
    }).catch(error => {
      AppUtils.handleError(error);
    });

  }

  public handleViewData(viewDataP: ProductInfoDetailViewData) {
    this.chainProductViewDataMgr.setProductInfoDetailViewData(viewDataP);
  }


  /**
   * 组装viewData
   * @param chainId:string
   * @param prdId:number
   * @returns Promise<StorePrdInfoDetailViewData>
   */
  public async buildViewData(productDetailId: number): Promise<ProductInfoDetailViewData> {

    let chainId = SessionUtil.getInstance().getChainId();
    let viewDataTmp: ProductInfoDetailViewData = new ProductInfoDetailViewData();

    let chainProduct: ChainProduct = await this.chainProductSynDataHolder.getData(chainId);
    let targetPrd: ProductDetail = await this.chainProductDetailCacheSynHolder.getData(productDetailId.toString());
    if (chainProduct) {
      viewDataTmp.productTypeMap = chainProduct.getAllProductTypeMap();
    }
    if (!AppUtils.isNullObj(targetPrd)) {
      viewDataTmp.productDetail = targetPrd;
      viewDataTmp.applyStoreName = await this.getApplyStoreNames(viewDataTmp.productDetail.applyStoreIds);
    }

    return new Promise<ProductInfoDetailViewData>(resolve => {
      resolve(viewDataTmp);
    });
  }

  private async getApplyStoreNames(applyStoreIds:Array<string>){
    let chainId = SessionUtil.getInstance().getChainId();
    let pageResp = await this.storeMgr.findStoreByCond(chainId);
    let storeList: Array<Store> = new Array<Store>();
    if (pageResp) {
      storeList = pageResp.list;
    }
    let storeListTmp = new Array<Store>();
    if (applyStoreIds) {
      for (let id of applyStoreIds) {
        storeList.forEach((item) => {
          if (item.id == id) {
            storeListTmp.push(item);
          }
        });
      }
    }
    let arr = new Array<string>();
    arr = storeListTmp.map((item) => {
      return item.name;
    });
    return arr.join("、");
  }


}
