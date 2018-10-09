import {Component, ChangeDetectionStrategy, OnInit, OnDestroy, ChangeDetectorRef} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {AppUtils, ZmMap} from "../../../../comModule/AppUtils";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {Constants} from "../../../common/Util/Constants";
import {PullDataViewDataMgr} from "../../pullViewDataMgr";
import {ChainPackageProjectMgr} from "../../../../bsModule/chainPackageProject/ChainPackageProjectMgr";
import {PackageProjectDetail} from "../../../../bsModule/chainPackageProject/data/PackageProjectDetail";
import {ChainPackageProject} from "../../../../bsModule/chainPackageProject/data/ChainPackageProject";
import {PackageProjectType} from "../../../../bsModule/chainPackageProject/data/PackageProjectType";
import {ChainProductMgr} from "../../../../bsModule/chainProduct/ChainProductMgr";
import {ChainGoodsMgr} from "../../../../bsModule/chainGoods/ChainGoodsMgr";
import {ChainProduct} from "../../../../bsModule/chainProduct/data/ChainProduct";
import {ProductType} from "../../../../bsModule/chainProduct/data/ProductType";
import {Product} from "../../../../bsModule/chainProduct/data/Product";
import {ChainGoods} from "../../../../bsModule/chainGoods/data/ChainGoods";
import {GoodsType} from "../../../../bsModule/chainGoods/data/GoodsType";
import {Goods} from "../../../../bsModule/chainGoods/data/Goods";
import {PackageItemEnum} from "../../../../bsModule/chainPackageProject/data/PackageItemEnum";


@Component({
  selector: 'chain-product-detail',
  templateUrl: 'chainPackageDetail.html',
  styles:[``],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChainPackageDetailPage implements OnInit,OnDestroy {
  private viewDataSub: any;
  private paramsSub: any;
  private service: ChainPackageDetailService;
  public viewData: ChainPackageDetailViewData;

  constructor(private chainPackageProjectMgr: ChainPackageProjectMgr,
              private chainProductMgr: ChainProductMgr,
              private chainGoodsMgr: ChainGoodsMgr,
              private pullDataViewDataMgr:PullDataViewDataMgr,
              private cdRef: ChangeDetectorRef,
              public route: ActivatedRoute) {
    this.service = new ChainPackageDetailService(
      this.chainPackageProjectMgr,
      this.chainProductMgr,
      this.chainGoodsMgr,
      this.pullDataViewDataMgr);
  }

  ngOnInit() {
    this.viewDataSub = this.pullDataViewDataMgr.subscribePackageDetailVD((viewDataP: ChainPackageDetailViewData) => {
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

class ChainPackageDetailService {
  constructor(private chainPackageProjectMgr: ChainPackageProjectMgr,
              private chainProductMgr: ChainProductMgr,
              private chainGoodsMgr: ChainGoodsMgr,
              private pullDataViewDataMgr:PullDataViewDataMgr,) {}

  public initViewData(id:string): void {
    this.pullDataViewDataMgr.setPackageDetailViewData(new ChainPackageDetailViewData());
    this.buildViewData(id);

  }

  public async buildViewData(id: string) {
    let viewDataTmp = new ChainPackageDetailViewData();

    let chainId = SessionUtil.getInstance().getChainId();
    let chainProduct: ChainProduct = await this.chainProductMgr.get(chainId);
    if(chainProduct){
      viewDataTmp.productTypeMap = ZmMap.fromMap(ProductType,"id",chainProduct.productTypeMap);
      viewDataTmp.productInfoMap = ZmMap.fromMap(Product,"id",chainProduct.productInfoMap);
    }
    let chainGoods:ChainGoods = await this.chainGoodsMgr.get(chainId);
    if(chainGoods){
      viewDataTmp.goodsTypeMap = ZmMap.fromMap(GoodsType,"id",chainGoods.goodsTypeMap);
      viewDataTmp.goodsMap = ZmMap.fromMap(Goods,"id",chainGoods.goodsMap);
    }

    let chainPackageProject: ChainPackageProject = await this.chainPackageProjectMgr.get(chainId);
    if(chainPackageProject){
      viewDataTmp.packageTypeMap = ZmMap.fromMap(PackageProjectType,"id",chainPackageProject.packageProjectTypeMap);
    }

    let target: PackageProjectDetail = await this.chainPackageProjectMgr.findPackageProjectDetail(id,chainId);
    if (!AppUtils.isNullObj(target)) {
      viewDataTmp.packageDetail = target;
      viewDataTmp.packageContentList = this.buildPackageContentList(target,viewDataTmp);
    }

    this.pullDataViewDataMgr.setPackageDetailViewData(viewDataTmp);
  }

  private buildPackageContentList(target: PackageProjectDetail,viewDataTmp: ChainPackageDetailViewData){
    let packageContentList:Array<PackageContentData> = new Array<PackageContentData>();
    if(target.packageItems){
      for(let item of target.packageItems){
        let packageContentData = new PackageContentData();
        packageContentData.id = item.pgId;
        packageContentData.count = item.count;
        packageContentData.discountPrice = item.discountPrice;
        packageContentData.itemType = item.itemType;
        if(item.itemType == PackageItemEnum.PRODUCT){
          let product= viewDataTmp.productInfoMap.get(item.pgId.toString());
          if(product){
            packageContentData.name = product.name;
            packageContentData.number = product.number;
            packageContentData.price = product.sellPrice;
          }
        }else if(item.itemType == PackageItemEnum.GOODS){
          let goods:Goods = viewDataTmp.goodsMap.get(item.pgId.toString());
          if(goods){
            packageContentData.name = goods.name;
            packageContentData.number = goods.number;
            packageContentData.price = goods.sellPrice;
          }
        }
        packageContentList.push(packageContentData);
      }
    }
    return packageContentList;
  }

}

export class ChainPackageDetailViewData {
  packageDetail: PackageProjectDetail = new PackageProjectDetail();
  packageContentList:Array<PackageContentData> = new Array<PackageContentData>();

  packageTypeMap:ZmMap<PackageProjectType> = new ZmMap<PackageProjectType>();

  productTypeMap:ZmMap<ProductType> = new ZmMap<ProductType>();
  productInfoMap:ZmMap<Product> = new ZmMap<Product>();

  goodsTypeMap:ZmMap<GoodsType>;
  goodsMap:ZmMap<Goods>;
}

export class PackageContentData{
  id:string;
  itemType:number;
  name:string;
  number:string;
  price:number;
  count:number;
  discountPrice:number;
}
