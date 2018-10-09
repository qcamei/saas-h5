import {Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy} from "@angular/core";
import {StoreClerkInfoViewDataMgr} from "../StoreClerkInfoViewDataMgr";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {StoreClerkInfoMgr} from "../../../bsModule/storeClerkInfo/StoreClerkInfoMgr";
import {ClerkInfo} from "../../../bsModule/storeClerkInfo/data/ClerkInfo";
import {ApplyClerkInfo} from "../../../bsModule/storeClerkInfo/data/ApplyClerkInfo";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {BUserMgr} from "../../../bsModule/buser/BUserMgr";
import {StoreAdminRole} from "../../../bsModule/storeClerkInfo/data/storeAdminRole/StoreAdminRole";
import {BeauticianInfo} from "../../../bsModule/storeBeauticianInfo/data/BeauticianInfo";
import {BUser} from "../../../bsModule/buser/apiData/BUser";
import {StoreBeauticianInfo} from "../../../bsModule/storeBeauticianInfo/data/StoreBeauticianInfo";
import {AppRouter} from "../../../comModule/AppRouter";
import {StoreSynDataHolder} from "../../../bsModule/store/StoreSynDataHolder";
import {StoreClerkInfoSynDataHolder} from "../../../bsModule/storeClerkInfo/StoreClerkInfoSynDataHolder";
import {StoreBeauticianInfoSynDataHolder} from "../../../bsModule/storeBeauticianInfo/StoreBeauticianInfoSynDataHolder";
import {ActivatedRoute} from "@angular/router";
import {EntityState} from "../../../comModule/enum/EntityState";
import {Popup} from "../../common/popup/popup";

/**
 * 店员管理 查找店员 对应员工列表和审核名单
 */
@Component({
  selector:'find-clerk',
  templateUrl:'findClerk.html',
  styles:[`
    .chainMark{
      border-radius:20px;
      background:#03a9f4;
      color:#ffffff;
      position: absolute;
      top:auto;
      left:0;
    }  
  `],
  changeDetection:ChangeDetectionStrategy.OnPush
})

export class FindClerkPage implements OnInit,OnDestroy{

  private viewDataSub: any;
  private paramsSub: any;
  private service: FindClerkService;
  public viewData: FindClerkViewData;

  public defaultTab:string;

  constructor(private buserMgr:BUserMgr,
              private storeBeauticianInfoSynDataHolder:StoreBeauticianInfoSynDataHolder,
              private storeClerkInfoMgr:StoreClerkInfoMgr,
              private storeClerkInfoSynDataHolder:StoreClerkInfoSynDataHolder,
              private storeClerkInfoViewDataMgr:StoreClerkInfoViewDataMgr,
              private storeSynDataHolder:StoreSynDataHolder,
              private route:ActivatedRoute,
              private cdRef: ChangeDetectorRef){
    this.service = new FindClerkService(this.buserMgr,this.storeBeauticianInfoSynDataHolder,this.storeClerkInfoMgr,this.storeClerkInfoSynDataHolder,this.storeSynDataHolder,this.storeClerkInfoViewDataMgr);
  }

  ngOnInit(): void {
    this.viewDataSub = this.storeClerkInfoViewDataMgr.subscribeFindClerkVD((viewDataP:FindClerkViewData) => {
        this.viewData = viewDataP;
        this.cdRef.markForCheck();
    })
    this.paramsSub = this.route.params.subscribe(params => {
      let tabIndex = params['tabIndex'];
      if(tabIndex == 1){
        this.defaultTab = "审核名单";
      }else{
        this.defaultTab = "员工列表";
      }
      this.service.initViewData();
    });

  }

  ngOnDestroy(): void {
    if(!AppUtils.isNullObj(this.viewDataSub)){
      this.viewDataSub.unsubscribe();
    }
  }


  /**
   * 通过姓名查找员工 页面点击事件
   * @param name 姓名/手机号
   */
  findClerkByName(){
    if(!AppUtils.isNullObj(this.viewData.clerkName)){
      this.viewData.clerkName = AppUtils.trimBlank(this.viewData.clerkName);
      this.viewData.clerkListTmp = this.viewData.clerkDataList.filter((item) =>{
        if(AppUtils.isPositiveInteger(this.viewData.clerkName)){
          if(item.phone && item.phone.indexOf(this.viewData.clerkName) > -1){
            return true;
          }else{
            return false;
          }
        }else{
          if(item.name && item.name.indexOf(this.viewData.clerkName) > -1){
            return true;
          }else{
            return false;
          }
        }
      })
      this.viewData.clerkPage = 1;
      this.viewData.clerkRecordCount = this.viewData.clerkListTmp.length;
      this.viewData.clerkList = AppUtils.getPageData(1,this.viewData.clerkListTmp);
    }
  }

