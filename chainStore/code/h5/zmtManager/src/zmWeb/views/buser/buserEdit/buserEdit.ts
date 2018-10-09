///<reference path="../../common/Util/Constants.ts"/>
import {Component, OnDestroy, OnInit, ChangeDetectorRef} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {AppUtils} from "../../../comModule/AppUtils";
import {BUserViewDataMgr} from "../BUserViewDataMgr";
import {BUserMgr} from "../../../bsModule/buser/BUserMgr";
import {BUser} from "../../../bsModule/buser/apiData/BUser";
import {BUserVipRechargeData} from "../../../bsModule/buser/apiData/BUserVipRechargeData";
import {AppRouter} from "../../../comModule/AppRouter";
import {StoreMenuMgr} from "../../../bsModule/storeMenu/storeMenuMgr";
import {StoreMenu} from "../../../bsModule/storeMenu/data/StoreMenu";
import {BUserRole} from "../../../bsModule/buserRole/data/BuserRole";
import {BUserRoleMgr} from "../../../bsModule/buserRole/buserRoleMgr";
import {VipLevel} from "../../../bsModule/vipLevel/data/VipLevel";
import {VipLevelMgr} from "../../../bsModule/vipLevel/VipLevelMgr";
import {PageResp} from "../../../comModule/PageResp";
import {QueryVipLevelForm} from "../../../bsModule/vipLevel/apiData/QueryVipLevelForm";
import {BuserRoleUpdateInfoForm} from "../../../bsModule/buserRole/apiData/BuserRoleUpdateInfoForm";
import {VipLevelType} from "../../../bsModule/vipLevelType/data/VipLevelType";
import {QueryVipLevelTypeForm} from "../../../bsModule/vipLevelType/apiData/QueryVipLevelTypeForm";
import {VipLevelTypeMgr} from "../../../bsModule/vipLevelType/VipLevelTypeMgr";
import {Constants} from "../../common/Util/Constants";


@Component({
  selector:'',
  templateUrl:'./buserEdit.html',
  styleUrls:['./buserEdit.scss'],

})
export class BUserEditPage implements OnInit,OnDestroy {
  public viewDataSub: any;
  public paramsSub: any;
  public viewData: BUserEditViewData;
  public service: BUserEditService;
  public phone:string;
  public buserRole:number;
  public roleSet:Array<number>;

  public defaultTab:string;


