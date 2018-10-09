import {Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy} from "@angular/core";
import {StoreMgr} from "../../../bsModule/store/StoreMgr";
import {StoreViewDataMgr} from "../StoreViewDataMgr";
import {AppUtils} from "../../../comModule/AppUtils";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {Store} from "../../../bsModule/store/apiData/Store";
import {StoreClerkInfoMgr} from "../../../bsModule/storeClerkInfo/StoreClerkInfoMgr";
import {BUser} from "../../../bsModule/buser/apiData/BUser";
import {AppRouter} from "../../../comModule/AppRouter";
import {BUserSynDataHolder} from "../../../bsModule/buser/BUserSynDataHolder";
import {StoreClerkInfoSynDataHolder} from "../../../bsModule/storeClerkInfo/StoreClerkInfoSynDataHolder";

/**
 * 店铺管理 加入店铺
 */
@Component({
  selector:'apply-store',
  templateUrl:'applyStore.html',
  styleUrls:['applyStore.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ApplyStorePage implements OnInit,OnDestroy{

  private viewDataSub: any;
  private service: ApplyStoreService;
  public viewData: ApplyStoreViewData;

  constructor(private storeClerkInfoMgr:StoreClerkInfoMgr,
              private storeClerkInfoSynDataHolder:StoreClerkInfoSynDataHolder,
              private storeMgr:StoreMgr,
              private bUserSynDataHolder:BUserSynDataHolder,
              private storeViewDataMgr:StoreViewDataMgr,
              private cdRef: ChangeDetectorRef){
    this.service = new ApplyStoreService(this.storeClerkInfoMgr,this.storeMgr,this.storeViewDataMgr);
  }

  ngOnInit(): void {
      this.viewDataSub = this.storeViewDataMgr.subscribeApplyStoreVD((viewDataP:ApplyStoreViewData) => {
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

  goAddStore(){
    AppRouter.goAddStore();
  }

  /**
   * 点击事件 查找店铺
   */
  findStore() {
    if(!AppUtils.isNullObj(this.viewData.queryParam)){
      this.service.findStore(this.viewData.queryParam, (applyStoreViewData: ApplyStoreViewData)=>{
        this.service.handleViewData(applyStoreViewData);
      });
    }
  }

  /**
   * 点击事件 员工申请加入店铺
   * @param storeId
   */
  async applyStore(storeId){
    let userId = SessionUtil.getInstance().getUserId();
    let buser:BUser = await this.bUserSynDataHolder.getData(userId);
    if(storeId && buser && buser.roleSet && AppUtils.arrayContains(buser.roleSet,"1")){
      let storeClerkInfoId = SessionUtil.getInstance().getIdByStoreId(storeId);
      let storeClerkInfo = await this.storeClerkInfoSynDataHolder.getData(storeClerkInfoId);
      if(!storeClerkInfo.getClerkMap().contains(userId)){//是否已加入该店铺
        if(!storeClerkInfo.getApplyClerkMap().contains(userId)){//是否已申请加入该店铺
          this.service.applyStore(storeId,buser.id,(successP:boolean) =>{
            if(successP){
              AppRouter.goHome();
              AppUtils.showSuccess("提示","申请成功,请及时联系店铺管理员审核");
            }else{
              AppUtils.showError("提示","申请失败");
            }
          })
        }else{
          AppUtils.showWarn("提示","已申请过该店铺,不能重复申请");
        }
      }else{
        AppUtils.showWarn("提示","已加入该店铺");
      }
    }
  }

}

export class ApplyStoreService{
  constructor(private storeClerkInfoMgr:StoreClerkInfoMgr,private storeMgr:StoreMgr,private storeViewDataMgr:StoreViewDataMgr){}

  public initViewData():void{
    let viewDataTmp = new ApplyStoreViewData();
    this.storeViewDataMgr.setApplyStoreViewData(viewDataTmp);
  }

  /**
   * 处理回调
   * @param viewDataP
   */
  public handleViewData(viewDataP: ApplyStoreViewData) {
    this.storeViewDataMgr.setApplyStoreViewData(viewDataP);
  }

  /**
   * 查找店铺
   * @param queryParam
   * @param callback
   */
  public findStore(queryParam,callback:(viewDataP: ApplyStoreViewData)=>void) {
    let applyStoreViewData: ApplyStoreViewData = new ApplyStoreViewData();
    //输入编号 按id查询
    if(AppUtils.isPositiveInteger(queryParam)){
      this.storeMgr.getStore(queryParam).then(function(store){
        applyStoreViewData.queryParam = queryParam;
        if(!AppUtils.isNullObj(store)){
          applyStoreViewData.storeList.push(store);
        }
        applyStoreViewData.loadingFinish = true;
        callback(applyStoreViewData);
      })
    }else{
      //输入名称 按name查询
      this.storeMgr.getByName(queryParam,100,1).then(function(storeList){
        applyStoreViewData.queryParam = queryParam;
        applyStoreViewData.storeList = storeList;
        applyStoreViewData.loadingFinish = true;
        callback(applyStoreViewData);
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

export class ApplyStoreViewData{
  public storeList:Array<Store> = new Array();
  public queryParam:any;

  public loadingFinish:boolean = false;
}
