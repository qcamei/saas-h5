import {Component, ChangeDetectionStrategy, ChangeDetectorRef} from "@angular/core";
import {IonicPage, NavParams} from "ionic-angular";
import {LeaguerDetailViewDataMgr} from "./LeaguerDetailViewDataMgr";
import {AppRouter} from "../../zmComUtils/AppRouter";
import {LeaguerDetailMgr} from "../../../bsModule/leaguerDetail/LeaguerDetailMgr";
import {LeaguerDetail} from "../../../bsModule/leaguerDetail/data/LeaguerDetail";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {StoreCardInfoSynDataHolder} from "../../../bsModule/storeCardInfo/StoreCardInfoSynDataHolder";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {StoreCardInfo} from "../../../bsModule/storeCardInfo/data/StoreCardInfo";
import {MembershipCard} from "../../../bsModule/storeCardInfo/data/MembershipCard";
import {StoreLeaguerInfoMgr} from "../../../bsModule/storeLeaguerInfo/StoreLeaguerInfoMgr";
import {AlertUtils} from "../../zmComUtils/AlertUtils";

/**
 * 会员管理-会员详情
 */
@IonicPage({
  name:"leaguerDetail",
  segment:"leaguerDetail"
})
@Component({
  template:`
            <zm-page-header [operation]="true" [edit]="'编辑'" [title]="'会员详情'" (zmbBtnClick)="goEditLeaguer()"></zm-page-header>
            <zm-page-content>
              <!--<div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="20px" style="padding:10px 0;">-->
                <!--<div zmk-img-circle>-->
                  <!--<img w-100 h-100 src="{{viewData.detail.headImg | zmImgPath}}">-->
                <!--</div>-->
                <!--<span>{{viewData.detail.name}}</span>-->
                <!--<span *ngIf="viewData.detail.sex == 2"><img src="assets/img/sex-wumen.png"></span>-->
                <!--<span *ngIf="viewData.detail.sex == 1"><img src="assets/img/sex-man.png"></span>-->
              <!--</div>-->
              <!--<zmbUser-info [imgUrl]="viewData.detail.headImg | zmImgPath" [name]="viewData.detail.name" [sex]="viewData.detail.sex == 2" [phone]="viewData.detail.phone"></zmbUser-info>-->

              <!--<zmbSms-phone [startActive]="false"  [showStar]="true" (zmbtnClick)="zmClick($event)"></zmbSms-phone>-->
              <zmbLeaguerInfoWithOperate [id]="viewData.detail.id"></zmbLeaguerInfoWithOperate>
              
              <div border-gray></div><!--灰色边-->
              
              <!--<div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="20px">-->
                <!--<span><img src="assets/img/duanxin.png">会员信息</span>-->
              <!--</div>-->
              <div style="padding:20px 0;">
                <zm-btn-icon  fxFlex="1 1 33%" title="客户信息" imgSrc="assets/icon/client.svg" (zmbtnClick)="goLeaguerAttribute()"></zm-btn-icon> 
              
              </div>
              
              <div border-gray></div><!--灰色边-->
              
              <div fxLayout="row" w-100>
                <div fxFlex="1 1 50%" >
                    <div  fxLayout="column" fxLayoutAlign="start start" fxLayoutGap="15px" style="height:92px;padding:18px 5px 18px 30px;border-bottom:1px solid #f4f4f4;">
                      <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="5px"><img src="assets/img/ic_customer_vip.png"><span>会员卡</span></div>
                      <span text-bold style="font-size:14px;">{{getMemberCardName()}}</span>
                    </div>
                    <div fxLayout="column" fxLayoutAlign="space-between start" fxLayoutGap="15px" style="height:92px;padding:18px 5px 18px 30px;border-bottom:1px solid #f4f4f4;">
                       <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="5px"><img src="assets/img/ic_customer_accountTotal.png"><span>消费总金额</span></div>
                      <span text-bold style="font-size:16px;">￥{{viewData.detail.avgPrice | number:'1.2-2'}}</span>
                    </div>
                   
                      <div fxLayout="column" fxLayoutAlign="space-between start" fxLayoutGap="15px" style="height:92px;padding:18px 5px 18px 30px;border-bottom:1px solid #f4f4f4;">
                          <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="5px"><img src="assets/img/ic_customer_time.png"><span>上次消费时间</span></div>
                        <span text-bold style="font-size:16px;">{{viewData.detail.lastConsumeTime | zmDatePipe}}</span>
                      </div>
                      
                </div>
                
                
                 <div fxFlex="1 1 50%" style="border-left:2px solid #f4f4f4;">
                    <div fxLayout="column" fxLayoutAlign="space-between start" fxLayoutGap="15px" style="height:92px;padding:18px 5px 18px 30px;border-bottom:1px solid #f4f4f4;">
                        <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="5px"><img src="assets/img/ic_customer_unitprice.png"><span>客单价</span></div>
                      <span text-bold style="font-size:16px;">￥{{viewData.detail.avgPrice | number:'1.2-2'}}</span>
                    </div>
                    
                    <div fxLayout="column" fxLayoutAlign="space-between start" fxLayoutGap="15px" style="height:92px;padding:18px 5px 18px 30px;border-bottom:1px solid #f4f4f4;">
                      <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="5px"><img src="assets/img/ic_customer_accountbalance.png"><span>会员卡余额</span></div>
                      <span text-bold style="font-size:16px;">￥{{viewData.detail.leaguerMemberCard?viewData.detail.leaguerMemberCard.balance:'-'}}</span>
                    </div>
                 </div>
              </div>
             
              
            </zm-page-content>
            
            <ion-footer>
             <div (click)="deleteLeaguer()" fxLayout="row" fxLayoutAlign="center center" style="border-top:1px solid #f4f4f4;padding:15px ;color:#999;"><ion-icon ios="ios-trash-outline" md="md-trash"></ion-icon>删除</div>
            </ion-footer>
`,
  styles:[

  ],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class LeaguerDetailPage{

  public viewData:LeaguerDetailViewData;
  private service:LeaguerDetailService;

  constructor(private navParams: NavParams,
              private cdRef:ChangeDetectorRef){
    this.service = new LeaguerDetailService();
    let initViewData = new LeaguerDetailViewData();
    LeaguerDetailViewDataMgr.getInstance().onDataChange(initViewData, (viewDataP => {
      if (viewDataP) {
        this.viewData = viewDataP;
        this.cdRef.markForCheck();
      }
    }));
  }

  ionViewDidLoad() {
    this.initViewData();
  }

  /**
   * 跳转编辑会员
   */
  goEditLeaguer(){
    if(!AppUtils.isNullObj(this.viewData.detail) && !AppUtils.isNullOrWhiteSpace(this.viewData.detail.id)){
      AppRouter.getInstance().goEditLeaguerPage(this.viewData.detail.id)
    }
  }

  /**
   * 跳转会员信息
   */
  goLeaguerAttribute(){
    if(!AppUtils.isNullObj(this.viewData.detail) && !AppUtils.isNullOrWhiteSpace(this.viewData.detail.id)){
      AppRouter.getInstance().goLeaguerAttributePage(this.viewData.detail.id);
    }
  }

  /**
   * 会员卡名称
   * @returns {string}
   */
  getMemberCardName():string{
    let leaguerMemberCard = this.viewData.detail.leaguerMemberCard;
    if(!AppUtils.isNullObj(leaguerMemberCard) && !AppUtils.isNullOrWhiteSpace(leaguerMemberCard.cardId)){
      return this.viewData.memberCardMap.get(leaguerMemberCard.cardId).name
    }
    return "-";
  }

  private initViewData() {
    let targetId = AppRouter.getInstance().getTargetId(this.navParams);
    this.service.buildViewData(targetId);
  }

  /**
   * 删除会员
   */
  deleteLeaguer(){
    if(!AppUtils.isNullObj(this.viewData.detail) && !AppUtils.isNullOrWhiteSpace(this.viewData.detail.id)){
      AlertUtils.getInstance().showConfirm("","请确认是否删除该会员",
        this.service.deleteLeaguer(this.viewData.detail.id).then(success=>{
          if(success){
            AppUtils.showSuccess("提示","删除成功");
            AppRouter.getInstance().pop();
          }else{
            AppUtils.showError("提示","删除失败");
          }
        }),
        // ()=>{console.log("确认删除======")},
        ()=>{}
      )
    }else{
      AppUtils.showWarn("提示","会员信息加载失败")
    }
  }

}

class LeaguerDetailService{

  public async buildViewData(id:string){
    let viewDataTmp = new LeaguerDetailViewData();
    let leaguerDetail:LeaguerDetail = await LeaguerDetailMgr.getInstance().get(id);
    if(!AppUtils.isNullObj(leaguerDetail)){
      viewDataTmp.detail = leaguerDetail;

      let storeId = SessionUtil.getInstance().getCurStoreId();
      let storeCardInfo:StoreCardInfo = await StoreCardInfoSynDataHolder.getInstance().getData(storeId);
      if(!AppUtils.isNullObj(storeCardInfo)){
        viewDataTmp.memberCardMap = storeCardInfo.getMemberCardMap();
      }
    }
    LeaguerDetailViewDataMgr.getInstance().setData(viewDataTmp);
  }

  /**
   * 删除会员
   * @param leaguerId
   * @returns {Promise<boolean>}
   */
  public deleteLeaguer(leaguerId:string):Promise<boolean>{
    let storeId = SessionUtil.getInstance().getStoreId();
    return StoreLeaguerInfoMgr.getInstance().deleteLeaguer(storeId,leaguerId);
  }

}

export class LeaguerDetailViewData{
  public detail:LeaguerDetail = new LeaguerDetail();
  public memberCardMap: ZmMap<MembershipCard> = new ZmMap<MembershipCard>();
}