  constructor(private buserMgr: BUserMgr,
              private buserViewDataMgr: BUserViewDataMgr,
              private storeMenuMgr:StoreMenuMgr,
              private buserRoleMgr:BUserRoleMgr,
              private vipLevelMgr:VipLevelMgr,
              private vipLevelTypeMgr: VipLevelTypeMgr,
              private cdRef: ChangeDetectorRef,
              public route: ActivatedRoute) {
    this.service = new BUserEditService(this.buserMgr,this.buserViewDataMgr,
                                        this.storeMenuMgr,this.buserRoleMgr,this.vipLevelMgr, this.vipLevelTypeMgr);
  }
  ngOnInit() {
    this.viewDataSub = this.buserViewDataMgr.subscribeBUserEditVD((viewDataP: BUserEditViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.paramsSub = this.route.queryParams.subscribe(params => {
      this.phone = params.phone;
      this.roleSet = params.roleSet;
      if(this.roleSet != null){
        this.buserRole = this.roleSet[0];
      }
      this.service.initViewData(this.phone);
    })
  }

  ngOnDestroy() {
    if(!AppUtils.isNullObj(this.paramsSub)){
      this.paramsSub.unsubscribe();  //取消订阅 防止内存泄露
    }
    if(!AppUtils.isNullObj(this.viewDataSub)){
      this.viewDataSub.unsubscribe();
    }
  }

  getPermSet(permSet){
    this.viewData.buserRole.vipContent.permSet = permSet;
  }

  /**
   * 选择等级分类时，二级联动
   */
  onSelectVipLevelTypeId(vipLevelTypeId){
    this.viewData.vipLevelListShow = this.service.filterVipLevelList(vipLevelTypeId, this.viewData.vipLevelList);
    this.buserViewDataMgr.setBUserEditViewData(this.viewData);
  }

  /**
   * 修改账号基本信息
   * @param buserId:number
   */
  public async editBUser(buserId:string){
    if(this.viewData.buser.roleSet[0]==2){
      this.handleResult(true);
    }else{
      let formData = new BUserVipRechargeData();
      formData.buserId = buserId;
      formData.vipType = this.viewData.buser.vipType;
      if(AppUtils.isNullObj(this.viewData.newExpiredTime)){
        formData.expiredTime = this.viewData.buser.expiredTime;
      }else{
        let newExpiredTime = this.viewData.newExpiredTime;
        let month = newExpiredTime.month-1;
        let time = new Date(newExpiredTime.year, month, newExpiredTime.day).getTime();
        formData.expiredTime = time;
      }
      let success = await this.service.editBUser(buserId,formData);
      this.handleResult(success);
    }
  }

  /**
   * 修改账号权限
   * @param buserId:number
   */
  public async updateBUserRole(buserId:string){
    if(this.viewData.buser.roleSet[0]==2){
      this.handleResult(true);
    }else{
      let formData = new BuserRoleUpdateInfoForm();
      AppUtils.copy(formData,this.viewData.buserRole.vipContent);
      let success = await this.service.updateBUserRole(buserId,formData);
      this.handleResult(success);
    }
  }

  /**
   * 处理结果
   */
  private handleResult(successP: boolean): void {
    if (successP) {
      AppUtils.showSuccess("提示","编辑成功");
      AppRouter.goBUserList(this.viewData.buser.phone);
    } else {
      AppUtils.showError("提示","编辑失败");
    }
  }
}

export class BUserEditViewData {
  buser: BUser = new BUser();
  newExpiredTime:any;
  buserVipLevelTypeId:number; //当前用户的等级分类id

  vipLevelList:Array<VipLevel> = new Array<VipLevel>(); //原始数据
  vipLevelListShow:Array<VipLevel> = new Array<VipLevel>(); //切换等级分类时显示的数据

  vipLevelTypeList:Array<VipLevelType> = new Array<VipLevelType>();

  storeMenu:StoreMenu = new StoreMenu();
  buserRole:BUserRole = new BUserRole();
  loadingFinish:boolean = false;
}

class BUserEditService {

  constructor(private buserMgr: BUserMgr,
              private buserViewDataMgr: BUserViewDataMgr,
              private storeMenuMgr:StoreMenuMgr,
              private buserRoleMgr:BUserRoleMgr,
              private vipLevelMgr:VipLevelMgr,
              private vipLevelTypeMgr: VipLevelTypeMgr) {
  }

  public initViewData(phone:string): void {

    this.buserViewDataMgr.setBUserEditViewData(new BUserEditViewData());

    this.buildViewData(phone).then((viewDataTmp:BUserEditViewData) => {
      this.handleViewData(viewDataTmp);
    }).catch(error => {
      AppUtils.handleError(error);
    });
  }

  public handleViewData(viewDataP: BUserEditViewData) {
    this.buserViewDataMgr.setBUserEditViewData(viewDataP);
  }

  public async buildViewData(phone:string):Promise<BUserEditViewData> {
    let viewDataTmp: BUserEditViewData = new BUserEditViewData();
    let buser: BUser = await this.buserMgr.findByPhone(phone);
    viewDataTmp.buser = buser;

    let queryVipLevelTypeForm:QueryVipLevelTypeForm = new QueryVipLevelTypeForm();
    queryVipLevelTypeForm.state = Constants.DEFAULT_STATE_VALUE;
    let queryVipLevelTypePageResp:PageResp = await this.vipLevelTypeMgr.getAllList(queryVipLevelTypeForm);
    viewDataTmp.vipLevelTypeList = queryVipLevelTypePageResp.list;

    let queryVipLevelForm:QueryVipLevelForm = new QueryVipLevelForm();
    queryVipLevelForm.state = Constants.DEFAULT_STATE_VALUE;
    let vipLevelPageResp:PageResp = await this.vipLevelMgr.getAllList(queryVipLevelForm);
    viewDataTmp.vipLevelList = vipLevelPageResp.list;

    viewDataTmp.vipLevelList.forEach((value, index, array)=>{
      if(buser.vipType == value.id){
        viewDataTmp.buserVipLevelTypeId = value.typeId;
      }
    });

    viewDataTmp.vipLevelListShow = this.filterVipLevelList(viewDataTmp.buserVipLevelTypeId, viewDataTmp.vipLevelList);

    viewDataTmp.buserRole = await this.buserRoleMgr.getBUserRole(buser.id);
    viewDataTmp.storeMenu = await this.storeMenuMgr.getStoreMenu();
    viewDataTmp.loadingFinish = true;
    return new Promise<BUserEditViewData>(resolve=>{
      resolve(viewDataTmp);
    });
  }

  /**
   * 通过等级分类id来过滤等级列表
   * @param vipLevelTypeId
   * @param {Array<VipLevel>} vipLevelList
   */
  public filterVipLevelList(vipLevelTypeId, vipLevelList:Array<VipLevel>): Array<VipLevel>{
    let vipLevelListShow = new Array<VipLevel>();
    vipLevelList.forEach((value, index, array)=>{
      if(vipLevelTypeId == value.typeId){
        vipLevelListShow.push(value);
      }
    });
    return vipLevelListShow;
  }

  /**
   *编辑
   *@param buserId:string
   *@param formData:BUserVipRechargeData
   *@returns Promise<boolean>
   */
  public editBUser(buserId:string, formData:BUserVipRechargeData):Promise<boolean>{

    return new Promise<boolean>(resolve =>{
      this.buserMgr.updateVipRecharge(buserId,formData).then(
        (success)=>{
          resolve(success);
        }
      )
    });
  }

  public updateBUserRole(buserId:string, formData:BuserRoleUpdateInfoForm):Promise<boolean>{
    return this.buserRoleMgr.updateInfo(buserId,formData);
  }
}