  /**
   * 过滤岗位 页面选择事件
   */
  findClerkByRole(){
    if(this.viewData.clerkRoleName == "0"){
      this.viewData.clerkListTmp = this.viewData.clerkDataList;
    }else{
      this.viewData.clerkListTmp = this.viewData.clerkDataList.filter((item)=>{
        if(item.roleSetName && item.roleSetName.indexOf(this.viewData.clerkRoleName) >-1){
          return true;
        }else{
          return false;
        }
      })
    }
    this.viewData.clerkPage = 1;
    this.viewData.clerkRecordCount = this.viewData.clerkListTmp.length;
    this.viewData.clerkList = AppUtils.getPageData(1,this.viewData.clerkListTmp);
  }

  /**
   * 过滤是否为医美师 页面选择事件
   */
  findClerkByBeautician(){
    if(this.viewData.isBeautician == "0"){
      this.viewData.clerkListTmp = this.viewData.clerkDataList;
    }else{
      this.viewData.clerkListTmp = this.viewData.clerkDataList.filter((item)=>{
        if(this.viewData.isBeautician == "1" && item.isBeautician){
          return true;
        }else if(this.viewData.isBeautician == "2" && !item.isBeautician){
          return true;
        }else{
          return false;
        }
      })
    }
    this.viewData.clerkPage = 1;
    this.viewData.clerkRecordCount = this.viewData.clerkListTmp.length;
    this.viewData.clerkList = AppUtils.getPageData(1,this.viewData.clerkListTmp);
  }

  findClerk(){
    let clerkListTmp = this.viewData.clerkDataList;

    if (!AppUtils.isNullObj(this.viewData.clerkName)) {//名称
      this.viewData.clerkName = AppUtils.trimBlank(this.viewData.clerkName);
      clerkListTmp = this.viewData.clerkDataList.filter((item) => {
        if (AppUtils.isPositiveInteger(this.viewData.clerkName)) {
          if (item.phone && item.phone.indexOf(this.viewData.clerkName) > -1) {
            return true;
          } else {
            return false;
          }
        } else {
          if (item.name && item.name.indexOf(this.viewData.clerkName) > -1) {
            return true;
          } else {
            return false;
          }
        }
      })

      if (this.viewData.clerkRoleName != "0") {//角色
        clerkListTmp = clerkListTmp.filter((item) => {
          if (item.roleSetName && item.roleSetName.indexOf(this.viewData.clerkRoleName) > -1) {
            return true;
          } else {
            return false;
          }
        })
      }

      if (this.viewData.isBeautician != "0") {//是否医美师
        clerkListTmp = clerkListTmp.filter((item) => {
          if (this.viewData.isBeautician == "1" && item.isBeautician) {
            return true;
          } else if (this.viewData.isBeautician == "2" && !item.isBeautician) {
            return true;
          } else {
            return false;
          }
        })
      }

      this.viewData.clerkListTmp = clerkListTmp;
      this.viewData.clerkPage = 1;
      this.viewData.clerkRecordCount = this.viewData.clerkListTmp.length;
      this.viewData.clerkList = AppUtils.getPageData(1, this.viewData.clerkListTmp);
    }
  }

  /**
   * 查找申请员工 页面点击事件
   * @param name
   */
  findApplyClerk(){
    if(!AppUtils.isNullObj(this.viewData.applyClerkName)){
      this.viewData.applyClerkName = AppUtils.trimBlank(this.viewData.applyClerkName);
      this.viewData.applyClerkListTmp = this.viewData.applyClerkDataList.filter((item) =>{
        if(AppUtils.isPositiveInteger(this.viewData.applyClerkName)){
          if(item.phone && item.phone.indexOf(this.viewData.applyClerkName) > -1){
            return true;
          }else{
            return false;
          }
        }else{
          if(item.name && item.name.indexOf(this.viewData.applyClerkName) > -1){
            return true;
          }else{
            return false;
          }
        }
      })
      this.viewData.applyClerkPage = 1;
      this.viewData.applyClerkRecordCount = this.viewData.applyClerkListTmp.length;
      this.viewData.applyClerkList = AppUtils.getPageData(1,this.viewData.applyClerkListTmp);
    }
  }

