import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {UserPermData} from "../../../comModule/session/SessionData";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {AppRouter} from "../../../comModule/AppRouter";
import {AppUtils} from "../../../comModule/AppUtils";
import {GuideViewDataMgr} from "../guideViewDataMgr";
import {AddLeaguerFromPageFlag} from "../../../comModule/enum/AddLeaguerFromPageFlag";

/**
 * 店务指引流程页面
 */
@Component({
  selector: 'guide',
  templateUrl: 'guide.html',
  styleUrls: ['guide.scss'],

})
export class GuidePage implements OnInit {

  public viewData: GuideViewData;
  private service: GuideService;

  constructor(private cdRef: ChangeDetectorRef) {
    this.service = new GuideService();
  }

  selectItem(index): void {
    SessionUtil.getInstance().setIndex(index);
    this.service.initViewData();
  }

  ngOnInit() {
    GuideViewDataMgr.getInstance().onDataChanged(new GuideViewData(),(viewDataTmp: GuideViewData)=>{
      this.viewData = viewDataTmp;
      this.cdRef.markForCheck();
    });
    GuideViewDataMgr.getInstance().onInformDataChanged(( )=>{
      this.service.initViewData();
    });
    this.service.initViewData();

  }

  goClerkManage(){
    let storeId = SessionUtil.getInstance().getStoreId();
    if(!AppUtils.isNullOrWhiteSpace(storeId)){
      if(this.viewData.buserPermData.isClerkAdmin){
        AppRouter.goFindClerk(0);
      }else{
        AppUtils.showWarn("提示","抱歉，您没有该权限");
      }
    }else{
      AppUtils.showWarn("提示","暂无店铺");
    }
  }

  goAddClerk(){
    let storeId = SessionUtil.getInstance().getStoreId();
    if(!AppUtils.isNullOrWhiteSpace(storeId)){
      if(this.viewData.buserPermData.isClerkAdmin){
        AppRouter.goAddClerk();
      }else{
        AppUtils.showWarn("提示","抱歉，您没有该权限");
      }
    }else{
      AppUtils.showWarn("提示","暂无店铺");
    }
  }

  goLeaguerManage(){
    let storeId = SessionUtil.getInstance().getStoreId();
    if(!AppUtils.isNullOrWhiteSpace(storeId)){
      if(this.viewData.buserPermData.isLeaguerAdmin){
        AppRouter.goFindLeaguer();
      }else{
        AppUtils.showWarn("提示","抱歉，您没有该权限");
      }
    }else{
      AppUtils.showWarn("提示","暂无店铺");
    }
  }

  goAddLeaguer(){
    let storeId = SessionUtil.getInstance().getStoreId();
    if(!AppUtils.isNullOrWhiteSpace(storeId)){
      if(this.viewData.buserPermData.isLeaguerAdmin){
        AppRouter.goAddLeaguer(AddLeaguerFromPageFlag.FROM_GUIDE);
      }else{
        AppUtils.showWarn("提示","抱歉，您没有该权限");
      }
    }else{
      AppUtils.showWarn("提示","暂无店铺");
    }
  }

  goProductManage(){
    let storeId = SessionUtil.getInstance().getStoreId();
    if(!AppUtils.isNullOrWhiteSpace(storeId)){
      if(this.viewData.buserPermData.isProductAdmin){
        AppRouter.goProductInfoList();
      }else{
        AppUtils.showWarn("提示","抱歉，您没有该权限");
      }
    }else{
      AppUtils.showWarn("提示","暂无店铺");
    }
  }

  goAddProduct(){
    let storeId = SessionUtil.getInstance().getStoreId();
    if(!AppUtils.isNullOrWhiteSpace(storeId)){
      if(this.viewData.buserPermData.isProductAdmin){
        AppRouter.goAddProductInfo();
      }else{
        AppUtils.showWarn("提示","抱歉，您没有该权限");
      }
    }else{
      AppUtils.showWarn("提示","暂无店铺");
    }
  }

  goGoodsManage(){
    let storeId = SessionUtil.getInstance().getStoreId();
    if(!AppUtils.isNullOrWhiteSpace(storeId)){
      if(this.viewData.buserPermData.isGoodsAdmin){
        AppRouter.goStoreGoodsList();
      }else{
        AppUtils.showWarn("提示","抱歉，您没有该权限");
      }
    }else{
      AppUtils.showWarn("提示","暂无店铺");
    }
  }

