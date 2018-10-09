import {Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {AppUtils} from "../../../../comModule/AppUtils";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {StoreProductInfoViewDataMgr} from "../../storeProductViewDataMgr";
import {StoreProductInfoSynDataHolder} from "../../../../bsModule/StoreProductInfo/StoreProductInfoSynDataHolder";
import {StoreProductInfoMgr} from "../../../../bsModule/StoreProductInfo/StoreProductInfoMgr";
import {AppRouter} from "../../../../comModule/AppRouter";
import {PromptMsg} from "../../../common/Util/PromptMsg";
import {RemoveProductInfoData} from "../../../../bsModule/StoreProductInfo/apiData/RemoveProductInfoData";
import {ProductDetailMgr} from "../../../../bsModule/productDetail/ProductDetailMgr";
import {ProductDetail} from "../../../../bsModule/productDetail/data/ProductDetail";
import {Popup} from "../../../common/popup/popup";
import {ProductInfoListViewData} from "./ProductInfoListViewData";
import {ProductInfoListService} from "./ProductInfoListService";
import {ProductInfoState} from "../../../../bsModule/StoreProductInfo/data/ProductInfoState";


@Component({
  selector: 'page-storePro-prdList',
  templateUrl: 'productInfoList.html',
  changeDetection: ChangeDetectionStrategy.OnPush  //变化检测器的策略 CheckOnce ->Checked
})

export class ProductInfoListPage implements OnInit,OnDestroy {

  private service: ProductInfoListService;
  public viewData: ProductInfoListViewData;
  private viewDataSub: any;
  private productIdArray = new Array<string>();//batchChangeState

  constructor(private storeProductInfoMgr: StoreProductInfoMgr,
              private productDetailMgr: ProductDetailMgr,
              private storeProductInfoSynDataHolder: StoreProductInfoSynDataHolder,
              private storeProductInfoViewDataMgr: StoreProductInfoViewDataMgr,
              private cdRef: ChangeDetectorRef,
              public route: ActivatedRoute,
              public router: Router) {

    this.service = new ProductInfoListService(
      this.storeProductInfoMgr,
      this.productDetailMgr,
      this.storeProductInfoSynDataHolder,
      this.storeProductInfoViewDataMgr);
  }

  ngOnInit() {
    this.viewDataSub = this.storeProductInfoViewDataMgr.subscribeProductInfoListVD((viewDataP: ProductInfoListViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.storeProductInfoViewDataMgr.setProductInfoListViewData(ProductInfoListViewData.getInstance());
    this.service.initViewData();
  }

  ngOnDestroy() {
    if (!AppUtils.isNullObj(this.viewDataSub)) {
      this.viewDataSub.unsubscribe();
    }
  }

  /**
   * 是否显示获取总部数据
   * @returns {boolean}
   */
  public getPullDataPerm():boolean{
    return SessionUtil.getInstance().getUserPermData().showSynData;
  }

  /*******************页面跳转事件********************/

  /**
   * 跳转获取总部数据
   */
  public goPullProduct(){
    AppRouter.goPullProduct();
  }

  public goProductInfoDetail(productDetailId) {
    AppRouter.goProductInfoDetail(productDetailId)
  }

  public goAddProductInfo() {
    AppRouter.goAddProductInfo();
  }

  public goEditProductInfo(productId) {
    AppRouter.goEditProductInfo(productId);
  }

  /********************全/反选*************************/

  public selectAll() {
    let listTmp: Array<ProductDetail> = new Array<ProductDetail>();
    let list = this.viewData.productList;
    for (let item of list) {
      let productDetail = new ProductDetail();
      AppUtils.copy(productDetail, item);
      productDetail.checked = this.viewData.isSelectedAll;
      listTmp.push(productDetail);
    }
    this.viewData.productList = listTmp;
  }

  public checkList() {
    let checkList = new Array<boolean>();
    let list = this.viewData.productList;
    for (let item of  list) {
      checkList.push(item.checked);
    }
    if (AppUtils.arrayContains(checkList, false)) {
      this.viewData.isSelectedAll = false;
    } else {
      this.viewData.isSelectedAll = true;
    }
  }

  /***********************删除项目*********************/

  public removeProduct(product: ProductDetail) {
    Popup.getInstance().open("删除项目", "确定删除#" + product.name + "#?",
      () => {
        this.deleteProduct(product);
      });

  }

  private deleteProduct(product: ProductDetail) {
    let removeForm: RemoveProductInfoData = new RemoveProductInfoData();
    removeForm.storeId = SessionUtil.getInstance().getStoreId();
    removeForm.id = product.productId;
    this.service.deleteProduct(removeForm).then((success) => {
      if (success) {
        AppUtils.showSuccess(PromptMsg.PROMPT, PromptMsg.DELETE + "成功");
        this.service.initViewData();
      } else {
        AppUtils.showError(PromptMsg.PROMPT, PromptMsg.DELETE + "失败");
      }
    });
  }


  /*********************查询*********************/

  public getProductDetailListByReq() {
    if (!AppUtils.isNullObj(this.viewData.queryForm.numberOrName)) {
      this.viewData.queryForm.numberOrName = AppUtils.trimBlank(this.viewData.queryForm.numberOrName);
    }
    this.service.initViewData();
  }

  /**
   * 分页回调
   */
  getPageData(curPage) {
    this.viewData.curPage = curPage;
    this.service.initViewData();
  }

  productToTop(productDetail:ProductDetail){
    Popup.getInstance().open("提示", "确定将#"+productDetail.name+"#置顶吗？", () => {
      this.service.updateProductToTop(productDetail.productId).then(
        (success) => {
          if (success) {
            AppUtils.showSuccess(PromptMsg.PROMPT, "置顶成功");
            this.service.initViewData();
          }
          else {
            AppUtils.showError(PromptMsg.PROMPT,"置顶失败");
          }
        }
      );
    });
  }

  productCancelTop(productDetail:ProductDetail){
    Popup.getInstance().open("提示", "确定将#"+productDetail.name+"#取消置顶吗？", () => {
      this.service.updateProductCancelTop(productDetail.productId).then(
        (success) => {
          if (success) {
            AppUtils.showSuccess(PromptMsg.PROMPT, "取消置顶成功");
            this.service.initViewData();
          }
          else {
            AppUtils.showError(PromptMsg.PROMPT,"取消置顶失败");
          }
        }
      );
    });
  }


  /*********************改变状态*************************/

  changeState(productId, state) {
    let title = PromptMsg.PROMPT;
    let content = "";
    state == ProductInfoState.OPEN ? content = PromptMsg.ENABLED : content = PromptMsg.DISABLED;
    Popup.getInstance().open(title, "确定" + content + "吗？", () => {
      this.service.updateProductState(productId, state).then(
        (success) => {
          if (success) {
            AppUtils.showSuccess(PromptMsg.PROMPT, content + "成功");
            this.service.initViewData();
          }
          else {
            AppUtils.showError(PromptMsg.PROMPT, content + "失败");
          }
        }
      );
    });

  }


  batchChangeState(state) {
    let title = PromptMsg.PROMPT;
    let content = "";
    state == ProductInfoState.OPEN ? content = PromptMsg.ENABLED : content = PromptMsg.DISABLED;
    this.buildPrdIdArray();
    if (this.productIdArray.length>0) {
      this.service.batchUpdateProductState(this.productIdArray, state).then(
        (success) => {
          if (success) {
            this.productIdArray = new Array<string>();
            AppUtils.showSuccess(title, content + "成功");
            this.service.initViewData();
          } else {
            AppUtils.showError(title, content + "失败");
          }
        }
      );
    } else {
      AppUtils.showWarn(PromptMsg.PROMPT, "请至少选择一条数据");
    }
  }

  private buildPrdIdArray() {
    for (let item of this.viewData.productList) {
      if (item.checked == true) {
        this.productIdArray.push(item.productId);
      }
    }
  }


}