  /**
   * 跳转员工加入 页面点击事件
   */
  goAddClerk(){
    AppRouter.goAddClerk();
  }

  /**
   * 跳转岗位分配 页面点击事件
   */
  goAllocationRole(clerkId){
    if(clerkId){
      AppRouter.goAllocationRole(clerkId);
    }
  }

  /**
   * 删除员工 页面点击事件
   * @param clerk
   */
  deleteClerk(clerk){
    Popup.getInstance().open("删除员工","确定删除"+clerk.name+"?",()=>{
      this.service.deleteClerk(clerk.id,(successP:boolean) =>{
          if(successP){
            AppUtils.showSuccess("提示","删除成功");
            this.service.initViewData();
          }else{
            AppUtils.showError("提示","删除失败");
          }
      })
    });
  }

  /**
   * 员工审核 页面点击事件
   * @param clerkId
   * @param approved
   */
  handleApplyClerk(clerkId,approved){
    let tip = "确认审核通过？";
    if(!approved){
      tip = "确认审核不通过？"
    }
    Popup.getInstance().open("提示",tip,()=>{
      this.service.handleApplyClerk(clerkId,approved,(successP:boolean) =>{
        this.service.initViewData();
        if(successP){
          AppUtils.showSuccess("提示","审核成功");
        }else{
          AppUtils.showError("提示","审核失败");
        }
      })
    });
  }

  /**
   * 批量审核
   * @param approved
   */
  handleGroup(approved){
    let idArr = [];
    this.viewData.applyClerkList.forEach((item) =>{
      if(item.checked){
        idArr.push(item.id);
      }
    })
    if(idArr.length > 0){
      if(approved){
        this.service.handleGroup(idArr,true,(success:boolean) =>{
          this.service.initViewData();
          if(success){
            AppUtils.showSuccess("提示","批量审核成功");
          }else{
            AppUtils.showError("提示","批量审核失败");
          }
        });
      }else{
        this.service.handleGroup(idArr,false,(success:boolean) =>{
          this.service.initViewData();
          if(success){
            AppUtils.showSuccess("提示","批量审核成功");
          }else{
            AppUtils.showError("提示","批量审核失败");
          }
        });
      }
    }else{
      AppUtils.showWarn("提示","请选择审核员工");
    }

  }

  // /**
  //  * 选择申请员工项
  //  * @param e
  //  * @param applyClerkId
  //  */
  // selectApplyItem(e,applyClerkId){
  //   let checked = e.target.checked;
  //   this.viewData.applyClerkList.forEach((item) =>{
  //     if(item.id == applyClerkId){
  //       item.checked = checked;
  //     }
  //   })
  // }

  /**
   * 分页过滤数据
   */
  getClerkPageData(curPage){
    let data = this.viewData.clerkDataList;
    let  pageData = AppUtils.getPageData(curPage,data);
    this.viewData.clerkList = pageData;
  }

  /**
   * 分页过滤数据
   */
  getApplyClerkPageData(curPage){
    let data = this.viewData.applyClerkDataList;
    let  pageData = AppUtils.getPageData(curPage,data);
    this.viewData.applyClerkList = pageData;
  }

}

export class FindClerkService{
  constructor(private buserMgr:BUserMgr,
              private storeBeauticianInfoSynDataHolder:StoreBeauticianInfoSynDataHolder,
              private storeClerkInfoMgr:StoreClerkInfoMgr,
              private storeClerkInfoSynDataHolder:StoreClerkInfoSynDataHolder,
              private storeSynDataHolder:StoreSynDataHolder,
              private storeClerkInfoViewDataMgr:StoreClerkInfoViewDataMgr
              ){}

  public initViewData():void{
    let viewDataTmp = new FindClerkViewData();
    this.storeClerkInfoViewDataMgr.setFindClerkViewData(viewDataTmp);

    this.buildViewData((viewDataP:FindClerkViewData) =>{
      this.handleViewData(viewDataP);
    });
  }

  /**
   * 处理回调数据
   * @param viewDataP
   */
  public handleViewData(viewDataP){
    this.storeClerkInfoViewDataMgr.setFindClerkViewData(viewDataP);
  }