  goAddGoods(){
    let storeId = SessionUtil.getInstance().getStoreId();
    if(!AppUtils.isNullOrWhiteSpace(storeId)){
      if(this.viewData.buserPermData.isGoodsAdmin){
        AppRouter.goAddStoreGoods();
      }else{
        AppUtils.showWarn("提示","抱歉，您没有该权限");
      }
    }else{
      AppUtils.showWarn("提示","暂无店铺");
    }
  }
// 添加套餐
goAddPackage(){
  let storeId = SessionUtil.getInstance().getStoreId();
  if(!AppUtils.isNullOrWhiteSpace(storeId)){
    if(this.viewData.buserPermData.isGoodsAdmin){
      AppRouter.goAddPackageProject();
    }else{
      AppUtils.showWarn("提示","抱歉，您没有该权限");
    }
  }else{
    AppUtils.showWarn("提示","暂无店铺");
  }
}
// 套餐管理
goPackageManage(){
  let storeId = SessionUtil.getInstance().getStoreId();
  if(!AppUtils.isNullOrWhiteSpace(storeId)){
    if(this.viewData.buserPermData.isGoodsAdmin){
      AppRouter.goPackageList();
    }else{
      AppUtils.showWarn("提示","抱歉，您没有该权限");
    }
  }else{
    AppUtils.showWarn("提示","暂无店铺");
  }
}


  goProductCardManage(){
    let storeId = SessionUtil.getInstance().getStoreId();
    if(!AppUtils.isNullOrWhiteSpace(storeId)){
      if(this.viewData.buserPermData.isCardAdmin){
        AppRouter.goProductCardList();
      }else{
        AppUtils.showWarn("提示","抱歉，您没有该权限");
      }
    }else{
      AppUtils.showWarn("提示","暂无店铺");
    }
  }

  goAddProductCard(){
    let storeId = SessionUtil.getInstance().getStoreId();
    if(!AppUtils.isNullOrWhiteSpace(storeId)){
      if(this.viewData.buserPermData.isCardAdmin){
        AppRouter.goAddProductCard();
      }else{
        AppUtils.showWarn("提示","抱歉，您没有该权限");
      }
    }else{
      AppUtils.showWarn("提示","暂无店铺");
    }
  }
  goMemcardCardManage(){
    let storeId = SessionUtil.getInstance().getStoreId();
    if(!AppUtils.isNullOrWhiteSpace(storeId)){
      if(this.viewData.buserPermData.isCardAdmin){
        AppRouter.goMemberCardList();
      }else{
        AppUtils.showWarn("提示","抱歉，您没有该权限");
      }
    }else{
      AppUtils.showWarn("提示","暂无店铺");
    }
  }

  goAddMemberCard(){
    let storeId = SessionUtil.getInstance().getStoreId();
    if(!AppUtils.isNullOrWhiteSpace(storeId)){
      if(this.viewData.buserPermData.isCardAdmin){
        AppRouter.goAddMemberCard();
      }else{
        AppUtils.showWarn("提示","抱歉，您没有该权限");
      }
    }else{
      AppUtils.showWarn("提示","暂无店铺");
    }
  }

  goAppointManage(){
    let storeId = SessionUtil.getInstance().getStoreId();
    if(!AppUtils.isNullOrWhiteSpace(storeId)){
      if(this.viewData.buserPermData.isAppointmentAdmin){
        AppRouter.goAppointmentList();
      }else{
        AppUtils.showWarn("提示","抱歉，您没有该权限");
      }
    }else{
      AppUtils.showWarn("提示","暂无店铺");
    }
  }

  goAddAppoint(){
    let storeId = SessionUtil.getInstance().getStoreId();
    if(!AppUtils.isNullOrWhiteSpace(storeId)){
      if(this.viewData.buserPermData.isAppointmentAdmin){
        AppRouter.goAddAppointment();
      }else{
        AppUtils.showWarn("提示","抱歉，您没有该权限");
      }
    }else{
      AppUtils.showWarn("提示","暂无店铺");
    }
  }

  goPurchase(){
    let storeId = SessionUtil.getInstance().getStoreId();
    if(!AppUtils.isNullOrWhiteSpace(storeId)){
      if(this.viewData.buserPermData.isPurchaseAdmin){
        AppRouter.goConsume(0);
      }else{
        AppUtils.showWarn("提示","抱歉，您没有该权限");
      }
    }else{
      AppUtils.showWarn("提示","暂无店铺");
    }
  }

  goRecharge(){
    let storeId = SessionUtil.getInstance().getStoreId();
    if(!AppUtils.isNullOrWhiteSpace(storeId)){
      if(this.viewData.buserPermData.isRechargeAdmin){
        AppRouter.goRecharge(0);
      }else{
        AppUtils.showWarn("提示","抱歉，您没有该权限");
      }
    }else{
      AppUtils.showWarn("提示","暂无店铺");
    }
  }



}

export class GuideViewData {
  buserPermData: UserPermData = new UserPermData();
  index:number;
}

export class GuideService {

  public initViewData() {
    let viewDataTmp = new GuideViewData();
    viewDataTmp.index = SessionUtil.getInstance().getIndex();
    viewDataTmp.buserPermData = SessionUtil.getInstance().getUserPermData();
    GuideViewDataMgr.getInstance().setData(viewDataTmp);
  }

}
