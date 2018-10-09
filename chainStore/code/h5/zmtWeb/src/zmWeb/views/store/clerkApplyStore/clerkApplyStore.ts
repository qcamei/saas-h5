import {Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy} from "@angular/core";
import {Store} from "../../../bsModule/store/apiData/Store";
import {StoreMgr} from "../../../bsModule/store/StoreMgr";
import {StoreViewDataMgr} from "../StoreViewDataMgr";
import {AppUtils} from "../../../comModule/AppUtils";
import {StoreClerkInfoMgr} from "../../../bsModule/storeClerkInfo/StoreClerkInfoMgr";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {BUser} from "../../../bsModule/buser/apiData/BUser";
import {AppRouter} from "../../../comModule/AppRouter";
import {BUserSynDataHolder} from "../../../bsModule/buser/BUserSynDataHolder";

/**
 * 店铺管理 员工暂无店铺 查找加入店铺
 */
@Component({
  selector:'clerk-apply-store',
  templateUrl:'clerkApplyStore.html',
  styleUrls:['clerkApplyStore.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClerkApplyStorePage implements OnInit,OnDestroy{

  private viewDataSub: any;
  private service: ClerkApplyStoreService;
  public viewData: ClerkApplyStoreViewData;

  constructor(private storeClerkInfoMgr: StoreClerkInfoMgr,
              private storeMgr: StoreMgr,
              private buserSynDataHolder:BUserSynDataHolder,
              private storeViewDataMgr: StoreViewDataMgr,
              private cdRef: ChangeDetectorRef) {
    this.service = new ClerkApplyStoreService(this.storeClerkInfoMgr,this.storeMgr,this.storeViewDataMgr);
  }

  ngOnInit(): void {
    this.viewDataSub = this.viewDataSub = this.storeViewDataMgr.subscribeClerkApplyStoreVD((viewDataP: ClerkApplyStoreViewData) => {
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
   * 点击事件 查找店铺
   */
  findStore() {
    if(!AppUtils.isNullObj(this.viewData.queryParam)){
      this.service.findStore(this.viewData.queryParam, (findStoreViewData: ClerkApplyStoreViewData)=>{
        this.service.handleViewData(findStoreViewData);
      });
    }
  }

  /**
   * 点击事件 员工申请加入店铺
   * @param storeId
   */
  async applyStore(storeId){
    let userId = SessionUtil.getInstance().getUserId();
    let buser:BUser = await this.buserSynDataHolder.getData(userId);
    if(storeId && buser.roleSet && AppUtils.arrayContains(buser.roleSet,"1")){
      this.service.applyStore(storeId,buser.id,(successP:boolean) =>{
        if(successP){
          AppRouter.goHome();
          AppUtils.showSuccess("提示","申请成功,请及时联系店铺管理员审核");
        }else{
          AppUtils.showError("提示","申请失败");
        }
      })
    }
  }

}

export class ClerkApplyStoreService{
  constructor(private storeClerkInfoMgr:StoreClerkInfoMgr, private storeMgr: StoreMgr, private storeViewDataMgr: StoreViewDataMgr){}

  public initViewData():void{
    let viewDataTmp = new ClerkApplyStoreViewData();
    this.storeViewDataMgr.setClerkApplyStoreViewData(viewDataTmp);
  }

  /**
   * 处理回调
   * @param viewDataP
   */
  public handleViewData(viewDataP: ClerkApplyStoreViewData) {
    this.storeViewDataMgr.setClerkApplyStoreViewData(viewDataP);
  }

  /**
   * 查找店铺
   * @param queryParam
   * @param callback
   */
  public findStore(queryParam,callback:(viewDataP: ClerkApplyStoreViewData)=>void) {
    let findStoreViewData: ClerkApplyStoreViewData = new ClerkApplyStoreViewData();
    //输入编号 按id查询
    if(AppUtils.isPositiveInteger(queryParam)){
      this.storeMgr.getStore(queryParam).then(function(store){
        if(!AppUtils.isNullObj(store)){
          findStoreViewData.storeList.push(store);
        }
        findStoreViewData.loadingFinish = true;
        callback(findStoreViewData);
      })
    }else{
      //输入名称 按name查询
      this.storeMgr.getByName(queryParam,1000,1).then(function(storeList){
        findStoreViewData.storeList = storeList;
        findStoreViewData.loadingFinish = true;
        callback(findStoreViewData);
      })
    }
  }

  /**
   * 申请加入店铺
   * @param storeId
   * @param buserId
   * @param callback
   */
  public applyStore(storeId,buserId,callback:(successP:boolean) => void){
    this.storeClerkInfoMgr.applyStore(storeId,buserId).then((success) =>{
      callback(success);
    })
  }

}

export class ClerkApplyStoreViewData{
  public storeList:Array<Store> = new Array();
  public queryParam:any;
  public loadingFinish:boolean = false;
}