  /**
   * 查询storeClerkInfo 组装数据
   * @param callback
   */
  public async buildViewData(callback:(viewDataP:FindClerkViewData) => void){
    let viewDataTmp = new FindClerkViewData();

    //请求storeClerkInfo
    let storeId = SessionUtil.getInstance().getStoreId();
    let clerkInfoId = SessionUtil.getInstance().getIdByStoreId(storeId);
    let storeClerkInfo = await this.storeClerkInfoSynDataHolder.getData(clerkInfoId);
    viewDataTmp.applyClerkMap = storeClerkInfo.getApplyClerkMap();
    viewDataTmp.roleMap = storeClerkInfo.getEditRoleMap();
    viewDataTmp.roleList = viewDataTmp.roleMap.values();

    //请求store
    let store = await this.storeSynDataHolder.getData(storeId);
    if(store && store.bossId){
      viewDataTmp.clerkMap = this.getClerkMap(storeClerkInfo.clerkInfoMap, store.bossId);
    }

    //请求所有医美师信息
    let storeBeauticianInfo = await this.storeBeauticianInfoSynDataHolder.getData(storeId);
    viewDataTmp.beauticianMap = storeBeauticianInfo.getBeauticianMap();

    //请求所有员工信息
    let clerkIdArray = viewDataTmp.clerkMap.keys();
    let applyClerkIdArray = viewDataTmp.applyClerkMap.keys();
    let idArray = AppUtils.addAll(clerkIdArray,applyClerkIdArray);
    let buserList = new Array<BUser>();
    if(idArray.length > 0){
      buserList = await this.buserMgr.findByMultitId(idArray);
    }
    viewDataTmp.buserList = buserList;

    //构建clerkDataList
    viewDataTmp.clerkDataList = this.getClerkDataList(viewDataTmp.roleMap, viewDataTmp.clerkMap, viewDataTmp.buserList,viewDataTmp.beauticianMap);
    viewDataTmp.clerkListTmp = viewDataTmp.clerkDataList;
    viewDataTmp.clerkPage = 1;
    viewDataTmp.clerkRecordCount = viewDataTmp.clerkListTmp.length;
    viewDataTmp.clerkList = AppUtils.getPageData(1,viewDataTmp.clerkListTmp);

    //构建applyClerkData
    viewDataTmp.applyClerkDataList = this.getApplyClerkDataList(viewDataTmp.applyClerkMap, buserList);
    viewDataTmp.applyClerkListTmp = viewDataTmp.applyClerkDataList;
    viewDataTmp.applyClerkPage = 1;
    viewDataTmp.applyClerkRecordCount = viewDataTmp.applyClerkListTmp.length;
    viewDataTmp.applyClerkList = AppUtils.getPageData(1,viewDataTmp.applyClerkListTmp);

    viewDataTmp.loadingFinish = true;
    callback(viewDataTmp);
  }

  /**
   * 组装员工map
   * @param clerkInfoMap
   * @param bossId
   * @returns {ZmMap<ClerkInfo>}
   */
  private getClerkMap(clerkInfoMap, bossId: string):ZmMap<ClerkInfo> {
    let userId = SessionUtil.getInstance().getUserId();
    let clerkMap: ZmMap<ClerkInfo> = new ZmMap<ClerkInfo>();
    for (let index in clerkInfoMap) {
      let item = clerkInfoMap[index];
      if (item.buserId != bossId && (item.buserId != userId) && (item.entityState == EntityState.Normal)) {
        clerkMap.put(item.buserId, item);
      }
    }
    return clerkMap;
  }

  /**
   * 组装申请员工列表
   * @param applyClerkMap
   * @param buserList
   * @returns {ApplyClerkData[]}
   */
  private getApplyClerkDataList(applyClerkMap: ZmMap<ApplyClerkInfo>, buserList: BUser[]):Array<ApplyClerkData>{
    let applyClerkDataList = new Array<ApplyClerkData>();
    for (let index = 0; index < applyClerkMap.keys().length; index++) {
      let item = applyClerkMap.get(applyClerkMap.keys()[index]);
      let applyClerkData = new ApplyClerkData();
      for (let i = 0; i < buserList.length; i++) {
        if (item && item.buserId == buserList[i].id) {
          applyClerkData.id = item.buserId;
          applyClerkData.name = buserList[i].name;
          applyClerkData.gender = buserList[i].gender;
          applyClerkData.phone = buserList[i].phone;
        }
      }
      applyClerkDataList.push(applyClerkData);
    }
    return applyClerkDataList;
  }

