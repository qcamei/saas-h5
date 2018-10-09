import {Component, ChangeDetectionStrategy, OnInit, OnDestroy, ChangeDetectorRef} from "@angular/core";
import {ChargeMgr} from "../../../bsModule/charge/ChargeMgr";
import {ChargeViewDataMgr} from "../ChargeViewDataMgr";
import {AppUtils} from "../../../comModule/AppUtils";
import {ChargeAddForm} from "../../../bsModule/charge/apiData/ChargeAddForm";
import {Charge} from "../../../bsModule/charge/data/Charge";
import {AppRouter} from "../../../comModule/AppRouter";
import {VipLevelMgr} from "../../../bsModule/vipLevel/VipLevelMgr";
import {PageResp} from "../../../comModule/PageResp";
import {QueryVipLevelForm} from "../../../bsModule/vipLevel/apiData/QueryVipLevelForm";
import {VipLevel} from "../../../bsModule/vipLevel/data/VipLevel";
import {SelectItem} from "../../zmComp/form/ZmSelect";
import {BUser} from "../../../bsModule/buser/apiData/BUser";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {SelectBuserPopup} from "./selectBuserPopup";
import {ChargePayItem} from "../../../bsModule/charge/data/ChargePayItem";
import {ChargeTypeEnum} from "../../../bsModule/charge/data/ChargeTypeEnum";


@Component({
  selector: 'add-charge',
  templateUrl: 'addCharge.html',
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
export class AddChargePage implements OnInit,OnDestroy {

  private viewDataSub:any;
  private service:AddChargeService;
  public viewData:AddChargeViewData;

  constructor(private chargeMgr:ChargeMgr,
              private vipLevelMgr:VipLevelMgr,
              private chargeViewDataMgr:ChargeViewDataMgr,
              private modalService: NgbModal,
              private cdRef:ChangeDetectorRef) {
    this.service = new AddChargeService(this.chargeMgr,this.vipLevelMgr,this.chargeViewDataMgr);
  }

  ngOnInit() {
    this.viewDataSub = this.chargeViewDataMgr.subscribeAddChargeVD((viewDataP:AddChargeViewData)=>{
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    })
    this.service.initViewData();
  }

  ngOnDestroy() {
    if(!AppUtils.isNullObj(this.viewDataSub)){
      this.viewDataSub.unsubscribe();
    }
  }

  /**
   * 选择商户弹框
   */
  selectBuser(){
    const activeModal = this.modalService.open(SelectBuserPopup);
    activeModal.componentInstance.action = (buserP:BUser)=>{
      this.viewData.buser = buserP;
      this.service.buildViewData(this.viewData);
    };
  }

  /**
   * 添加收费
   */
  addCharge(){

    if(AppUtils.isNullObj(this.viewData.buser) || AppUtils.isNullOrWhiteSpace(this.viewData.buser.id)){
      AppUtils.showWarn("提示","请选择商户");
    }else if(AppUtils.isNullObj(this.viewData.money) || (this.viewData.money <= 0)){
      AppUtils.showWarn("提示","请输入有效的收费金额");
    }else if(AppUtils.isNullOrWhiteSpace(this.viewData.chargeAddForm.remark)){
      AppUtils.showWarn("提示","请输入备注");
    }
    // else if(AppUtils.isNullOrWhiteSpace(this.viewData.citySetting.join("/"))){
    //   AppUtils.showWarn("提示","请选择区域");
    // }
    else{
      let chargeAddForm = this.buildAddForm();

      this.service.addCharge(chargeAddForm).then((charge:Charge)=>{
        if(!AppUtils.isNullObj(charge)){
          AppUtils.showSuccess("提示","保存成功");
          AppRouter.goChargeList();
        }else{
          AppUtils.showError("提示","保存失败");
        }
      })
    }
  }

  private buildAddForm():ChargeAddForm{
    let chargeAddForm = this.viewData.chargeAddForm;
    chargeAddForm.buserId = this.viewData.buser.id;
    chargeAddForm.name = this.viewData.buser.name;
    chargeAddForm.phone = this.viewData.buser.phone;
    chargeAddForm.vipLevelId = this.viewData.buser.vipType;
    chargeAddForm.agencyArea = this.viewData.citySetting.join("/");
    chargeAddForm.expiredTime = this.getExpiredTime();
    chargeAddForm.chargeType = ChargeTypeEnum.NORMAL;

    let chargePayItem = new ChargePayItem();
    chargePayItem.cost = AppUtils.moneyY2F(this.viewData.money);
    chargePayItem.payType = this.viewData.chargeChannel;
    chargeAddForm.payItems.push(chargePayItem);

    return chargeAddForm;
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

export class AddChargeService{
  constructor(private chargeMgr:ChargeMgr,
              private vipLevelMgr:VipLevelMgr,
              private chargeViewDataMgr:ChargeViewDataMgr){}

  public initViewData(){
    let viewDataTmp = new AddChargeViewData();
    this.chargeViewDataMgr.setAddChargeViewData(viewDataTmp);
  }

  public async buildViewData(viewDataTmp:AddChargeViewData){
    let queryVipLevelForm:QueryVipLevelForm = new QueryVipLevelForm();
    queryVipLevelForm.pageNo = 1;
    queryVipLevelForm.pageItemCount = 0;
    let pageResp:PageResp = await this.vipLevelMgr.getPage(queryVipLevelForm);
    if(!AppUtils.isNullObj(pageResp)) {
      viewDataTmp.vipSelectList = pageResp.list.map((item:VipLevel)=>{
        return new SelectItem(item.name,item.id);
      });
    }
    this.chargeViewDataMgr.setAddChargeViewData(viewDataTmp);
  }

  public addCharge(chargeAddForm):Promise<Charge>{
    return this.chargeMgr.addCharge(chargeAddForm);
  }

}

export class AddChargeViewData{
  public chargeAddForm:ChargeAddForm = new ChargeAddForm();
  public citySetting:string[] = [];
  public expiredTime:any;

  public chargeChannel:number;
  public money: number;

  str:string="";

  public buser:BUser;
  public vipSelectList:Array<SelectItem> = new Array<SelectItem>();
  public vipLevel:number;

  constructor(){
  }
}
