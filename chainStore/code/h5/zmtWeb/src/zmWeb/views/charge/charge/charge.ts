import {Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy} from "@angular/core";
import {ChargeMgr} from "../../../bsModule/charge/ChargeMgr";
import {VipLevelMgr} from "../../../bsModule/vipLevel/VipLevelMgr";
import {ChargeViewDataMgr} from "../chargeViewDataMgr";
import {StoreVipLevelQueryForm} from "../../../bsModule/vipLevel/apiData/StoreVipLevelQueryForm";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {BUser} from "../../../bsModule/buser/apiData/BUser";
import {BUserSynDataHolder} from "../../../bsModule/buser/BUserSynDataHolder";
import {AppUtils} from "../../../comModule/AppUtils";
import {PageResp} from "../../../comModule/PageResp";
import {VipLevel} from "../../../bsModule/vipLevel/data/VipLevel";
import {GenericSelect} from "../../../comModule/bean/GenericSelect";
import {Constants} from "../../common/Util/Constants";
import {ChargeAddForm} from "../../../bsModule/charge/apiData/ChargeAddForm";
import {Charge} from "../../../bsModule/charge/data/Charge";
import {AppRouter} from "../../../comModule/AppRouter";
import {ChargeOriginEnum} from "../../../bsModule/charge/data/ChargeOriginEnum";
import {ChargeTypeEnum} from "../../../bsModule/charge/data/ChargeTypeEnum";
import {
  StoreAdminPermEnum,
  StorePermBuilder, PermItem
} from "../../../bsModule/storeClerkInfo/data/storeAdminRole/StoreAdminPermEnum";

