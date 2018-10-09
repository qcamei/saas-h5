import {Component, ChangeDetectorRef, ChangeDetectionStrategy} from "@angular/core";
import {NavParams, IonicPage} from "ionic-angular";
import {AppRouter} from "../../zmComUtils/AppRouter";
import {LeaguerAttributeViewDataMgr} from "./LeaguerAttributeViewDataMgr";
import {LeaguerDetailMgr} from "../../../bsModule/leaguerDetail/LeaguerDetailMgr";
import {LeaguerDetail} from "../../../bsModule/leaguerDetail/data/LeaguerDetail";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {StoreLeaguerInfoMgr} from "../../../bsModule/storeLeaguerInfo/StoreLeaguerInfoMgr";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {StoreLeaguerInfo} from "../../../bsModule/storeLeaguerInfo/data/StoreLeaguerInfo";
import {LeaguerLabel} from "../../../bsModule/storeLeaguerInfo/data/LeaguerLabel";
import {StoreClerkInfoMgr} from "../../../bsModule/storeClerkInfo/StoreClerkInfoMgr";
import {StoreClerkInfo} from "../../../bsModule/storeClerkInfo/data/StoreClerkInfo";
import {BUserMgr} from "../../../bsModule/buser/BUserMgr";
import {BUser} from "../../../bsModule/buser/data/BUser";
import {StoreConfigMgr} from "../../../bsModule/storeConfig/StoreConfigMgr";
import {StoreConfig} from "../../../bsModule/storeConfig/data/StoreConfig";
import {LeaguerConfig} from "../../../bsModule/storeConfig/data/LeaguerConfig";
import {LeaguerBaseAttribute} from "../../../bsModule/storeConfig/data/leaguer/LeaguerBaseAttribute";
import {LeaguerOriginConfig} from "../../../bsModule/storeConfig/data/leaguer/LeaguerOriginConfig";
import {LeaguerAttributeStateEnum} from "../../../bsModule/storeConfig/data/leaguer/LeaguerAttributeStateEnum";
import {LeaguerExpandAttribute} from "../../../bsModule/storeConfig/data/leaguer/LeaguerExpandAttribute";

/**
 * 会员管理-会员详情-会员信息
 */
