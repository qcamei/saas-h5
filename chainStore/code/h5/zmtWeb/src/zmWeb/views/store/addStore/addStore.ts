import {Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy} from "@angular/core";
import {StoreMgr} from "../../../bsModule/store/StoreMgr";
import {StoreViewDataMgr} from "../StoreViewDataMgr";
import {AppUtils} from "../../../comModule/AppUtils";
import {StoreAddApiForm} from "../../../bsModule/store/apiData/StoreAddApiForm";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {BUser} from "../../../bsModule/buser/apiData/BUser";
import {AppRouter} from "../../../comModule/AppRouter";
import {Store} from "../../../bsModule/store/apiData/Store";
import {StoreData, CurrentStore} from "../../../comModule/session/SessionData";
import {MainViewDataMgr} from "../../main/MainViewDataMgr";
import {BUserSynDataHolder} from "../../../bsModule/buser/BUserSynDataHolder";
import {PermService} from "../../permService";
import {RestResp} from "../../../comModule/RestResp";

/**
 * 店铺管理 创建店铺
 */
@Component({
  selector:'add-store',
  templateUrl:'addStore.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AddStorePage implements OnInit,OnDestroy{

  private viewDataSub: any;
  private service: AddStoreService;
  public viewData: AddStoreViewData;

  constructor(private storeMgr:StoreMgr,
              private buserSynDataHolder:BUserSynDataHolder,
              private permService:PermService,
              private storeViewDataMgr:StoreViewDataMgr,
              private cdRef: ChangeDetectorRef){
    this.service = new AddStoreService(this.storeMgr,this.storeViewDataMgr);
  }

  ngOnInit(): void {
      this.viewDataSub = this.storeViewDataMgr.subscribeAddStoreVD((viewDataP:AddStoreViewData) => {
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
   * 添加店铺 页面点击事件
   */
  async addStore(){
    if(AppUtils.isNullOrWhiteSpace(this.viewData.addForm.name)){
      AppUtils.showWarn("提示","请输入店铺名称");
    }else if(AppUtils.isNullOrWhiteSpace(this.viewData.citySetting.join("/"))){
      AppUtils.showWarn("提示","请选择区域");
    }else if(AppUtils.isNullOrWhiteSpace(this.viewData.addForm.tel)){
      AppUtils.showWarn("提示","请输入预约电话");
    }else{
      let userId = SessionUtil.getInstance().getUserId();
      if(!AppUtils.isNullOrWhiteSpace(userId)){
        let buser:BUser = await this.buserSynDataHolder.getData(userId);
        if(!AppUtils.isNullObj(buser.id) && buser.roleSet && AppUtils.arrayContains(buser.roleSet,"0")){
          this.viewData.addForm.bossId = buser.id;
          this.viewData.addForm.area = this.viewData.citySetting.join("/");
          AppUtils.showMask("加载中");
          let restResp:RestResp = await this.service.addStore(this.viewData.addForm);
          if(!AppUtils.isNullObj(restResp) && (restResp.code==200) && !AppUtils.isNullOrWhiteSpace(restResp.tJson)){
            let store = new Store();
            AppUtils.copyJson(store,restResp.tJson);
            let storeData = new StoreData();
            let currentStore = CurrentStore.newInstance(store);
            storeData.setCurrentStore(currentStore);
            SessionUtil.getInstance().setStoreData(storeData);
            await this.permService.refreshPermData();
            AppUtils.closeMask();
            AppUtils.showSuccess("提示","新建成功");
            MainViewDataMgr.getInstance().notifyDataChanged();
            AppRouter.goGuide();
          }else{
            AppUtils.closeMask();
            if(!AppUtils.isNullObj(restResp)){
              AppUtils.showError("提示",restResp.tips);
            }else{
              AppUtils.showError("提示","新建失败");
            }
          }
        }else{
          AppUtils.showWarn("提示","非管理端暂无权限新建店铺");
        }
      }else{
        AppRouter.goLogin();
      }
    }
  }

}

export class AddStoreService{

  constructor(private storeMgr:StoreMgr,private storeViewDataMgr:StoreViewDataMgr){}

  public initViewData():void{
    let viewDataTmp = new AddStoreViewData();
    this.storeViewDataMgr.setAddStoreViewData(viewDataTmp);
  }

  /**
   * 添加店铺
   * @param addForm
   */
  public addStore(addForm):Promise<RestResp>{
    return this.storeMgr.addStore4Resp(addForm);
  }

}

export class AddStoreViewData{
  public addForm:StoreAddApiForm = new StoreAddApiForm();
  public citySetting:string[] = [];
}