@Component({
  selector:'vip-charge',
  templateUrl:'charge.html',
  styleUrls:['charge.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush,
})
export class ChargePage implements OnInit,OnDestroy{

  private viewDataSub:any;
  private service:ChargeService;
  public viewData:ChargeViewData;

  constructor(private chargeMgr:ChargeMgr,
              private vipLevelMgr:VipLevelMgr,
              private buserSynDataHolder:BUserSynDataHolder,
              private chargeViewDataMgr:ChargeViewDataMgr,
              private cdRef:ChangeDetectorRef){
      this.service = new ChargeService(this.chargeMgr,this.vipLevelMgr,this.buserSynDataHolder,this.chargeViewDataMgr);
  }

  ngOnInit(): void {
    this.viewDataSub = this.chargeViewDataMgr.subscribeChargeVD((viewDataP:ChargeViewData)=>{
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
   * 跳转续费升级记录
   */
  goHistory(){
    AppRouter.goChargeList();
  }

  /**
   * 选择会员等级
   * @param itemP
   */
  selectVipLevel(itemP:GenericSelect<VipLevel>){
    itemP.isSelected = true;
    this.viewData.vipLevelList.forEach((item:GenericSelect<VipLevel>)=>{
      if(itemP !== item){
        item.isSelected = false;
      }
    })
    this.viewData.selectedVipLevel = itemP.target;
  }

  /**
   * 特权列表
   * @returns {Array<PermItem>}
   */
  getPermList():Array<PermItem>{
    return this.viewData.selectedVipLevel.vipContent&&this.viewData.selectedVipLevel.vipContent.permSet?StorePermBuilder.getVipPermList(this.viewData.selectedVipLevel.vipContent.permSet):[];
  }

  /**
   * 支付金额
   * @returns {number}
   */
  getPay():number{
    return (this.viewData.selectedVipLevel.id == this.viewData.currentVipLevel.id)?this.viewData.selectedVipLevel.renewCharge/100:this.viewData.selectedVipLevel.openCharge/100;
  }

  /**
   * 获取应付金额
   * 剩余时长抵扣=(剩余到期时间-当前时间)/365天*当前等级的开通金额
   * 实付金额=订单金额-剩余时长抵扣
   */
  getMoney():number{
    let money:number = 0;
    if(!AppUtils.isNullObj(this.viewData.selectedVipLevel)){
      let expiredTime = parseInt(this.viewData.buser.expiredTime.toString());
      if((expiredTime == 0) || (this.viewData.selectedVipLevel.openCharge == 0)){
        money = this.viewData.selectedVipLevel.openCharge;
      }else{
        let currentTime = new Date().getTime();
        if(this.viewData.selectedVipLevel.id == this.viewData.currentVipLevel.id){//续费
          let renewCharge = this.viewData.selectedVipLevel.renewCharge/100;
          money = renewCharge>0?renewCharge - AppUtils.roundPoint((expiredTime - currentTime)/(365 * Constants.ONEDAY_TIMESTAMP) * renewCharge,2):0;
        }else{//升级
          let curOpenCharge = this.viewData.currentVipLevel.openCharge/100;
          let openCharge = this.viewData.selectedVipLevel.openCharge/100;
          money = openCharge>0?openCharge - AppUtils.roundPoint((expiredTime - currentTime)/(365 * Constants.ONEDAY_TIMESTAMP) * curOpenCharge,2):0;
        }
      }
    }
    return money>0?AppUtils.roundPoint(money,2):0;
  }

  /**
   * 获取剩余时间抵扣金额
   * 剩余时长抵扣=(剩余到期时间-当前时间)/365天*当前等级的开通金额
   */
  getOffsetAmount():number{
    let money:number = 0;
    if(!AppUtils.isNullObj(this.viewData.selectedVipLevel)){
      let expiredTime = parseInt(this.viewData.buser.expiredTime.toString());
      let currentTime = new Date().getTime();
      if((expiredTime > 0) && (expiredTime > currentTime)){
        if(this.viewData.selectedVipLevel.id == this.viewData.currentVipLevel.id){//续费
          let renewCharge = this.viewData.selectedVipLevel.renewCharge/100;
          money = renewCharge>0?AppUtils.roundPoint((expiredTime - currentTime)/(365 * Constants.ONEDAY_TIMESTAMP) * renewCharge,2):0;
        }else{//升级
          let curOpenCharge = this.viewData.currentVipLevel.openCharge/100;
          let openCharge = this.viewData.selectedVipLevel.openCharge/100;
          money = openCharge>0?AppUtils.roundPoint((expiredTime - currentTime)/(365 * Constants.ONEDAY_TIMESTAMP) * curOpenCharge,2):0;
        }
      }
    }
    return money>0?AppUtils.roundPoint(money,2):0;
  }

  /**
   * 获取到期时间
   * @returns {number}
   */
  getExpiredTime():number{
    return new Date().getTime() + 365 * Constants.ONEDAY_TIMESTAMP;
  }

  /**
   * 添加charge记录
   */
  addCharge(){
    let chargeAddForm = new ChargeAddForm();
    chargeAddForm.buserId = this.viewData.buser.id;
    chargeAddForm.phone = this.viewData.buser.phone;
    chargeAddForm.name = this.viewData.buser.name;
    chargeAddForm.vipLevelId = this.viewData.selectedVipLevel.id;
    chargeAddForm.vipLevelName = this.viewData.selectedVipLevel.name;
    chargeAddForm.expiredTime = this.getExpiredTime();
    chargeAddForm.origin = ChargeOriginEnum.StoreMS;
    chargeAddForm.offsetAmount = parseInt((this.getOffsetAmount()*100).toString());
    chargeAddForm.discountAmount = 0;
    chargeAddForm.validPeriod = this.viewData.selectedVipLevel.validPeriod;
    chargeAddForm.validPeriodUnit = this.viewData.selectedVipLevel.validPeriodUnit;
    chargeAddForm.chargeType = this.viewData.selectedVipLevel.id == this.viewData.currentVipLevel.id?ChargeTypeEnum.RENEW:ChargeTypeEnum.UPGRADE;
    this.service.addCharge(chargeAddForm).then((charge:Charge)=>{
      if(!AppUtils.isNullObj(charge)){
        AppUtils.showSuccess("提示","提交成功");
        AppRouter.goChargePay(charge.id);
      }else{
        AppUtils.showError("提示","提交失败");
      }
    })
  }

}

export class ChargeService{
  constructor(private chargeMgr:ChargeMgr,
              private vipLevelMgr:VipLevelMgr,
              private buserSynDataHolder:BUserSynDataHolder,
              private chargeViewDataMgr:ChargeViewDataMgr,){}

  public initViewData(){
    let viewDataTmp = new ChargeViewData();
    this.chargeViewDataMgr.setChargeViewData(viewDataTmp);

    this.buildViewData();
  }

  private async buildViewData() {
    let viewDataTmp = new ChargeViewData();

    let buserId = SessionUtil.getInstance().getUserId();
    let buser:BUser = await this.buserSynDataHolder.getData(buserId);
    if(!AppUtils.isNullObj(buser)){
      viewDataTmp.buser = buser;

      let storeVipLevelQueryForm = new StoreVipLevelQueryForm();
      storeVipLevelQueryForm.vipType = buser.vipType;
      let pageResp:PageResp = await this.vipLevelMgr.findPage(storeVipLevelQueryForm);
      if(!AppUtils.isNullObj(pageResp)){
        viewDataTmp.vipLevelList = GenericSelect.fromList(pageResp.list);;
        for(let i=0;i<viewDataTmp.vipLevelList.length;i++){
          let item = viewDataTmp.vipLevelList[i];
          if(item.target.id == buser.vipType){
            item.isSelected = true;
            viewDataTmp.selectedVipLevel = item.target;
            viewDataTmp.currentVipLevel = item.target;
            break;
          }
        }
      }
    }
    this.chargeViewDataMgr.setChargeViewData(viewDataTmp);
  }

  /**
   * 添加续费升级
   * @param chargeAddForm
   * @returns {Promise<Charge>}
   */
  public addCharge(chargeAddForm:ChargeAddForm):Promise<Charge>{
    return this.chargeMgr.addCharge(chargeAddForm);
  }

}

export class ChargeViewData{
  public buser:BUser;
  public vipLevelList:Array<GenericSelect<VipLevel>> = new Array<GenericSelect<VipLevel>>();
  public selectedVipLevel: VipLevel;//选中的等级
  public currentVipLevel: VipLevel;//当前等级
  public upgrade:boolean = false;//升级
}
