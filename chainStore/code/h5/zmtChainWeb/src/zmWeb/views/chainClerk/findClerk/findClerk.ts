import {Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy} from "@angular/core";
import {AppUtils} from "../../../comModule/AppUtils";
import {AppRouter} from "../../../comModule/AppRouter";
import {ChainClerkMgr} from "../../../bsModule/chainClerk/ChainClerkMgr";
import {ChainClerkSynDataHolder} from "../../../bsModule/chainClerk/ChainClerkSynDataHolder";
import {ChainClerkViewDataMgr} from "../ChainClerkViewDataMgr";
import {AddClerkComp} from "../Comp/addClerk/addClerk";
import {StoreListComp} from "../../productionLibrary/Comp/storeListComp/StoreListComp";
import {StoreMgr} from "../../../bsModule/store/storeMgr";
import {Popup} from "../../common/popup/popup";
import {ChainUserMgr} from "../../../bsModule/chainUser/ChainUserMgr";
import {StoreVD} from "../../chainPackageProject/packageProject/addPackage/addPackage";
import {ChainAllotStoreForm} from "../../../bsModule/chainClerk/apiData/ChainAllotStoreForm";
import {ChainClerkData, FindClerkViewData} from "./findClerkViewData";
import {FindClerkService} from "./findClerkService";
import {EditClerkComp} from "../Comp/editClerk/editClerk";
import {ZmModalMgr} from "../../zmComp/modal/ZmModalMgr";
import {MatDialog} from "@angular/material";

/**
 * 店员管理 查找店员 对应员工列表
 */
@Component({
  selector: 'find-clerk',
  templateUrl: 'findClerk.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class FindClerkPage implements OnInit,OnDestroy {

  private viewDataSub: any;
  private service: FindClerkService;
  public viewData: FindClerkViewData;
  private chainAllotStoreForms = new Array<ChainAllotStoreForm>();//批量操作


  constructor(private chainUserMgr: ChainUserMgr,
              private chainClerkMgr: ChainClerkMgr,
              private chainClerkSynDataHolder: ChainClerkSynDataHolder,
              private chainClerkViewDataMgr: ChainClerkViewDataMgr,
              private storeMgr: StoreMgr,
              private cdRef: ChangeDetectorRef,
              private matDialog: MatDialog) {
    ZmModalMgr.getInstance().reset(matDialog);

    this.service = new FindClerkService(
      this.chainUserMgr,
      this.chainClerkMgr,
      this.chainClerkSynDataHolder,
      this.chainClerkViewDataMgr,
      this.storeMgr);
  }

  ngOnInit(): void {
    this.viewDataSub = this.chainClerkViewDataMgr.subscribeFindClerkVD((viewDataP: FindClerkViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.service.initViewData();
  }

  ngOnDestroy(): void {
    if (!AppUtils.isNullObj(this.viewDataSub)) {
      this.viewDataSub.unsubscribe();
    }
  }


  /**
   * 条件过滤列表
   */
  public getChainClerkList() {
    if (!AppUtils.isNullObj(this.viewData.queryForm.phoneOrName)) {
      this.viewData.queryForm.phoneOrName = AppUtils.trimBlank(this.viewData.queryForm.phoneOrName);
    }
    this.service.getPageData(1, this.viewData);
  }

  /**
   * 分页过滤数据
   */
  getChainClerkPageData(curPage) {
    this.viewData.chainCurPage = curPage;
    this.service.getPageData(curPage, this.viewData);
  }

  /**
   * 添加员工
   */
  public addChainClerk() {
    let tmp = this;
    let callBack = () => {
      tmp.service.initViewData();//回调刷新列表
    };
    ZmModalMgr.getInstance().newSmallModal(AddClerkComp,null,callBack);
  }

  public editChainClerk(clerkId:number){
    let modalData = {clerkId:clerkId};
    let tmp = this;
    let callBack = () => {
      tmp.service.initViewData();//回调刷新列表
    };
    ZmModalMgr.getInstance().newSmallModal(EditClerkComp,modalData,callBack);
  }

  /**
   * 岗位设置
   */
  public allotRole(clerkId: number) {
    AppRouter.goAllocationRole(clerkId);
  }

  /**
   * 门店分配
   */
  public allotStores(item:ChainClerkData) {
    this.viewData.storeList.forEach((item)=>{item.checked = false;});
    let ids = item.applyStoreIds;
    if(ids){
      for(let id of ids){
        this.viewData.storeList.forEach((item)=>{if(item.id == id){item.checked = true;}});
      }
    }

    let modalData = {storeList:this.viewData.storeList};
    let tmp = this;
    let callBack = (storeList:Array<StoreVD>) => {
      tmp.getSelectedStore(item,storeList);//回调刷新列表
    };
    ZmModalMgr.getInstance().newModal(StoreListComp,modalData,callBack);
  }

  private getSelectedStore(item:ChainClerkData,storeList:Array<StoreVD>){
    if(storeList && storeList.length>0){
      this.viewData.selectStoreList = storeList;
      this.viewData.selectStoreIds = storeList.map((item)=>{
        return item.id;
      });
    }
    this.service.allotStore(item.id,this.viewData.selectStoreIds).then((success)=>{
      if(success){
        AppUtils.showSuccess("提示","分配成功");
        this.viewData.chainCurPage = 1;
        this.service.initViewData();
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
    this.buildChainAllotStoreForms();
    if(this.chainAllotStoreForms.length==0){
      AppUtils.showWarn("提示","请至少选择一条记录");
      return;
    }

    let modalData = {storeList:this.viewData.storeList};
    let tmp = this;
    let callBack = (storeList:Array<StoreVD>) => {
      tmp.getSelectedStores(storeList);//回调刷新列表
    };
    ZmModalMgr.getInstance().newModal(StoreListComp,modalData,callBack);
  }

  private buildChainAllotStoreForms() {
    for (let item of this.viewData.chainClerkListShow) {
      if (item.checked == true) {
        let chainAllotStoreForm = new ChainAllotStoreForm();
        chainAllotStoreForm.userId = item.id;
        chainAllotStoreForm.storeIds = item.applyStoreIds;
        this.chainAllotStoreForms.push(chainAllotStoreForm);
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
    this.chainAllotStoreForms.forEach((item)=>{
      item.storeIds = item.storeIds.concat(this.viewData.selectStoreIds);
    });

    this.service.batchAllotStore(this.chainAllotStoreForms).then((success)=>{
      if(success){
        AppUtils.showSuccess("提示","批量分配成功");
        this.viewData.chainCurPage = 1;
        this.service.initViewData();
      }else{
        AppUtils.showError("提示","批量分配失败");
      }
    });
  }


  public deleteChainClerk(item: ChainClerkData) {
    Popup.getInstance().open("删除员工", "确定删除#" + item.name + "#?", () => {
      this.service.deleteChainClerk(item.id).then((success) => {
        if (success) {
          if (success) {
            AppUtils.showSuccess("提示", "删除成功");
            this.service.initViewData();
          } else {
            AppUtils.showError("提示", "删除失败");
          }
        }
      });
    });
  }

}



