import {Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy} from "@angular/core";
import {StoreMgr} from "../../../bsModule/store/StoreMgr";
import {StoreViewDataMgr} from "../StoreViewDataMgr";
import {AppUtils} from "../../../comModule/AppUtils";
import {StoreAddApiForm} from "../../../bsModule/store/apiData/StoreAddApiForm";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {BUser} from "../../../bsModule/buser/apiData/BUser";
import {AppRouter} from "../../../comModule/AppRouter";
import {MainViewDataMgr} from "../../main/MainViewDataMgr";
import {BUserSynDataHolder} from "../../../bsModule/buser/BUserSynDataHolder";
import {Store} from "../../../bsModule/store/apiData/Store";
import {PermService} from "../../permService";

/**
 * 店铺管理 管理者暂无店铺 创建店铺页面
 */
@Component({
  selector:'boss-add-store',
  templateUrl:'bossAddStore.html',
  styleUrls:['bossAddStore.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class BossAddStorePage implements OnInit,OnDestroy{

  private viewDataSub: any;
  private service: BossAddStoreService;
  public viewData: BossAddStoreViewData;

  constructor(private storeMgr:StoreMgr,
              private buserSynDataHolder:BUserSynDataHolder,
              private permService:PermService,
              private storeViewDataMgr:StoreViewDataMgr,
              private cdRef: ChangeDetectorRef){
    this.service = new BossAddStoreService(this.storeMgr,this.storeViewDataMgr);
  }

  ngOnInit(): void {
    this.viewDataSub = this.storeViewDataMgr.subscribeBossAddStoreVD((viewDataP:BossAddStoreViewData) => {
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
   * 添加店铺点击事件
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
          this.viewData.addForm.bossId = userId;
          this.viewData.addForm.area = this.viewData.citySetting.join("/");
          AppUtils.showMask("加载中");
          let store = await this.service.addStore(this.viewData.addForm);
          if(store){
            await this.permService.refreshPermData();
            AppUtils.closeMask();
            AppUtils.showSuccess("提示","新建成功");
            MainViewDataMgr.getInstance().notifyDataChanged();
            AppRouter.goGuide();
          }else{
            AppUtils.closeMask();
            AppUtils.showError("提示","新建失败");
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

export class BossAddStoreService{
  constructor(private storeMgr:StoreMgr,private storeViewDataMgr:StoreViewDataMgr){}

  public initViewData():void{
    let viewDataTmp = new BossAddStoreViewData();
    this.storeViewDataMgr.setBossAddStoreViewData(viewDataTmp);
  }

  /**
   * 添加店铺
   * @param addForm
   */
  public addStore(addForm):Promise<Store>{
    return this.storeMgr.addStore(addForm);
  }

}

export class BossAddStoreViewData{
  public addForm:StoreAddApiForm = new StoreAddApiForm();
  public citySetting:string[] = [];
}