@IonicPage({
  name:"leaguerAttribute",
  segment:"leaguerAttribute"
})
@Component({
  template:`
            <zm-page-header [title]="'会员信息'"></zm-page-header>
            <zm-page-content>
                <div style="width:100%;" fxLayout="column" fxLayoutAlign="start">
                    <!--必填信息-->
                    <div fxLayout="column" fxLayoutAlign="start" style="padding:0 10px;">
                        <div *ngIf="getAttributeEnable('headImg')" text-center style="padding:15px 0 10px 0;border-bottom:1px solid #f4f4f4;">
                            <img zmk-img-circle [src]="viewData.detail.headImg | zmImgPath">
                        </div>
                        <div *ngIf="getAttributeEnable('name')" fxLayout="row" fxLayoutAlign="space-between start" style="border-bottom:1px solid #f4f4f4;padding:12px 15px;">
                            <span>姓名</span>
                            <span>{{viewData.detail.name}}</span>
                        </div>
                        <div *ngIf="getAttributeEnable('sex')" fxLayout="row" fxLayoutAlign="space-between start" style="border-bottom:1px solid #f4f4f4;padding:12px 15px;">
                            <span>姓别</span>
                            <span>{{viewData.detail.sex == 1?'男':'女'}}</span>
                        </div>
                        <div *ngIf="getAttributeEnable('phone')" fxLayout="row" fxLayoutAlign="space-between start" style="border-bottom:1px solid #f4f4f4;padding:12px 15px;">
                            <span>手机号码</span>
                            <span>{{viewData.detail.phone}}</span>
                        </div>
                    </div>
                    <div *ngIf="getAttributeEnable('labelIds') && viewData.detail.labelIds"  border-gray></div>
                    <!--标签-->
                    <div *ngIf="getAttributeEnable('labelIds') && viewData.detail.labelIds" fxLayout="row" fxLayoutAlign="space-between centr" style="padding:12px 15px;">
                        <span>标签</span>
                        <span *ngFor="let item of viewData.detail.labelIds">{{getLabelName(item)}}</span>
                    </div>
                     <div *ngIf="getAttributeEnable('labelIds') && viewData.detail.labelIds"  border-gray></div>
                    <!--其他基础信息-->
                    <div fxLayout="column" fxLayoutAlign="start" style="padding:0 10px;">
                        <div *ngIf="getAttributeEnable('birthday')" fxLayout="row" fxLayoutAlign="space-between start" style="border-bottom:1px solid #f4f4f4;padding:12px 15px;">
                            <span>出生日期</span>
                            <span>{{viewData.detail.birthday>0?(viewData.detail.birthday | zmDatePipe:'yyyy-MM-dd'):'未填写'}}</span>
                        </div>
                        <div *ngIf="getAttributeEnable('wechatNumber')" fxLayout="row" fxLayoutAlign="space-between start" style="border-bottom:1px solid #f4f4f4;padding:12px 15px;">
                            <span>微信号</span>
                            <span>{{viewData.detail.wechatNumber?viewData.detail.wechatNumber:'未填写'}}</span>
                        </div>
                        <div *ngIf="getAttributeEnable('buserIds')" fxLayout="row" fxLayoutAlign="space-between start" style="border-bottom:1px solid #f4f4f4;padding:12px 15px;">
                            <span>跟进人员</span>
                            <span *ngFor="let item of viewData.detail.buserIds">{{getBuserName(item)}}</span>
                        </div>
                        <div *ngIf="getAttributeEnable('originId')" fxLayout="row" fxLayoutAlign="space-between start" style="border-bottom:1px solid #f4f4f4;padding:12px 15px;">
                            <span>客户来源</span>
                            <span>{{getOriginName(viewData.detail.originId)}}</span>
                        </div>
                        <div *ngIf="getAttributeEnable('recommender')" fxLayout="row" fxLayoutAlign="space-between start" style="border-bottom:1px solid #f4f4f4;padding:12px 15px;">
                            <span>介绍人</span>
                            <span>{{viewData.detail.recommender?viewData.detail.recommender:'未填写'}}</span>
                        </div>
                        <div *ngIf="getAttributeEnable('company')" fxLayout="row" fxLayoutAlign="space-between start" style="border-bottom:1px solid #f4f4f4;padding:12px 15px;">
                            <span>工作单位</span>
                            <span>{{viewData.detail.company?viewData.detail.company:'未填写'}}</span>
                        </div>
                        <div *ngIf="getAttributeEnable('job')" fxLayout="row" fxLayoutAlign="space-between start" style="border-bottom:1px solid #f4f4f4;padding:12px 15px;">
                            <span>职位</span>
                            <span>{{viewData.detail.job?viewData.detail.job:'未填写'}}</span>
                        </div>
                        <div *ngIf="getAttributeEnable('address')" fxLayout="row" fxLayoutAlign="space-between start" style="border-bottom:1px solid #f4f4f4;padding:12px 15px;">
                            <span>联系地址</span>
                            <span>{{viewData.detail.address?viewData.detail.address:'未填写'}}</span>
                        </div>
                    </div>
                    <!--扩展信息-->
                    <div fxLayout="column" fxLayoutAlign="start" style="padding:0 10px;">
                        <div *ngFor="let item of viewData.expandAttrList" fxLayout="row" fxLayoutAlign="space-between start" style="border-bottom:1px solid #f4f4f4;padding:12px 15px;">
                            <span>{{item.label}}</span>
                            <span>{{item.value}}</span>
                        </div>
                    </div>
                </div>
            </zm-page-content>
`,
  styles:[

  ],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class LeaguerAttributePage{

  public viewData:LeaguerAttributeViewData;
  private service:LeaguerAttributeService;

  constructor(private navParams: NavParams,
              private cdRef:ChangeDetectorRef){
    this.service = new LeaguerAttributeService();
    let initViewData = new LeaguerAttributeViewData();
    LeaguerAttributeViewDataMgr.getInstance().onDataChange(initViewData, (viewDataP => {
      if (viewDataP) {
        this.viewData = viewDataP;
        this.cdRef.markForCheck();
      }
    }));
  }

  ionViewDidLoad() {
    this.initViewData();
  }

  private initViewData() {
    let targetId = AppRouter.getInstance().getTargetId(this.navParams);
    this.service.buildViewData(targetId);
  }

  /**
   * 获取标签名称
   * @param labelId
   * @returns {string}
   */
  getLabelName(labelId:string):string{
    return labelId&&this.viewData.labelMap.get(labelId)?this.viewData.labelMap.get(labelId).name:"未设置";
  }

  /**
   * 获取跟进人员名称
   * @param buserId
   * @returns {string}
   */
  getBuserName(buserId:string):string{
    return buserId&&this.viewData.buserMap.get(buserId)?this.viewData.buserMap.get(buserId).name:"未设置";
  }

  /**
   * 获取来源名称
   * @param originId
   * @returns {string}
   */
  getOriginName(originId:number):string{
    return originId&&this.viewData.originMap.get(originId.toString())?this.viewData.originMap.get(originId.toString()).originName:"未设置";
  }

  /**
   * 获取属性启用
   * @param name
   * @returns {boolean}
   */
  getAttributeEnable(name: string): boolean {
    return !AppUtils.isNullObj(this.viewData.baseAttributeMap.get(name)) && (this.viewData.baseAttributeMap.get(name).status == LeaguerAttributeStateEnum.Enable);
  }

}

export class LeaguerAttributeService{

  public async buildViewData(id:string){
    let viewDataTmp = new LeaguerAttributeViewData();
    let leaguerDetail:LeaguerDetail = await LeaguerDetailMgr.getInstance().get(id);
    if(!AppUtils.isNullObj(leaguerDetail)){
      viewDataTmp.detail = leaguerDetail;
      let storeId = SessionUtil.getInstance().getStoreId();
      let storeConfig:StoreConfig = await StoreConfigMgr.getInstance().get(storeId);
      if(!AppUtils.isNullObj(storeConfig)){//会员配置
        let leaguerConfigTmp = new LeaguerConfig();
        AppUtils.copy(leaguerConfigTmp, storeConfig.leaguerConfig);
        viewDataTmp.baseAttributeMap = leaguerConfigTmp.getBaseAttributeMap();
        viewDataTmp.originMap = leaguerConfigTmp.getLeaguerOriginMap();
        viewDataTmp.expandAttrList = this.getExpandAttrList(leaguerConfigTmp, leaguerDetail);
      }
      if(leaguerDetail.buserIds && leaguerDetail.buserIds.length>0){//跟进人员
        let storeClerkInfoId = SessionUtil.getInstance().getIdByStoreId(storeId);
        let storeClerkInfo: StoreClerkInfo = await StoreClerkInfoMgr.getInstance().get(storeClerkInfoId);
        if (!AppUtils.isNullObj(storeClerkInfo)) {
          let clerkMap = storeClerkInfo.getClerkMap();
          if (clerkMap.keys().length > 0) {
            let buserList: Array<BUser> = await BUserMgr.getInstance().findByMultitId(clerkMap.keys());
            buserList.forEach((buser: BUser) => {
              viewDataTmp.buserMap.put(buser.id, buser);
            })
          }
        }
      }
      if(leaguerDetail.labelIds && leaguerDetail.labelIds.length>0){//标签
        let storeLeaguerInfo: StoreLeaguerInfo = await StoreLeaguerInfoMgr.getInstance().get(storeId);
        if (!AppUtils.isNullObj(storeLeaguerInfo)) {
          viewDataTmp.labelMap = storeLeaguerInfo.getValidLeaguerLabelMap();
        }
      }
    }
    LeaguerAttributeViewDataMgr.getInstance().setData(viewDataTmp);
  }

  /**
   * 获取扩展属性
   * @param leaguerConfigTmp
   * @param leaguer
   * @returns {ExpandAttrLabelValue[]}
   */
  private getExpandAttrList(leaguerConfigTmp: LeaguerConfig,leaguer:LeaguerDetail):Array<ExpandAttrLabelValue> {
    let leaguerExpandAttributeMap = leaguerConfigTmp.getLeaguerExpandAttributeMap();
    let expandAttributeMap = leaguer.getExpandAttributeMap();
    let leaguerExpandAttributeList = leaguerExpandAttributeMap.values().filter((item:LeaguerExpandAttribute)=>{
      if(item.status == LeaguerAttributeStateEnum.Enable){
        return true;
      }else{
        return false;
      }
    })
    let expandAttrList = leaguerExpandAttributeList.map((item:LeaguerExpandAttribute)=>{
      let expandAttrLabelValue = new ExpandAttrLabelValue();
      expandAttrLabelValue.label = item.label;
      expandAttrLabelValue.value = expandAttributeMap.get(item.id)?expandAttributeMap.get(item.id):"未填写";
      return expandAttrLabelValue;
    })
    return expandAttrList;
  }

}

export class LeaguerAttributeViewData{
  public detail:LeaguerDetail = new LeaguerDetail();
  public labelMap: ZmMap<LeaguerLabel> = new ZmMap<LeaguerLabel>();
  public buserMap: ZmMap<BUser> = new ZmMap<BUser>();
  public baseAttributeMap:ZmMap<LeaguerBaseAttribute> = new ZmMap<LeaguerBaseAttribute>();
  public originMap: ZmMap<LeaguerOriginConfig> = new ZmMap<LeaguerOriginConfig>();
  public expandAttrList: Array<ExpandAttrLabelValue> = new Array<ExpandAttrLabelValue>();
}

export class ExpandAttrLabelValue{
  label:string;
  value:string;
}
