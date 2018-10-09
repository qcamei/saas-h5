import {Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy} from "@angular/core";
import {Store} from "../../../bsModule/store/apiData/Store";
import {StoreMgr} from "../../../bsModule/store/StoreMgr";
import {StoreViewDataMgr} from "../StoreViewDataMgr";
import {AppUtils} from "../../../comModule/AppUtils";
import {ActivatedRoute} from "@angular/router";
import {UpdateStoreInfoApiData} from "../../../bsModule/store/apiData/UpdateStoreInfoApiData";
import {AppRouter} from "../../../comModule/AppRouter";
import {StoreSynDataHolder} from "../../../bsModule/store/StoreSynDataHolder";
import {MainViewDataMgr} from "../../main/MainViewDataMgr";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PermService} from "../../permService";

/**
 * 店铺管理首页 编辑店铺
 */
@Component({
  selector:'edit-store',
  templateUrl:'editStore.html',
  styleUrls:['editStore.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditStorePage implements OnInit,OnDestroy{

  /********test************/
  // text = "text"
  // password = ""
  //
  // price = 100.99;
  // print(){
  //   console.log(this.text);
  //   console.log(this.price);
  //   console.log(this.password);
  // }
  //
  // requestUrl = AppCfg.getInstance().getServiceAddress() + "/img/saveImgs/img/store/" + 15;
  // uploadCallback(imgArr: Array<string>){
  //   for(var i=0;i<imgArr.length;i++){
  //     console.log("callback==========="+AppCfg.getInstance().getImgPreUrl(); + imgArr[i]);
  //   }
  // }
  // radioList:Array<RadioItem> = new Array<RadioItem>(new RadioItem("男",1),new RadioItem("女",2));
  // curValue = this.radioList[1];

  // currentDate = 1520611200000;
  // maxDate = new Date("2018-3-15");
  // minDate = new Date("2018-3-5");
  // print(){
  //   console.log("======="+this.currentDate);
  // }
  //
  // currentTime = {hour: 13, minute: 30,second:30};
  // minuteStep = 30;
  // seconds = true;

  // changeCheckbox(e){
  //   console.log("=========="+e);
  // }
  // selectList = new Array<SelectItem>(new SelectItem("开单收银",0),new SelectItem("会员充值",1));
  // curSelectItem = this.selectList[1];
  // changeOption(e){
  //   console.log(e);
  // }
  // zmValue = 10;
  // ngForm:FormGroup;
  /**********test**********/

  private viewDataSub: any;
  private paramsSub:any;
  private service: EditStoreService;
  public viewData: EditStoreViewData;
  public storeForm:FormGroup;

  constructor(private storeMgr:StoreMgr,
              private storeSynDataHolder:StoreSynDataHolder,
              private permService:PermService,
              private storeViewDataMgr:StoreViewDataMgr,
              private fb:FormBuilder,
              private cdRef:ChangeDetectorRef,
              private route: ActivatedRoute){
    this.service = new EditStoreService(this.storeMgr,this.storeSynDataHolder,this.storeViewDataMgr);
    //TODO 响应是表单test
    // this.storeForm = this.fb.group({
    //   storeName:["",[Validators.required, Validators.maxLength(20)]],
    //   address:["",Validators.required],
    //   tel:["",[Validators.required, Validators.pattern('[a-z0-9._%+_]+@[a-z0-9.-]+')]],
    // })
    // let validators = [];
    // validators.push(Validators.required);
    // this.ngForm = this.fb.group({
    //   price:[10,validators],
    // })
  }

  ngOnInit(): void {
    this.viewDataSub = this.storeViewDataMgr.subscribeEditStoreVD((viewDataP:EditStoreViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.paramsSub = this.route.params.subscribe(params => {
      let storeId = params['storeId'];
      this.service.initViewData(storeId);
    });
  }

  ngOnDestroy(): void {
    if(!AppUtils.isNullObj(this.viewDataSub)){
      this.viewDataSub.unsubscribe();
    }
    this.paramsSub.unsubscribe();
  }

  async updateStoreInfo(){
    if(AppUtils.isNullOrWhiteSpace(this.viewData.store.name)){
      AppUtils.showWarn("提示","请输入店铺名称");
    }else if(AppUtils.isNullOrWhiteSpace(this.viewData.citySetting.join("/"))){
      AppUtils.showWarn("提示","请选择区域");
    }else if(AppUtils.isNullOrWhiteSpace(this.viewData.store.tel)){
      AppUtils.showWarn("提示","请输入预约电话");
    }else{
      let updateInfoData:UpdateStoreInfoApiData = new UpdateStoreInfoApiData();
      updateInfoData.storeId = this.viewData.store.id;
      updateInfoData.name = this.viewData.store.name;
      updateInfoData.descript = this.viewData.store.descript;
      updateInfoData.area = this.viewData.citySetting.join("/");
      updateInfoData.address = this.viewData.store.address;
      updateInfoData.tel = this.viewData.store.tel;
      updateInfoData.recommender = this.viewData.store.recommender;
      updateInfoData.recomPhone = this.viewData.store.recomPhone;
      updateInfoData.company = this.viewData.store.company;
      updateInfoData.companyArea = this.viewData.store.companyArea;
      updateInfoData.companyAddress = this.viewData.store.companyAddress;
      updateInfoData.licenseImg = this.viewData.store.licenseImg;
      updateInfoData.wechatRecommendImg = this.viewData.store.wechatRecommendImg;
      updateInfoData.disseminateImgs = this.viewData.store.disseminateImgs;
      AppUtils.showMask("加载中");
      let success = await this.service.updateStoreInfo(updateInfoData);
      if(success){
        await this.permService.refreshPermData();
        AppUtils.closeMask();
        AppUtils.showSuccess("提示","修改成功");
        MainViewDataMgr.getInstance().notifyDataChanged();
        AppRouter.goFindStore();
      }else{
        AppUtils.closeMask();
        AppUtils.showError("提示","修改失败");
      }
    }
  }

}

export class EditStoreService{
  constructor(private storeMgr:StoreMgr,private storeSynDataHolder:StoreSynDataHolder,private storeViewDataMgr:StoreViewDataMgr){}

  public initViewData(storeId):void{
    this.storeViewDataMgr.setEditStoreViewData(new EditStoreViewData());

    this.buildViewData(storeId,(viewDataP:EditStoreViewData) => {
      this.handleViewData(viewDataP);
    })
  }

  /**
   * 处理回调数据
   * @param viewDataP
   */
  public handleViewData(viewDataP){
    this.storeViewDataMgr.setEditStoreViewData(viewDataP);
  }

  /**
   * 请求店铺信息 组装viewData数据
   * @param storeId
   * @param callbackP
   */
  public buildViewData(storeId,callbackP:(viewDataP:EditStoreViewData) => void){
    let viewDataTmp = new EditStoreViewData();

    this.storeSynDataHolder.getData(storeId).then(function(store) {
      if(!AppUtils.isNullObj(store)){
        viewDataTmp.store = store;
        viewDataTmp.citySetting = store.area.split("/");
        callbackP(viewDataTmp);
      }else{
        AppUtils.showError("提示","加载失败");
      }
    });
  }

  /**
   * 修改店铺信息
   * @param updateData
   */
  public updateStoreInfo(updateData):Promise<boolean>{
    return this.storeMgr.updateStoreInfo(updateData);
  }

}

export class EditStoreViewData{
  public store:Store = new Store();
  public citySetting:string[] = [];
}
