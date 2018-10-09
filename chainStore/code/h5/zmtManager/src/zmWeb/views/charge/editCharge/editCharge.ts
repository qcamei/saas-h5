import {Component, ChangeDetectionStrategy, OnInit, OnDestroy, ChangeDetectorRef} from "@angular/core";
import {Charge} from "../../../bsModule/charge/data/Charge";
import {BUser} from "../../../bsModule/buser/apiData/BUser";
import {SelectItem} from "../../zmComp/form/ZmSelect";
import {VipLevel} from "../../../bsModule/vipLevel/data/VipLevel";
import {AppUtils} from "../../../comModule/AppUtils";
import {PageResp} from "../../../comModule/PageResp";
import {QueryVipLevelForm} from "../../../bsModule/vipLevel/apiData/QueryVipLevelForm";
import {ChargeMgr} from "../../../bsModule/charge/ChargeMgr";
import {VipLevelMgr} from "../../../bsModule/vipLevel/VipLevelMgr";
import {ChargeViewDataMgr} from "../ChargeViewDataMgr";
import {AppRouter} from "../../../comModule/AppRouter";
import {ChargeUpdateInfoForm} from "../../../bsModule/charge/apiData/ChargeUpdateInfoForm";
import {ActivatedRoute} from "@angular/router";
import {ChargeUpdatePayInfoForm} from "../../../bsModule/charge/apiData/ChargeUpdatePayInfoForm";
import {ChargePayItem} from "../../../bsModule/charge/data/ChargePayItem";

