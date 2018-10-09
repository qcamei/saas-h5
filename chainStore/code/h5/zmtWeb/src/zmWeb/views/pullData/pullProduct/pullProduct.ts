import {Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {ChainDataSynMgr} from "../../../bsModule/chainDataSyn/ChainDataSynMgr";
import {ChainProductMgr} from "../../../bsModule/chainProduct/ChainProductMgr";
import {PullDataViewDataMgr} from "../pullViewDataMgr";
import {ChainDataQueryForm} from "../../../bsModule/chainDataSyn/apiData/ChainDataQueryForm";
import {PageResp} from "../../../comModule/PageResp";
import {ProductSyn} from "../../../bsModule/chainDataSyn/data/ProductSyn";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {ChainProduct} from "../../../bsModule/chainProduct/data/ChainProduct";
import {ProductType} from "../../../bsModule/chainProduct/data/ProductType";
import {GenericSelect} from "../../../comModule/bean/GenericSelect";
import {ChainDataStatusEnum} from "../../../bsModule/chainDataSyn/data/ChainDataStatusEnum";
import {StoreProductInfoMgr} from "../../../bsModule/StoreProductInfo/StoreProductInfoMgr";
import {ProductPullForm} from "../../../bsModule/StoreProductInfo/apiData/ProductPullForm";
import {ProductBatchPullForm} from "../../../bsModule/StoreProductInfo/apiData/ProductBatchPullForm";
import {ProductCancelForm} from "../../../bsModule/StoreProductInfo/apiData/ProductCancelForm";
import {ProductBatchCancelForm} from "../../../bsModule/StoreProductInfo/apiData/ProductBatchCancelForm";
import {AppRouter} from "../../../comModule/AppRouter";

/**
 * 总部数据获取 项目获取
 */
@Component({
  selector: 'pull-product',
  templateUrl: 'pullProduct.html',
  changeDetection:ChangeDetectionStrategy.OnPush,
})
export class PullProductPage implements OnInit {

  private viewDataSub: any;
  private service: PullProductService;
  public viewData: PullProductViewData;

  constructor(private chainDataSynMgr:ChainDataSynMgr,
              private chainProductMgr:ChainProductMgr,
              private storeProductInfoMgr:StoreProductInfoMgr,
              private pullDataViewDataMgr:PullDataViewDataMgr,
              private cdRef: ChangeDetectorRef){
    this.service = new PullProductService(this.chainDataSynMgr,
      this.chainProductMgr,
      this.storeProductInfoMgr,
      this.pullDataViewDataMgr);
  }

  ngOnInit(): void {
    this.viewDataSub = this.pullDataViewDataMgr.subscribePullProductVD((viewDataP:PullProductViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    })
    this.service.initViewData();
  }

  ngOnDestroy(): void {
    if(!AppUtils.isNullObj(this.viewDataSub)){
      this.viewDataSub.unsubscribe();
    }
  }

  /**
   * 全选/反选
   * @param isSelected
   */
  checkAll(isSelected:boolean){
    if(isSelected){
      this.viewData.list.forEach((item:GenericSelect<ProductSyn>)=>{
        if(item.target.synStatus == ChainDataStatusEnum.NOT_HAVE){
          item.isSelected = true;
        }
      })
    }else{
      this.viewData.list.forEach((item:GenericSelect<ProductSyn>)=>{
        item.isSelected = false;
      })
    }
  }

  /**
   * 获取
   * @param id
   */
  pullData(id:string){
    this.service.pullData(id).then((success:boolean)=>{
      if(success){
        AppUtils.showSuccess("提示","获取成功");
        this.getPageData(1);
      }else{
        AppUtils.showError("提示","获取失败");
      }
    })
  }

  /**
   * 批量获取
   */
  batchPullData(){
    let idArr = [];
    this.viewData.list.forEach((item:GenericSelect<ProductSyn>)=>{
      if(item.isSelected){
        idArr.push(item.target.id);
      }
    });
    if(idArr.length > 0){
      this.service.batchPullData(idArr).then((success:boolean)=>{
        if(success){
          AppUtils.showSuccess("提示","获取成功");
          this.getPageData(1);
        }else{
          AppUtils.showError("提示","获取失败");
        }
      })
    }else{
      AppUtils.showWarn("提示","请选择获取项");
    }
  }

  /**
   * 取消获取
   * @param id
   */
  cancelData(id){
    this.service.cancelData(id).then((success:boolean)=>{
      if(success){
        AppUtils.showSuccess("提示","取消获取成功");
        this.getPageData(1);
      }else{
        AppUtils.showError("提示","取消获取失败");
      }
    })
  }

  /**
   * 批量取消获取
   */
  batchCancelData(){
    let idArr = [];
    this.viewData.list.forEach((item:GenericSelect<ProductSyn>)=>{
      if(item.isSelected){
        idArr.push(item.target.id);
      }
    });
    if(idArr.length > 0){
      this.service.batchCancelData(idArr).then((success:boolean)=>{
        if(success){
          AppUtils.showSuccess("提示","取消获取成功");
          this.getPageData(1);
        }else{
          AppUtils.showError("提示","取消获取失败");
        }
      })
    }else{
      AppUtils.showWarn("提示","请选择取消项");
    }
  }

  /**
   * 跳转详情
   * @param id
   */
  goDetail(id){
    AppRouter.goProductDetail(id);
  }

  /**
   * 分页过滤数据
   */
  getPageData(curPage){
    if(!AppUtils.isNullObj(this.viewData.chainDataQueryForm.numberOrName)){
      this.viewData.chainDataQueryForm.numberOrName = AppUtils.isNullOrWhiteSpace(this.viewData.chainDataQueryForm.numberOrName)?'':AppUtils.trimBlank(this.viewData.chainDataQueryForm.numberOrName);
    }
    this.service.getPageData(curPage,this.viewData);
  }

}

export class PullProductService{
  constructor(private chainDataSynMgr:ChainDataSynMgr,
              private chainProductMgr:ChainProductMgr,
              private storeProductInfoMgr:StoreProductInfoMgr,
              private pullDataViewDataMgr:PullDataViewDataMgr,){}

  public initViewData():void{
    let viewDataTmp = new PullProductViewData();
    this.pullDataViewDataMgr.setPullProductViewData(viewDataTmp);

    this.buildViewData();
  }

  public async buildViewData(){
    let viewDataTmp = new PullProductViewData();

    let chainId = SessionUtil.getInstance().getChainId();
    if(!AppUtils.isNullObj(chainId)){
      let chainProduct:ChainProduct = await this.chainProductMgr.get(chainId);
      if(!AppUtils.isNullObj(chainProduct)){
        let typeMap = ZmMap.fromMap(ProductType,"id",chainProduct.productTypeMap);
        viewDataTmp.typeList = typeMap.values();
      }

      viewDataTmp.chainDataQueryForm.chainId = chainId;
      let storeId = SessionUtil.getInstance().getStoreId();
      viewDataTmp.chainDataQueryForm.storeId = storeId;
      let pageResp: PageResp = await this.chainDataSynMgr.findChainProduct(viewDataTmp.chainDataQueryForm);
      if(!AppUtils.isNullObj(pageResp)){
        viewDataTmp.curPage = 1;
        viewDataTmp.recordCount = pageResp.totalCount;
        viewDataTmp.list = GenericSelect.fromList(pageResp.list);
      }
    }

    viewDataTmp.loadingFinish = true;
    this.pullDataViewDataMgr.setPullProductViewData(viewDataTmp);
  }

  /**
   * 获取分页数据
   * @param curPage
   * @param viewData
   * @returns {Promise<void>}
   */
  public async getPageData(curPage, viewDataTmp: PullProductViewData) {
    viewDataTmp.loadingFinish = false;
    viewDataTmp.allChecked = false;
    viewDataTmp.recordCount = 0;
    viewDataTmp.list = [];

    let pageResp: PageResp = await this.chainDataSynMgr.findChainProduct(viewDataTmp.chainDataQueryForm);
    viewDataTmp.curPage = curPage;
    viewDataTmp.recordCount = pageResp.totalCount;
    viewDataTmp.list = GenericSelect.fromList(pageResp.list);

    viewDataTmp.loadingFinish = true;
    this.pullDataViewDataMgr.setPullProductViewData(viewDataTmp);
  }

  /**
   * 获取
   * @param id
   * @returns {Promise<boolean>}
   */
  public pullData(id:string):Promise<boolean>{
    let storeId = SessionUtil.getInstance().getStoreId();
    let chainId = SessionUtil.getInstance().getChainId();
    let productPullForm = new ProductPullForm();
    productPullForm.chainId = chainId;
    productPullForm.id = id;
    return this.storeProductInfoMgr.pullProductFromChain(storeId,productPullForm);
  }

  /**
   * 批量获取
   * @param idArr
   * @returns {Promise<boolean>}
   */
  batchPullData(idArr:Array<string>):Promise<boolean>{
    let storeId = SessionUtil.getInstance().getStoreId();
    let chainId = SessionUtil.getInstance().getChainId();
    let productBatchPullForm = new ProductBatchPullForm();
    productBatchPullForm.pullForms = idArr.map((id:string)=>{
      let productPullForm = new ProductPullForm();
      productPullForm.chainId = chainId;
      productPullForm.id = id;
      return productPullForm;
    })
    return this.storeProductInfoMgr.batchPullProductFromChain(storeId,productBatchPullForm);
  }

  /**
   * 取消获取
   * @param id
   * @returns {Promise<boolean>}
   */
  cancelData(id:string):Promise<boolean>{
    let storeId = SessionUtil.getInstance().getStoreId();
    let chainId = SessionUtil.getInstance().getChainId();
    let productCancelForm = new ProductCancelForm();
    productCancelForm.chainId = chainId;
    productCancelForm.id = id;
    return this.storeProductInfoMgr.cancelChainProduct(storeId,productCancelForm);
  }

  /**
   * 批量取消获取
   * @param idArr
   * @returns {Promise<boolean>}
   */
  batchCancelData(idArr:Array<string>):Promise<boolean>{
    let storeId = SessionUtil.getInstance().getStoreId();
    let chainId = SessionUtil.getInstance().getChainId();
    let productBatchCancelForm = new ProductBatchCancelForm();
    productBatchCancelForm.cancelForms = idArr.map((id:string)=>{
      let productCancelForm = new ProductCancelForm();
      productCancelForm.chainId = chainId;
      productCancelForm.id = id;
      return productCancelForm;
    })
    return this.storeProductInfoMgr.batchCancelChainProduct(storeId,productBatchCancelForm);
  }

}

export class PullProductViewData{
  public chainDataQueryForm:ChainDataQueryForm = new ChainDataQueryForm();
  public list:Array<GenericSelect<ProductSyn>> = new Array<GenericSelect<ProductSyn>>();
  public typeList: Array<ProductType> = new Array<ProductType>();
  public allChecked:boolean = false;

  public curPage: number;//当前页码
  public recordCount: number;//总记录数
  public loadingFinish: boolean = false;
}

