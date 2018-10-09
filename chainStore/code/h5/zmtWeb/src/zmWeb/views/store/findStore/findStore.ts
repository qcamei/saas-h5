import {Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy} from "@angular/core";
import {Store} from "../../../bsModule/store/apiData/Store";
import {StoreMgr} from "../../../bsModule/store/StoreMgr";
import {StoreViewDataMgr} from "../StoreViewDataMgr";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {StoreUpdateStatusData} from "../../../bsModule/store/apiData/StoreUpdateStatusData";
import {StoreState} from "../../../bsModule/store/apiData/StoreState";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {BUser} from "../../../bsModule/buser/apiData/BUser";
import {StoreFindTypeEnum} from "../../../bsModule/store/apiData/StoreFindTypeEnum";
import {AppRouter} from "../../../comModule/AppRouter";
import {StoreSynDataHolder} from "../../../bsModule/store/StoreSynDataHolder";
import {RestResp} from "../../../comModule/RestResp";

import {DeleteStoreModalComp} from "./deleteStoreModalComp";
import {SimpleStore} from "../../../comModule/session/SessionData";
import {MainViewDataMgr} from "../../main/MainViewDataMgr";
import {BUserSynDataHolder} from "../../../bsModule/buser/BUserSynDataHolder";
import {PermService} from "../../permService";
import { ApplyChainComp } from "../applayChain/applyChain";
import {ChainMgr} from "../../../bsModule/chain/ChainMgr";
import {ChainQueryForm} from "../../../bsModule/chain/apiData/ChainQueryForm";
import {PageResp} from "../../../comModule/PageResp";
import {Chain} from "../../../bsModule/chain/data/Chain";
import {MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../zmComp/modal/ZmModalMgr";


/**
 * 店铺管理首页 查找店铺
 */
@Component({
  selector:'find-store',
  templateUrl:'findStore.html',
  styleUrls:['findStore.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FindStorePage implements OnInit,OnDestroy{

  private viewDataSub: any;
  private service: FindStoreService;
  public viewData: FindStoreViewData;

  constructor(
              private storeMgr: StoreMgr,
              private chainMgr:ChainMgr,
              private buserSynDataHolder:BUserSynDataHolder,
              private permService:PermService,
              private storeViewDataMgr: StoreViewDataMgr,
              private cdRef: ChangeDetectorRef,
              matDialog: MatDialog) {

    ZmModalMgr.getInstance().reset(matDialog);

    this.service = new FindStoreService(this.storeMgr,this.chainMgr,this.storeViewDataMgr);
  }

  ngOnInit(): void {
    this.viewDataSub = this.storeViewDataMgr.subscribeFindStoreVD((viewDataP: FindStoreViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.service.initViewData();

  }

  ngOnDestroy(): void {
    if(!AppUtils.isNullObj(this.viewDataSub)){
      this.viewDataSub.unsubscribe();
    }
  }

  /**
   * 获取连锁店名称
   * @param store
   * @returns {any}
   */
  getChainName(store:Store):string{
    if(store && store.chainIds && store.chainIds[0]){
      return this.viewData.chainMap.get(store.chainIds[0].toString())?this.viewData.chainMap.get(store.chainIds[0].toString()).name:"-";
    }else{
      return "未加入";
    }
  }

  /**
   * 加入连锁店
   */
  joinChain(store:Store){
    // const activeModal = this.modalService.open(ApplyChainComp, {backdrop: 'static'});
    const activeModal = ZmModalMgr.getInstance().newModal(ApplyChainComp, null,null);
    activeModal.componentInstance.storeId = store.id;
    activeModal.componentInstance.storeName = store.name;
    activeModal.componentInstance.action = ()=>{
      this.getPageData(1);
    };
  }

  /**
   * 查找店铺点击事件
   */
  findStore() {
    if(!AppUtils.isNullOrWhiteSpace(this.viewData.queryParam)){
      this.viewData.queryParam = AppUtils.trimBlank(this.viewData.queryParam);//去掉空格
    }

    this.viewData.storeListTmp = this.viewData.stores.filter((item) =>{
      if((item.id && item.id.indexOf(this.viewData.queryParam) > -1) || (item.name && item.name.indexOf(this.viewData.queryParam) > -1)){
        return true;
      }else{
        return false;
      }
    })
    this.viewData.page = 1;
    this.viewData.recordCount = this.viewData.storeListTmp.length;
    this.viewData.storeList = AppUtils.getPageData(1,this.viewData.storeListTmp);
  }

  /**
   * 跳转新建店铺 点击事件
   */
  public async goAddStore(){
    let userId = SessionUtil.getInstance().getUserId();
    let buser:BUser = await this.buserSynDataHolder.getData(userId);
    if(buser && buser.roleSet && AppUtils.arrayContains(buser.roleSet,"0")){
      AppRouter.goAddStore();
    }else{
      AppUtils.showWarn("提示","没有权限");
    }
  }

  /**
   * 跳转店铺详情 点击事件
   */
  goStoreDetail(storeId){
    if(AppUtils.isPositiveInteger(storeId)){
      AppRouter.goStoreDetail(storeId);
    }
  }

  /**
   * 跳转编辑店铺 点击事件
   */
  goEditStore(store:Store){
    let buserId = SessionUtil.getInstance().getUserId();

    console.log(store);
    console.log(buserId);
    if(store && store.bossId == buserId && AppUtils.isPositiveInteger(store.id)){
      AppRouter.goEditStore(store.id);
    }else{
      AppUtils.showWarn("提示","没有权限");
    }
  }

  /**
   * 删除店铺 页面点击事件
   */
  // async deleteStore(storeId){
  //   let buserId = SessionUtil.getInstance().getUserId();
  //   let store:Store = await this.chainMgr.getData(storeId);
  //   (<any>window).ZmPopup.Zmopen( "删除店铺","删除店铺后，该店铺数据会进行清除并无法恢复，请输入登录密码确认删除",(password)=>{
  //       if(store && store.bossId == buserId && AppUtils.isPositiveInteger(storeId)){
  //         console.log("delete store===========password"+password);
  //         this.service.deleteStore(storeId,password,(restResp:RestResp)=>{
  //           if(restResp.code == 200){
  //             AppUtils.showSuccess("提示", "删除成功");
  //             this.service.initViewData();
  //             this.mainViewDataMgr.notifyDataChanged();
  //           }else{
  //             AppUtils.showError("提示", restResp.tips);
  //           }
  //         })
  //       }else{
  //         AppUtils.showWarn("提示","没有权限");
  //       }
  //     }
  //    )
  // }


  /**
   * 删除店铺模态框
   * @param storeId
   */
  deleteStore(storeId) {
    // const activeModal = this.modalService.open(DeleteStoreModalComp, {backdrop: 'static'});
    const activeModal = ZmModalMgr.getInstance().newModal(DeleteStoreModalComp, null,null);
    activeModal.componentInstance.storeId = storeId;
    activeModal.componentInstance.action = this.deleteCallback.bind(this,storeId);
  }

  /**
   * 删除成功回调
   */
  async deleteCallback(storeId:string){
    this.storeViewDataMgr.setFindStoreViewData(this.viewData);//吐司
    AppUtils.showSuccess("提示", "删除成功");
    if(storeId == SessionUtil.getInstance().getStoreId()){//删除了当前店铺
      SessionUtil.getInstance().clearData();
      setTimeout(()=>{
        AppRouter.goLogin();
      },500);
    }else{//删除了其他店铺
      this.service.initViewData();
      await this.permService.refreshPermData();
      MainViewDataMgr.getInstance().notifyDataChanged();
    }
  }

  /**
   * 分页过滤数据
   */
  getPageData(curPage){
    let data = this.viewData.storeListTmp;
    let  pageData = AppUtils.getPageData(curPage,data);
    this.viewData.storeList = pageData;
  }

}

export class FindStoreService{
  constructor(private storeMgr: StoreMgr,private chainMgr:ChainMgr,private storeViewDataMgr: StoreViewDataMgr){}

  public initViewData():void{
    let viewDataTmp = new FindStoreViewData();
    this.storeViewDataMgr.setFindStoreViewData(viewDataTmp);

    this.buildViewData((viewData:FindStoreViewData) =>{
      this.handleViewData(viewData);
    })
  }

  /**
   * 处理回调
   * @param viewDataP
   */
  public handleViewData(viewDataP: FindStoreViewData) {
    this.storeViewDataMgr.setFindStoreViewData(viewDataP);
  }

  /**
   * 获取用户相关店铺列表
   * @param user
   */
  public async buildViewData(callback:(viewDataP:FindStoreViewData) =>void) {
    let viewDataTmp = new FindStoreViewData();
    //请求用户相关店铺
    let userId = SessionUtil.getInstance().getUserId();
    let pageItemCount = 1000;
    let pageNo = 1;
    let findType = StoreFindTypeEnum.All;
    let storeList = await this.storeMgr.getByUser(userId, pageItemCount, pageNo, findType.toString());
    viewDataTmp.stores = storeList;
    viewDataTmp.storeListTmp = storeList;
    viewDataTmp.storeList = AppUtils.getPageData(1,storeList);
    viewDataTmp.page = 1;
    viewDataTmp.recordCount = storeList.length;
    viewDataTmp.loadingFinish = true;
    let chainQueryForm = new ChainQueryForm();
    viewDataTmp.stores.forEach((store:Store)=>{
      if(store && store.chainIds && store.chainIds[0]){
        chainQueryForm.chainIds.push(store.chainIds[0]);
      }
    })
    if(chainQueryForm.chainIds.length > 0){
      chainQueryForm.chainIds = AppUtils.uniquelize(chainQueryForm.chainIds);
      chainQueryForm.pageItemCount = chainQueryForm.chainIds.length.toString();
      let pageResp:PageResp = await this.chainMgr.findChainByCond(chainQueryForm);
      if(!AppUtils.isNullObj(pageResp)){
        pageResp.list.forEach((chain:Chain)=>{
          viewDataTmp.chainMap.put(chain.id.toString(),chain);
        })
      }
    }
    callback(viewDataTmp);
  }

  /**
   * 刷新店铺列表
   * @param storeList
   */
  private setStoreList(storeList) {
    let storeArr: Array<SimpleStore> = storeList.map((item:Store) => {
      let simpleStore = SimpleStore.newInstance(item.id,item.name,item.bossId);
      return simpleStore;
    })
    SessionUtil.getInstance().setSimpleStoreList(storeArr);
  }

  /**
   * 删除店铺
   * @param storeId
   * @param password
   * @param callback
   */
  public deleteStore(storeId,password,callback:(restResp: RestResp)=>void){
    let storeUpdateStatusData:StoreUpdateStatusData = new StoreUpdateStatusData();
    storeUpdateStatusData.storeId = storeId;
    storeUpdateStatusData.state = StoreState.Close;
    storeUpdateStatusData.password = password;
    this.storeMgr.updateStoreStatus(storeUpdateStatusData).then((restResp)=>{
      callback(restResp);
    })
  }

}

export class FindStoreViewData{
  public stores:Array<Store> = new Array();
  public storeListTmp:Array<Store> = new Array();
  public storeList:Array<Store> = new Array();
  public chainMap: ZmMap<Chain> = new ZmMap<Chain>();
  public queryParam:string = "";

  public loadingFinish:boolean = false;

  public page:number;//当前页码
  public recordCount:number;//总记录数
}