@Component({
  selector: 'edit-charge',
  templateUrl: 'editCharge.html',
  styles:[`
  
  .fz-16{
    font-size: 16px;
  } 
  
  .cur-hand{
    cursor: pointer;
  } 
  
  .pos-a{
    position: absolute;
  }
  .pos-r{
    position: relative;
  } 
  
  .dib{
    display: inline-block;
  } 
   
  .nameDiv {
    display: inline-block;
    width: 200px;
    border: 1px solid #ced4da;
    border-radius: 6px;
    // padding: 8px 10px;
    padding-left:15px;
    height:35px;
    line-height: 31px;
    position: relative;
  }

  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditChargePage implements OnInit,OnDestroy {
  private paramsSub:any;
  private viewDataSub:any;
  private service:EditChargeService;
  public viewData:EditChargeViewData;

  constructor(private chargeMgr:ChargeMgr,
              private vipLevelMgr:VipLevelMgr,
              private chargeViewDataMgr:ChargeViewDataMgr,
              private route:ActivatedRoute,
              private cdRef:ChangeDetectorRef) {
    this.service = new EditChargeService(this.chargeMgr,this.vipLevelMgr,this.chargeViewDataMgr);
  }

  ngOnInit() {
    this.viewDataSub = this.chargeViewDataMgr.subscribeEditChargeVD((viewDataP:EditChargeViewData)=>{
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    })
    this.paramsSub = this.route.params.subscribe(params => {
      let chargeId = params['chargeId'];
      this.service.initViewData(chargeId);
    });
  }

  ngOnDestroy() {
    if(!AppUtils.isNullObj(this.viewDataSub)){
      this.viewDataSub.unsubscribe();
    }
  }

  /**
   * 编辑收费
   */
  updateCharge(){
    if(AppUtils.isNullOrWhiteSpace(this.viewData.charge.buserId)){
      AppUtils.showWarn("提示","请选择商户");
    }else if(AppUtils.isNullObj(this.viewData.money) || (this.viewData.money <= 0)){
      AppUtils.showWarn("提示","请输入有效的收费金额");
    }
    // else if(AppUtils.isNullOrWhiteSpace(this.viewData.citySetting.join("/"))){
    //   AppUtils.showWarn("提示","请选择区域");
    // }
    else{
      let chargeUpdateInfoForm = this.buildUpdateForm();
      this.service.updateChargeInfo(this.viewData.charge.id,chargeUpdateInfoForm).then((success:boolean)=>{
        if(success){
          AppUtils.showSuccess("提示","编辑成功");
          AppRouter.goChargeList();
        }else{
          AppUtils.showError("提示","编辑失败");
        }
      })
    }
  }

  private buildUpdateForm() :ChargeUpdateInfoForm{
    let chargeUpdateInfoForm:ChargeUpdateInfoForm = this.viewData.chargeUpdateInfoForm;
    chargeUpdateInfoForm.id = this.viewData.charge.id;
    chargeUpdateInfoForm.buserId = this.viewData.charge.buserId;
    chargeUpdateInfoForm.name = this.viewData.charge.name;
    chargeUpdateInfoForm.phone = this.viewData.charge.phone;
    chargeUpdateInfoForm.vipLevelId = this.viewData.charge.vipLevelId;
    chargeUpdateInfoForm.agencyArea = this.viewData.citySetting.join("/");
    chargeUpdateInfoForm.agencyPhone = this.viewData.charge.agencyPhone;
    chargeUpdateInfoForm.agencyName = this.viewData.charge.agencyName;
    chargeUpdateInfoForm.remark = this.viewData.charge.remark;
    chargeUpdateInfoForm.expiredTime = this.getExpiredTime()==0?this.viewData.charge.expiredTime:this.getExpiredTime();

    let chargePayItem = new ChargePayItem();
    chargePayItem.cost = AppUtils.moneyY2F(this.viewData.money);
    chargePayItem.payType = this.viewData.chargeChannel;
    chargeUpdateInfoForm.payItems.push(chargePayItem);

    return chargeUpdateInfoForm;
  }

  /**
   * 获取过期时间
   * @returns {number}
   */
  private getExpiredTime():number {
    let expiredTime = 0;
    if (this.viewData.expiredTime) {
      let arrTmp = [this.viewData.expiredTime.year, this.viewData.expiredTime.month, this.viewData.expiredTime.day];
      let date = new Date(arrTmp.join("/"));
      expiredTime = date.getTime();
    }
    return expiredTime;
  }
}

export class EditChargeService{
  constructor(private chargeMgr:ChargeMgr,
              private vipLevelMgr:VipLevelMgr,
              private chargeViewDataMgr:ChargeViewDataMgr){}

  public initViewData(chargeId:string){
    let viewDataTmp = new EditChargeViewData();
    this.chargeViewDataMgr.setEditChargeViewData(viewDataTmp);

    this.buildViewData(chargeId);
  }

  public async buildViewData(id:string){
    let viewDataTmp = new EditChargeViewData();

    let charge:Charge = await this.chargeMgr.get(id);
    if(!AppUtils.isNullObj(charge)){
      viewDataTmp.charge = charge;
      viewDataTmp.citySetting = charge.agencyArea?charge.agencyArea.split("/"):[];

      if(charge.payItems && charge.payItems.length > 0) {
        let chargePayItem = charge.payItems[0];
        viewDataTmp.chargeChannel = chargePayItem.payType;
        viewDataTmp.money = AppUtils.moneyF2Y(chargePayItem.cost);
      }

      let queryVipLevelForm:QueryVipLevelForm = new QueryVipLevelForm();
      queryVipLevelForm.pageNo = 1;
      queryVipLevelForm.pageItemCount = 0;
      let pageResp:PageResp = await this.vipLevelMgr.getPage(queryVipLevelForm);
      if(!AppUtils.isNullObj(pageResp)) {
        viewDataTmp.vipSelectList = pageResp.list.map((item:VipLevel)=>{
          return new SelectItem(item.name,item.id);
        });
      }
    }

    this.chargeViewDataMgr.setEditChargeViewData(viewDataTmp);
  }

  public updateChargeInfo(id:string,chargeUpdateInfoForm:ChargeUpdateInfoForm):Promise<boolean>{
    return this.chargeMgr.updateChargeInfo(id,chargeUpdateInfoForm);
  }

}

export class EditChargeViewData{
  public chargeUpdateInfoForm:ChargeUpdateInfoForm = new ChargeUpdateInfoForm();
  public citySetting:string[] = [];
  public expiredTime:any;

  public chargeChannel:number; //收费渠道
  public money: number; //收费金额

  public charge:Charge;
  public buser:BUser;
  public vipSelectList:Array<SelectItem> = new Array<SelectItem>();

}

