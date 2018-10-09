import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef,} from '@angular/core';
import {AppRouter} from "../../../comModule/AppRouter";
import {StoreListComp} from "../Comp/storeListComp/StoreListComp";
import {ProductLibraryViewDataMgr} from "../productLibraryViewDataMgr";
import {AppUtils} from "../../../comModule/AppUtils";
import {SellProductMgr} from "../../../bsModule/sellProduct/sellProductMgr";
import {SellProduct} from "../../../bsModule/sellProduct/data/SellProduct";
import {SellProductTypeEnum} from "../../../bsModule/sellProduct/data/SellProductTypeEnum";
import {LibraryListViewData} from "./libraryListViewData";
import {LibraryListService} from "./libraryListService";
import {Constants} from "../../common/Util/Constants";
import {StoreMgr} from "../../../bsModule/store/storeMgr";
import {PromptMsg} from "../../common/Util/PromptMsg";
import {StateEnum} from "../../../comModule/enum/StateEnum";
import {Popup} from "../../common/popup/popup";
import {SellAllotId} from "../../../bsModule/sellProduct/apiData/SellAllotId";
import {SellProductAllotForm} from "../../../bsModule/sellProduct/apiData/SellProductAllotForm";
import {StoreVD} from "../../chainPackageProject/packageProject/addPackage/addPackage";
import {SellProductUpdateStateForm} from "../../../bsModule/sellProduct/apiData/SellProductUpdateStateForm";
import {MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../zmComp/modal/ZmModalMgr";
import {NewTypeEnum} from "../../../comModule/enum/NewTypeEnum";
import {BatchOperateEnum} from "../../../comModule/enum/BatchOperateEnum";


@Component({
  selector: 'libraryList',
  templateUrl: 'libraryList.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LibraryListPage implements OnInit {

  private service: LibraryListService;
  public viewData: LibraryListViewData;
  private viewDataSub: any;
  private productAllotForms = new Array<SellProductAllotForm>();//批量操作
  private sellProductUpdateStateForms = new Array<SellProductUpdateStateForm>();
  public curPage: number = 1;

  constructor(private sellProductMgr: SellProductMgr,
              private productLibraryViewDataMgr: ProductLibraryViewDataMgr,
              private storeMgr:StoreMgr,
              private cdRef: ChangeDetectorRef,
              private matDialog: MatDialog) {
    ZmModalMgr.getInstance().reset(matDialog);

    this.service = new LibraryListService(
      this.sellProductMgr,
      this.productLibraryViewDataMgr,
      this.storeMgr,
    );
  }

  ngOnInit() {
    this.viewDataSub = this.productLibraryViewDataMgr.subscribeLibraryListViewData((viewDataP: LibraryListViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.service.initViewData(this.curPage);
  }

  ngOnDestroy() {
    if (!AppUtils.isNullObj(this.viewDataSub)) {
      this.viewDataSub.unsubscribe();
    }
  }

  /******************页面跳转事件******************/

  newTypeChange(selected:any) {
    if (selected.value == NewTypeEnum.GOODS) {
      this.goGoodsList();
    } else if (selected.value == NewTypeEnum.PRODUCT) {
      this.goProductList();
    } else if (selected.value == NewTypeEnum.PACKAGE) {
      this.goPackageList();
    } else if (selected.value == NewTypeEnum.PRODUCTCARD) {
      this.goProductCardList();
    }
  }

  public goGoodsList() {
    AppRouter.goChainGoodsList();
  }

  public goProductList() {
    AppRouter.goProductInfoList();
  }

  public goPackageList() {
    AppRouter.goPackageList();
  }

  public goProductCardList() {
    AppRouter.goProductCardList();
  }

  public goProductDetail(item:SellProduct){
    if(item.sellProductType == SellProductTypeEnum.GOODS){
      AppRouter.goFindGoodsDetail(item.id);
    }else if(item.sellProductType == SellProductTypeEnum.PRODUCT){
      AppRouter.goProductInfoDetail(item.id);
    }else if(item.sellProductType == SellProductTypeEnum.PACKAGE){
      AppRouter.goPackageDetail(item.id);
    }else if(item.sellProductType == SellProductTypeEnum.PRDCARD){
      AppRouter.goProductCardDetail(item.id);
    }
  }
  public goEditProductPage(item:SellProduct){
    if(item.sellProductType == SellProductTypeEnum.GOODS){
      AppRouter.goEditGoods(item.id);
    }else if(item.sellProductType == SellProductTypeEnum.PRODUCT){
      AppRouter.goEditProductInfo(item.id);
    }else if(item.sellProductType == SellProductTypeEnum.PACKAGE){
      AppRouter.goEditPackageProject(item.id);
    }else if(item.sellProductType == SellProductTypeEnum.PRDCARD){
      AppRouter.goEditProductCard(item.id);
    }
  }


  /******************列表交互相关事件******************/

  //分页回调
  public getPageData(curPage){
    this.curPage = curPage;
    this.service.getPageData(curPage,this.viewData);
  }


  //查询列表
  public queryList() {
    if (!AppUtils.isNullObj(this.viewData.queryForm.numberOrName)) {
      this.viewData.queryForm.numberOrName = AppUtils.trimBlank(this.viewData.queryForm.numberOrName);
    }
    this.service.getPageData(Constants.DEFAULT_PAGENO, this.viewData);
  }


  /******************列表操作相关事件******************/

  changeState(item:SellProduct,state){

    let content = "";
    state == StateEnum.Open ? content = PromptMsg.ENABLED : content = PromptMsg.DISABLED;
    Popup.getInstance().open(PromptMsg.PROMPT, "确定" + content + "吗？", () => {

      let sellAllotId = new SellAllotId();
      sellAllotId.id = item.id;
      sellAllotId.sellProductType = item.sellProductType;

      this.service.updateSellProductState(sellAllotId,state).then(
        (success) => {
          if (success) {
            AppUtils.showSuccess(PromptMsg.PROMPT, content + "成功");
            this.curPage = Constants.DEFAULT_PAGENO;
            this.service.initViewData(this.curPage);
          }
          else {
            AppUtils.showError(PromptMsg.PROMPT, content + "失败");
          }
        }
      );
    });
  }

  batchChange(selected:any){
    let flag:boolean = false;
    this.viewData.productList.forEach((item)=>{
      if(item.checked == true){flag = true;}
    });
    if(flag == false){
      AppUtils.showWarn("提示","请至少选中一条记录");
      return;
    }

    if(selected.value == BatchOperateEnum.ALLOT){
      this.batchAllotStores();
    }else if(selected.value == BatchOperateEnum.UP){
      this.batchChangeState(0);
    }else if(selected.value == BatchOperateEnum.DOWN){
      this.batchChangeState(1);
    }
  }

  batchChangeState(state:number) {
    let content = "";
    state == StateEnum.Open ? content = PromptMsg.ENABLED : content = PromptMsg.DISABLED;
    this.buildBatchUpdateStateForms(state);

    Popup.getInstance().open(PromptMsg.PROMPT, "确定" + content + "吗？", () => {
      if (this.buildBatchUpdateStateForms.length>0) {
        this.service.batchUpdateSellProductState(this.sellProductUpdateStateForms).then(
          (success) => {
            if (success) {
              AppUtils.showSuccess(PromptMsg.PROMPT, content + "成功");
              this.curPage = 1;
              this.service.initViewData(this.curPage);
            } else {
              AppUtils.showError(PromptMsg.PROMPT, content + "失败");
            }
          }
        );
      } else {
        AppUtils.showWarn(PromptMsg.PROMPT, "请至少选择一条数据");
      }
      });

  }


  private buildBatchUpdateStateForms(state:number) {
    for (let item of this.viewData.productList) {
      if (item.checked == true) {
        let sellProductUpdateStateForm = new SellProductUpdateStateForm();

        let sellAllotId = new SellAllotId();
        sellAllotId.id = item.id;
        sellAllotId.sellProductType = item.sellProductType;

        sellProductUpdateStateForm.sellAllotId = sellAllotId;
        sellProductUpdateStateForm.state = state;
        this.sellProductUpdateStateForms.push(sellProductUpdateStateForm);
      }
    }
  }

  /**
   * 分配
   */
  public allotStores(item:SellProduct) {
    this.viewData.storeList.forEach((item)=>{item.checked = false;});
    let ids = item.applyStoreIds;
    if(ids){
      for(let id of ids){
        this.viewData.storeList.forEach((item)=>{if(item.id == id){item.checked = true;}
        });
      }
    }
    let modalData = {storeList:this.viewData.storeList};
    let tmp = this;
    let callBack = (storeList:Array<StoreVD>) => {
      tmp.getSelectedStore(item,storeList);//回调刷新列表
    };
    ZmModalMgr.getInstance().newModal(StoreListComp,modalData,callBack);
  }

  private getSelectedStore(item:SellProduct,storeList:Array<StoreVD>){
    if(storeList && storeList.length>0){
      this.viewData.selectStoreList = storeList;
      this.viewData.selectStoreIds = storeList.map((item)=>{
        return item.id;
      });
    }

    let sellAllotId = new SellAllotId();
    sellAllotId.id = item.id;
    sellAllotId.sellProductType = item.sellProductType;
    this.service.allotSellProduct(sellAllotId,this.viewData.selectStoreIds).then((success)=>{
      if(success){
        AppUtils.showSuccess("提示","分配成功");
        this.curPage = 1;
        this.service.initViewData(this.curPage);
      }else{
        AppUtils.showError("提示","分配失败");
      }
    });
  }

  /***
   * 批量分配
   */
  public batchAllotStores(){
    this.viewData.storeList.forEach((item)=>{item.checked = false;});
    this.buildSellAllotIdArray();

    let modalData = {storeList:this.viewData.storeList};
    let tmp = this;
    let callBack = (storeList:Array<StoreVD>) => {
      tmp.getSelectedStores(storeList);//回调刷新列表
    };
    ZmModalMgr.getInstance().newModal(StoreListComp,modalData,callBack);
  }

  private buildSellAllotIdArray() {
    for (let item of this.viewData.productList) {
      if (item.checked == true) {
        let sellProductAllotForm = new SellProductAllotForm();

        let sellAllotId = new SellAllotId();
        sellAllotId.id = item.id;
        sellAllotId.sellProductType = item.sellProductType;

        sellProductAllotForm.sellAllotId = sellAllotId;
        sellProductAllotForm.applyStoreIds = item.applyStoreIds;
        this.productAllotForms.push(sellProductAllotForm);
      }
    }
  }

  private getSelectedStores(storeList:Array<StoreVD>){

    if(storeList && storeList.length>0){
      this.viewData.selectStoreList = storeList;
      this.viewData.selectStoreIds = storeList.map((item)=>{
        return item.id;
      });
    }
    //追加分配的店铺
    this.productAllotForms.forEach((item)=>{
      item.applyStoreIds = item.applyStoreIds.concat(this.viewData.selectStoreIds);
    });

    this.service.batchAllotSellProduct(this.productAllotForms).then((success)=>{
      if(success){
        AppUtils.showSuccess("提示","批量分配成功");
        this.curPage = 1;
        this.service.initViewData(this.curPage);
      }else{
        AppUtils.showError("提示","批量分配失败");
      }
    });
  }

}