  /**
   * 组装员工列表
   * @param roleMap
   * @param clerkMap
   * @param buserList
   * @param beauticianMap
   * @returns {ClerkData[]}
   */
  private getClerkDataList(roleMap:ZmMap<StoreAdminRole>, clerkMap: ZmMap<ClerkInfo>, buserList: BUser[],beauticianMap:ZmMap<BeauticianInfo>):Array<ClerkData>{
    let clerkDataList = new Array<ClerkData>();
    for (let index = 0; index < clerkMap.keys().length; index++) {
      let item = clerkMap.get(clerkMap.keys()[index]);
      let clerkData = new ClerkData();
      for (let i = 0; i < buserList.length; i++) {
        if (item && item.buserId == buserList[i].id) {
          clerkData.id = item.buserId;
          clerkData.name = buserList[i].name;
          clerkData.gender = buserList[i].gender;
          clerkData.phone = buserList[i].phone;
          clerkData.origin = buserList[i].origin;
          //员工是否为医美师
          if (beauticianMap.contains(item.buserId)) {
            clerkData.isBeautician = true;
          } else {
            clerkData.isBeautician = false;
          }
          //员工对应所有职位
          if (item.roleSet) {
            let roleNameArr = new Array();
            for (let i = 0; i < item.roleSet.length; i++) {
              if (roleMap.get(item.roleSet[i]) && roleMap.get(item.roleSet[i]).name) {
                roleNameArr.push(roleMap.get(item.roleSet[i]).name);
              }
            }
            clerkData.roleSetName = roleNameArr.join("、");
          }
        }
      }
      clerkDataList.push(clerkData);
    }
    return clerkDataList;
  }

  /**
   * 删除员工
   * @param clerkId
   * @param callback
   */
  public deleteClerk(clerkId,callback:(successP:boolean) => void){
    let storeId = SessionUtil.getInstance().getStoreId();
    this.storeClerkInfoMgr.deleteClerk(storeId,clerkId).then((success) =>{
      callback(success);
    })
  }

  /**
   * 处理员工申请
   * @param buserId
   * @param approved
   * @param callback
   */
  public handleApplyClerk(buserId,approved,callback:(successP:boolean) => void){
    let storeId = SessionUtil.getInstance().getStoreId();
    this.storeClerkInfoMgr.handleApplyClerk(storeId,buserId,approved).then((success) =>{
      callback(success);
    })
  }

  /**
   * 批量审核
   * @param idArr
   * @param approved
   */
  public handleGroup(idArr:Array<string>,approved,callback:(successP:boolean) => void){
    let storeId = SessionUtil.getInstance().getStoreId();
    this.storeClerkInfoMgr.HandleGroupApplyClerk(storeId,idArr,approved).then((success) =>{
      callback(success);
    })
  }

}

export class FindClerkViewData{
  public clerkMap:ZmMap<ClerkInfo>;
  public applyClerkMap:ZmMap<ApplyClerkInfo>;
  public roleMap:ZmMap<StoreAdminRole>;

  public buserList:Array<BUser>;
  public storeBeauticianInfo:StoreBeauticianInfo;
  public beauticianMap:ZmMap<BeauticianInfo>;

  //查询参数
  public clerkName:string = "";
  public clerkRoleName:string = "0";
  public isBeautician:string = "0";
  public applyClerkName:string = "";

  //对应店铺所有员工
  public clerkDataList:Array<ClerkData> = new Array<ClerkData>();
  public clerkListTmp:Array<ClerkData> = new Array();
  public clerkList:Array<ClerkData> = new Array();//符合查询条件的员工
  //对应店铺所有申请员工
  public applyClerkDataList:Array<ApplyClerkData> = new Array<ApplyClerkData>();
  public applyClerkListTmp:Array<ApplyClerkData> = new Array();
  public applyClerkList:Array<ApplyClerkData> = new Array();//待审核员工

  //所有岗位列表
  public roleList:Array<StoreAdminRole> = [];

  public clerkPage:number;//当前页码
  public clerkRecordCount:number;//员工总记录数
  public applyClerkPage:number;//当前页码
  public applyClerkRecordCount:number;//申请员工总记录数

  public loadingFinish:boolean = false;
}

export class ClerkData{
  id:string;
  name:string;
  gender:number;
  phone:string;
  roleSetName:string;
  isBeautician:boolean;
  origin:number;
}

export class ApplyClerkData{
  id:string;
  name:string;
  gender:number;
  phone:string;
  checked:boolean = false;
}
