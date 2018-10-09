import {Component, ChangeDetectionStrategy, OnInit, OnDestroy, ChangeDetectorRef} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {AppUtils, ZmMap} from "../../../../comModule/AppUtils";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {Constants} from "../../../common/Util/Constants";
import {ChainProductMgr} from "../../../../bsModule/chainProduct/ChainProductMgr";
import {PullDataViewDataMgr} from "../../pullViewDataMgr";
import {ProductDetail} from "../../../../bsModule/chainProduct/data/ProductDetail";
import {ChainProduct} from "../../../../bsModule/chainProduct/data/ChainProduct";
import {ProductType} from "../../../../bsModule/chainProduct/data/ProductType";


@Component({
  selector: 'chain-product-detail',
  template: `
              <view-body-comp [headerArr]="['总店数据','项目','查看详情']">
                <div style="width: 50%">
                  <zm-table-detail>
                    <tbody>
                    <tr >
                      <td class="bg-th" style="width:200px;">项目名称</td>
                      <td >{{viewData.productDetail.name}}</td>
                    </tr>
                    <tr>
                      <td class="bg-th">项目编号</td>
                      <td>{{viewData.productDetail.number}}</td>
                    </tr>
                    <tr>
                      <td class="bg-th">项目分类</td>
                      <td>{{viewData.productTypeName}}</td>
                    </tr>
                    <tr>
                      <td class="bg-th">售价</td>
                      <td><i class="fa fa-yen mr-1"></i>{{viewData.productDetail.sellPrice |number:'1.2-2'}}</td>
                    </tr>
                    <tr>
                      <td class="bg-th">成本</td>
                      <td><i class="fa fa-yen mr-1"></i>{{viewData.productDetail.cost|number:'1.2-2'}}</td>
                    </tr>
                    <tr>
                      <td class="bg-th">状态</td>
                      <td>{{viewData.productDetail.state | productStatePipe}}</td>
                    </tr>
                    <tr>
                      <td class="bg-th">项目介绍</td>
                      <td >{{viewData.productDetail.descript?viewData.productDetail.descript:"-"}} </td>
                    </tr>
                    <tr>
                      <td class="align-middle bg-th">项目图片</td>
                      <td >
                        <ul  fxLayout="row wrap" fxLayoutAlign="start center">
                          <div *ngIf="viewData.productDetail.imgPathList!=null" fxLayout="row wrap" fxLayoutAlign="start center">
                          <li style="width:150px;height:150px;margin:5px 5px 0 0;" *ngFor="let item of viewData.productDetail.imgPathList">
                            <img class="w-100-p h-100-p" src="{{item | imgPrePath}}" alt="Avatar" >
                          </li>
                        </div>
                        <li style="width:150px;height:150px;margin:5px 5px 0 0;" *ngIf="viewData.productDetail.imgPathList==null && viewData.productDetail.defaultImg">
                          <img class="w-100-p h-100-p" src="{{viewData.productDetail.defaultImg |imgPrePath}} " alt="">
                        </li>
                        <li style="width:150px;height:150px;margin:5px 5px 0 0;" *ngIf="viewData.productDetail.imgPathList==null && !viewData.productDetail.defaultImg">
                          <img class="w-100-p h-100-p" src="{{viewData.defaultImg |imgPrePath}} " alt="">
                        </li>
                    </ul>
                  </td>
                </tr>
               </tbody>
             </zm-table-detail>
          </div>
    </view-body-comp>
            
`,
  styles:[``],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChainProductDetailPage implements OnInit,OnDestroy {
  private viewDataSub: any;
  private paramsSub: any;
  private service: ChainProductDetailService;
  public viewData: ChainProductDetailViewData;

  constructor(private chainProductMgr:ChainProductMgr,
              private pullDataViewDataMgr:PullDataViewDataMgr,
              private cdRef: ChangeDetectorRef,
              public route: ActivatedRoute) {
    this.service = new ChainProductDetailService(
      this.chainProductMgr,
      this.pullDataViewDataMgr);
  }

  ngOnInit() {
    this.viewDataSub = this.pullDataViewDataMgr.subscribeProductDetailVD((viewDataP: ChainProductDetailViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.paramsSub = this.route.params.subscribe(params => {
      let id = params['id'];
      this.service.initViewData(id);
    });

  }

  ngOnDestroy() {
    if(!AppUtils.isNullObj(this.viewDataSub)){
      this.viewDataSub.unsubscribe();
    }
    if(!AppUtils.isNullObj(this.paramsSub)){
      this.paramsSub.unsubscribe();
    }
  }

}

class ChainProductDetailService {
  constructor(private chainProductMgr:ChainProductMgr,
              private pullDataViewDataMgr:PullDataViewDataMgr,) {}

  public initViewData(id:string): void {
    this.pullDataViewDataMgr.setProductDetailViewData(new ChainProductDetailViewData());
    this.buildViewData(id);
  }

  public handleViewData(viewDataP: ChainProductDetailViewData) {
    this.pullDataViewDataMgr.setProductDetailViewData(viewDataP);
  }


  /**
   * 组装viewData
   * @param id
   */
  public async buildViewData(id:string) {
    let viewDataTmp = new ChainProductDetailViewData();

    let chainId = SessionUtil.getInstance().getChainId();
    let productDetail:ProductDetail = await this.chainProductMgr.findProductDetail(id,chainId);
    if(!AppUtils.isNullObj(productDetail)){
      viewDataTmp.productDetail = productDetail;
    }
    let chainProduct: ChainProduct = await this.chainProductMgr.get(chainId);
    if(!AppUtils.isNullObj(chainProduct)){
      let productType = ZmMap.fromMap(ProductType,"id",chainProduct.productTypeMap).get(viewDataTmp.productDetail.typeId);
      viewDataTmp.productTypeName = productType.name;
    }
    this.handleViewData(viewDataTmp);
  }

}

export class ChainProductDetailViewData {
  public productDetail: ProductDetail = new ProductDetail();
  public productTypeName :string;
  public defaultImg:string = Constants.PRODUCT_DEFAULT_IMG;
}
