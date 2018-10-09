import {Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy}from "@angular/core";
import {BUserMgr} from "../../../bsModule/buser/BUserMgr";
import {BUserViewDataMgr} from "../BUserViewDataMgr";
import {BUser} from "../../../bsModule/buser/apiData/BUser";
import {AppUtils} from "../../../comModule/AppUtils";
import {QueryVipLevelForm} from "../../../bsModule/vipLevel/apiData/QueryVipLevelForm";
import {PageResp} from "../../../comModule/PageResp";
import {VipLevelMgr} from "../../../bsModule/vipLevel/VipLevelMgr";
import {VipLevel} from "../../../bsModule/vipLevel/data/VipLevel";
import {VipLevelType} from "../../../bsModule/vipLevelType/data/VipLevelType";
import {QueryVipLevelTypeForm} from "../../../bsModule/vipLevelType/apiData/QueryVipLevelTypeForm";
import {VipLevelTypeStateEnum} from "../../../bsModule/vipLevelType/data/VipLevelTypeStateEnum";
import {VipLevelTypeMgr} from "../../../bsModule/vipLevelType/VipLevelTypeMgr";
import {ActivatedRoute} from "@angular/router";
import {Constants} from "../../common/Util/Constants";

/**账号管理列表**/


@Component({
  selector: '',
  templateUrl: 'buserList.html',
  styleUrls: ['buserList.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class BUserListPage implements OnInit,OnDestroy {
  private service: BUserListService;
  public  viewData: BUserListViewData;
  private viewDataSub: any;

  constructor(private buserMgr: BUserMgr,
              private buserViewDataMgr: BUserViewDataMgr,
              private vipLevelMgr:VipLevelMgr,
              private vipLevelTypeMgr: VipLevelTypeMgr,
              private cdRef: ChangeDetectorRef,
              private route:ActivatedRoute) {
    this.service = new BUserListService(this.buserMgr, this.buserViewDataMgr,this.vipLevelMgr,this.vipLevelTypeMgr);
  }


  ngOnInit() {

    this.viewDataSub = this.buserViewDataMgr.subscribeBUserListVD((viewDataP: BUserListViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });

    let phone='';
    this.route.params.subscribe((params) =>{
      phone = params["phone"];
    });

    this.service.initViewData(phone);
  }

  ngOnDestroy() {
    if(!AppUtils.isNullObj(this.viewDataSub)){
      this.viewDataSub.unsubscribe();
    }

  }


  handleResult(viewDataP:BUserListViewData){
    this.buserViewDataMgr.setBUserListViewData(viewDataP);
  }

  /**
   * 搜索框回车键按下事件
   * @param event
   */
  onKeyPress(event){
    let keyCode=event.keyCode;
    if(keyCode === 13) this.getListByReq();
  }

  /**
   * 查询
   */
  getListByReq() {
    if(AppUtils.isNullOrWhiteSpace(this.viewData.phone)){
      this.resetList();
      return;
    }
    this.viewData.phone = AppUtils.trimBlank(this.viewData.phone);
    if(AppUtils.isNullOrWhiteSpace(this.viewData.phone)
      || !this.isPhoneAvailable(this.viewData.phone)) {
      this.resetList();
      return;
    }
    this.service.getListByReq(this.viewData,(allDeviceListTmp)=>{
      this.handleResult(allDeviceListTmp);
    });

  }

  resetList(){
    this.viewData.buserList = null;
    this.viewData.loadingFinish = true;
  }

  isPhoneAvailable(phoneNumber :string): boolean {
    let myReg = /^\d+$/; //是数字即可，兼容国外电话号码和手机号
    if (!myReg.test(phoneNumber)) {
      return false;
    } else {
      return true;
    }
  }

}

export class BUserListViewData {
  vipLevelList:Array<VipLevel> = new Array<VipLevel>();
  vipLevelTypeList:Array<VipLevelType> = new Array<VipLevelType>();

  // buserList: Array<BUser> = new Array<BUser>(); //原始数据
  buserList: Array<BUserVD> = new Array<BUserVD>(); //原始数据

  // buser: BUser = new BUser();

  //查询参数
  phone:string;

  recordCount:number;//总记录数
  currentPage:number; //当前页号
  loadingFinish:boolean = false;
}

export class BUserVD {

  id: string;
  name: string;
  phone: string;
  password: string;
  headImg: string;
  gender: number;
  age: number;
  salt: string;
  storeIdSet: Array<string>;
  createdTime: string;
  lastUpdateTime: string;
  ver: number;
  state: number;
  roleSet: Array<number>;

  vipType:number;//会员等级
  vipLevelTypeId: number; //等级分类id
  expiredTime:number;//会员到期时间
  businessPhone:number;//商务手机

  public static from(buser:BUser): BUserVD{
    let buserVD: BUserVD = new BUserVD();
    AppUtils.copy(buserVD, buser);
    return buserVD;
  }

}

class BUserListService {

  constructor(private buserMgr: BUserMgr,
              private buserViewDataMgr: BUserViewDataMgr,
              private vipLevelMgr:VipLevelMgr,
              private vipLevelTypeMgr: VipLevelTypeMgr,) {
  }

  public initViewData(phone) :void{
    debugger
    let initViewData = new BUserListViewData();
    this.buserViewDataMgr.setBUserListViewData(initViewData);
    if(!AppUtils.isNullOrWhiteSpace(phone)&& phone > 0){
      initViewData.phone = phone;
      this.getListByReq(initViewData, (viewDataTmp)=>{
        this.buserViewDataMgr.setBUserListViewData(viewDataTmp);
      })
    }
  }

  /**
   * 根据条件查询
   *
   */
  public async getListByReq(viewData:BUserListViewData,handleCallBack:(viewDataTmp:BUserListViewData)=>void){
    let viewDataTmp: BUserListViewData = new BUserListViewData();
    viewDataTmp.phone = viewData.phone;

    let queryForm:QueryVipLevelForm = new QueryVipLevelForm();
    let pageResp:PageResp = await this.vipLevelMgr.getAllList(queryForm);
    viewDataTmp.vipLevelList = pageResp.list;

    let queryVipLevelTypeForm:QueryVipLevelTypeForm = new QueryVipLevelTypeForm();
    queryVipLevelTypeForm.state = Constants.DEFAULT_STATE_VALUE;
    let queryVipLevelTypePageResp:PageResp = await this.vipLevelTypeMgr.getAllList(queryVipLevelTypeForm);
    viewDataTmp.vipLevelTypeList = queryVipLevelTypePageResp.list;

    let buser = await this.buserMgr.findByPhone(viewDataTmp.phone);
    if(buser){
      let buserVD = BUserVD.from(buser);
      viewDataTmp.vipLevelList.forEach((value, index, array)=>{
        if(buserVD.vipType == value.id){
          buserVD.vipLevelTypeId = value.typeId;
        }
      });
      viewDataTmp.buserList[0] = buserVD;
    }

    viewDataTmp.currentPage = 1;
    viewDataTmp.loadingFinish = true;
    handleCallBack(viewDataTmp);

  };

}


