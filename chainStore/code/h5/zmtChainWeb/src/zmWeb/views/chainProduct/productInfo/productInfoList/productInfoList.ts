import {Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {AppUtils} from "../../../../comModule/AppUtils";
import {ChainProductViewDataMgr} from "../../chainProductViewDataMgr";
import {AppRouter} from "../../../../comModule/AppRouter";
import {PromptMsg} from "../../../common/Util/PromptMsg";
import {Popup} from "../../../common/popup/popup";
import {ProductInfoListViewData} from "./ProductInfoListViewData";
import {ProductInfoListService} from "./ProductInfoListService";
import {Constants} from "../../../common/Util/Constants";
import {ChainProductMgr} from "../../../../bsModule/chainProduct/chainProductMgr";
import {ChainProductDetailMgr} from "../../../../bsModule/chainProduct/chainProductDetailMgr";
import {ChainProductSynDataHolder} from "../../../../bsModule/chainProduct/chainProductSynDataHolder";
import {ProductDetail} from "../../../../bsModule/chainProduct/data/ProductDetail";
import {RemoveProductInfoData} from "../../../../bsModule/chainProduct/apiData/RemoveProductInfoData";
import {ProductStateEnum} from "../../../../bsModule/chainProduct/data/ProductStateEnum";
import {StoreMgr} from "../../../../bsModule/store/storeMgr";
import {StoreListComp} from "../../../productionLibrary/Comp/storeListComp/StoreListComp";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {StoreVD} from "../../../chainPackageProject/packageProject/addPackage/addPackage";

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


  constructor(private chainProductMgr: ChainProductMgr,
              private chainProductSynDataHolder: ChainProductSynDataHolder,
              private chainProductDetailMgr: ChainProductDetailMgr,
              private chainProductViewDataMgr: ChainProductViewDataMgr,
              private storeMgr: StoreMgr,
              private modalService: NgbModal,
              private cdRef: ChangeDetectorRef,
              public route: ActivatedRoute) {
    this.service = new ProductInfoListService(
      this.chainProductMgr,
      this.chainProductSynDataHolder,
      this.chainProductDetailMgr,
      this.chainProductViewDataMgr,
      this.storeMgr);
  }

  ngOnInit() {
    this.viewDataSub = this.chainProductViewDataMgr.subscribeProductInfoListVD((viewDataP: ProductInfoListViewData) => {
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

  /*******************页面跳转事件********************/

  public goProductInfoDetail(productDetailId) {
    AppRouter.goProductInfoDetail(productDetailId)
  }

  public goAddProductInfo() {
    AppRouter.goAddProductInfo();
  }

  public goEditProductInfo(productId) {
    AppRouter.goEditProductInfo(productId);
  }

  public goAddProductType() {
    AppRouter.goProductType();
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

  /*********************查询*********************/

  public getProductDetailListByReq() {
    if (!AppUtils.isNullObj(this.viewData.queryForm.numberOrName)) {
      this.viewData.queryForm.numberOrName = AppUtils.trimBlank(this.viewData.queryForm.numberOrName);
    }
    this.callbackRefreshData();
  }

  /**
   * 分页回调
   */
  getPageData(curPage) {
    this.viewData.curPage = curPage;
    this.callbackRefreshData();
  }


  /*********************改变状态*************************/

  changeState(productId, state) {

    let title = PromptMsg.PROMPT;
    let content = "";
    state == ProductStateEnum.Open ? content = PromptMsg.ENABLED : content = PromptMsg.DISABLED;
    Popup.getInstance().open(title, "确定" + content + "吗？", () => {
      this.service.updateProductState(productId, state).then(
        (success) => {
          if (success) {
            AppUtils.showSuccess(PromptMsg.PROMPT, content + "成功");
            this.callbackRefreshData();
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
    state == ProductStateEnum.Open ? content = PromptMsg.ENABLED : content = PromptMsg.DISABLED;
    this.buildPrdIdArray();
    if (this.productIdArray.length > 0) {
      this.service.batchUpdateProductState(this.productIdArray, state).then(
        (success) => {
          if (success) {
            this.productIdArray = new Array<string>();
            AppUtils.showSuccess(title, content + "成功");
            this.callbackRefreshData();
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
        this.productIdArray.push(item.id);
      }
    }
  }

  /*********************分配*************************/

  //分配
  public allotStores(productDetail: ProductDetail) {
    this.viewData.storeList.forEach((item) => {
      item.checked = false;
    });
    let ids = productDetail.applyStoreIds;
    if (ids) {
      for (let id of ids) {
        this.viewData.storeList.forEach((item) => {
          if (item.id == id) {
            item.checked = true;
          }
        });
      }
    }
    const activeModal = this.modalService.open(StoreListComp, {size: 'lg', backdrop: 'static'});
    activeModal.componentInstance.storeList = this.viewData.storeList;
    activeModal.componentInstance.callback = this.getSelectedStore.bind(this, productDetail);
  }

  private getSelectedStore(item: ProductDetail, storeList: Array<StoreVD>) {
    if (storeList && storeList.length > 0) {
      this.viewData.selectStoreList = null;
      this.viewData.selectStoreList = storeList;
      this.viewData.selectStoreIds = storeList.map((item) => {
        return item.id;
      });
    }

    this.service.allotStore(item.id, this.viewData.selectStoreIds).then((success) => {
      if (success) {
        AppUtils.showSuccess("提示", "分配成功");
        this.callbackRefreshData();
      } else {
        AppUtils.showError("提示", "分配失败");
      }
    });
  }


  /***********************删除项目*********************/

  public removeProduct(product: ProductDetail) {
    Popup.getInstance().open("删除项目", "确定删除#" + product.name + "#?",
      () => {
        this.confirmRemove(product);
      });

  }

  private confirmRemove(product: ProductDetail) {
    this.deleteProduct(product);
  }

  private deleteProduct(product: ProductDetail) {
    let removeForm: RemoveProductInfoData = new RemoveProductInfoData();
    removeForm.id = product.id;
    this.service.deleteProduct(removeForm).then((success) => {
      if (success) {
        AppUtils.showSuccess(PromptMsg.PROMPT, PromptMsg.DELETE + "成功");
        this.callbackRefreshData();
      } else {
        AppUtils.showError(PromptMsg.PROMPT, PromptMsg.DELETE + "失败");
      }
    });
  }

  private  callbackRefreshData() {
    this.service.getPageData();
  }
}



