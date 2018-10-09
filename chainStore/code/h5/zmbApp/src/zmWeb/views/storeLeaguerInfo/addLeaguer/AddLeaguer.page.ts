import {LeaguerAddApiForm} from "../../../bsModule/storeLeaguerInfo/apiData/LeaguerAddApiForm";
import {Component, ChangeDetectorRef, ChangeDetectionStrategy} from "@angular/core";
import {IonicPage} from "ionic-angular";
import {AddLeaguerViewDataMgr} from "./AddLeaguerViewDataMgr";
import {WxMediaUtil} from "../../zmComUtils/WxMediaUtil";
import {AppCfg} from "../../../comModule/AppCfg";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {LeaguerBaseAttribute} from "../../../bsModule/storeConfig/data/leaguer/LeaguerBaseAttribute";
import {LeaguerAttributeStateEnum} from "../../../bsModule/storeConfig/data/leaguer/LeaguerAttributeStateEnum";
import {LeaguerExpandAttribute} from "../../../bsModule/storeConfig/data/leaguer/LeaguerExpandAttribute";
import {RestResp} from "../../../comModule/asynDao/apiData/RestResp";
import {DateTypeEnum} from "../../../bsModule/storeLeaguerInfo/data/DateTypeEnum";
import {GenderEnum} from "../../../comModule/enum/GenderEnum";
import {ExpandAttributeItem} from "./ExpandAttributeItem";
import {StoreClerkInfo} from "../../../bsModule/storeClerkInfo/data/StoreClerkInfo";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {StoreClerkInfoMgr} from "../../../bsModule/storeClerkInfo/StoreClerkInfoMgr";
import {BUser} from "../../../bsModule/buser/data/BUser";
import {BUserMgr} from "../../../bsModule/buser/BUserMgr";
import {StoreLeaguerInfoMgr} from "../../../bsModule/storeLeaguerInfo/StoreLeaguerInfoMgr";
import {StoreConfig} from "../../../bsModule/storeConfig/data/StoreConfig";
import {LeaguerConfig} from "../../../bsModule/storeConfig/data/LeaguerConfig";
import {LeaguerOriginConfig} from "../../../bsModule/storeConfig/data/leaguer/LeaguerOriginConfig";
import {LeaguerLabel} from "../../../bsModule/storeLeaguerInfo/data/LeaguerLabel";
import {StoreConfigMgr} from "../../../bsModule/storeConfig/StoreConfigMgr";
import {AppRouter} from "../../zmComUtils/AppRouter";
import {LabelExChangeData} from "../addLabel/LabelExChangeData";
import {StaffExChangeData} from "../selectStaff/StaffExChangeData";
import {StaffItemData} from "../selectStaff/StaffItemData";

/**
 * 会员管理-新建会员
 */
@IonicPage({
  name:"addLeaguer",
  segment:"addLeaguer"
})
@Component({
  template:`
            <zm-page-header [operation]="true" [edit]="'保存'" title="新建会员" (zmbBtnClick)="addLeaguer()" ></zm-page-header>
            <zm-page-content>
                <div style="width:100%;padding:10px 0;" fxLayout="column" fxLayoutAlign="start" fxLayoutGap="10px">
                    <!--头像-->
                    <div fxLayout="column" fxLayoutAlign="start center" fxLayoutGap="20px" style="padding-top:15px;position:relative;">
                        <div zmk-img-circle (click)="uploadHeadImg()">
                            <img w-100 h-100 [src]="viewData.imgUrl">
                        </div>
                       <img style="position:absolute;bottom:-5px;right:43%;" src="assets/img/add.png">
                        <div w-100 style="border-bottom:1px solid #f4f4f4;"></div>
                    </div>
                    <!--姓名性别手机号-->
                    <div fxLayout="column" fxLayoutAlign="start" fxLayoutGap="10px" style="padding:0 10px;">
                        <div *ngIf="getAttributeEnable('name')" fxLayout="row" fxLayoutAlign="space-between center" >
                            <div>姓名 <span style="color:red;">*</span></div>
                            <ion-input no-margin maxlength="10" placeholder="请输入姓名" text-right type="text" [(ngModel)]="viewData.addForm.name"></ion-input>
                        </div>
                         <div *ngIf="getAttributeEnable('name')"  w-100 style="border-bottom:1px solid #f4f4f4;"></div>
                        <div *ngIf="getAttributeEnable('sex')" >
                            <zm-input-gender [(zmValue)]="viewData.addForm.sex"></zm-input-gender>
                        </div>
                         <div *ngIf="getAttributeEnable('sex')" w-100 style="border-bottom:1px solid #f4f4f4;"></div>
                        <div *ngIf="getAttributeEnable('phone')" fxLayout="row" fxLayoutAlign="space-between center" >
                            <div>手机号码<span style="color:red;">*</span></div>
                            <ion-input no-margin  placeholder="请输入手机号码" text-right type="text" [(ngModel)]="viewData.addForm.phone"></ion-input>
                        </div>
                    </div>
                    <div border-gray></div>
                    <!--标签-->
                    <div fxLayout="column" fxLayoutAlign="start" fxLayoutGap="10px"  style="padding:0 10px;">
                        <div (click)="goAddLabel()" fxLayout="row" fxLayoutAlign="space-between center" fxLayoutGap="20px">
                            <span>标签</span>
                            <ion-icon name="arrow-forward"></ion-icon>
                        </div>
                        <div *ngIf="viewData.selectedLabelList.length>0" fxLayout="row wrap" fxLayoutAlign="start" fxLayoutGap="5px">
                            <span style="padding:1px 2px;color:#4678FA;border:1px solid #4678FA;border-radius:5px;" *ngFor="let item of viewData.selectedLabelList">{{item.name}}</span>
                        </div>
                    </div>
                     <div border-gray></div>
                     
                    <!--跟进人员客户来源介绍人...基础属性-->
                    <div fxLayout="column" fxLayoutAlign="start" fxLayoutGap="10px"  style="padding:0 10px;">
                        <div *ngIf="getAttributeEnable('buserIds')" fxLayout="row" fxLayoutAlign="space-between start" >
                            <span>跟进人员</span>
                            <div style="width:70%;"><zmb-select-staff [placeHolder]="'请选择跟进人员'" [(idArr)]="viewData.addForm.buserIds"></zmb-select-staff></div>
                            <!--<span style="color:#999;" *ngIf="getStaffName()==''" (click)="goSelectStaff()">请选择跟进人员</span>-->
                            <!--<span *ngIf="getStaffName() !=''" (click)="goSelectStaff()">{{getStaffName()}}</span>-->
                        </div>
                        <div *ngIf="getAttributeEnable('buserIds')" w-100 style="border-bottom:1px solid #f4f4f4;"></div>
                        
                        <div *ngIf="getAttributeEnable('originId')">
                            <zmb-select w-100 [title]="'客户来源'" [(zmValue)]="viewData.addForm.originId" [selectList]="viewData.originList" [name]="'originName'" [value]="'id'"></zmb-select>
                        </div>
                         <div *ngIf="getAttributeEnable('originId')" w-100 style="border-bottom:1px solid #f4f4f4;"></div>
                         
                        <div *ngIf="getAttributeEnable('recommender')" fxLayout="row" fxLayoutAlign="space-between center" >
                            <span>介绍人</span>
                            <ion-input no-margin text-right maxlength="10" placeholder="请输入介绍人" type="text" [(ngModel)]="viewData.addForm.recommender"></ion-input>
                        </div>
                        <div *ngIf="getAttributeEnable('recommender')" w-100 style="border-bottom:1px solid #f4f4f4;"></div>
                        
                        <div *ngIf="getAttributeEnable('dateType')" fxLayout="row" fxLayoutAlign="space-between center" >
                            <zmb-select w-100 [title]="'阴历阳历'" [(zmValue)]="viewData.addForm.dateType" [selectList]="[{name:'阴历',value:'0'},{name:'阳历',value:'1'}]"></zmb-select>
                        </div>
                        <div  *ngIf="getAttributeEnable('dateType')" w-100 style="border-bottom:1px solid #f4f4f4;"></div>
                        
                        <div w-100 *ngIf="getAttributeEnable('birthday')" fxLayout="row" fxLayoutAlign="space-between center" >
                            <zm-date [small]="true" w-100 [label]="'出生日期'" [placeholder]="'请选择出生日期'" [maxDate]="viewData.maxDate" [(currentValue)]="viewData.birthday"></zm-date>
                        </div>
                         <div *ngIf="getAttributeEnable('birthday')" w-100 style="border-bottom:1px solid #f4f4f4;"></div>
                         
                        <div *ngIf="getAttributeEnable('idCard')" fxLayout="row" fxLayoutAlign="space-between center" >
                            <span>身份证</span>
                            <ion-input no-margin text-right maxlength="14" placeholder="请输入身份证" type="text" [(ngModel)]="viewData.addForm.idCard"></ion-input>
                        </div>
                        <div *ngIf="getAttributeEnable('idCard')" w-100 style="border-bottom:1px solid #f4f4f4;"></div>
                        
                        <div *ngIf="getAttributeEnable('wechatNumber')" fxLayout="row" fxLayoutAlign="space-between center" >
                            <span>微信号</span>
                            <ion-input no-margin text-right placeholder="请输入微信号" type="text" [(ngModel)]="viewData.addForm.wechatNumber"></ion-input>
                        </div>
                        <div *ngIf="getAttributeEnable('wechatNumber')" w-100 style="border-bottom:1px solid #f4f4f4;"></div>
                        
                        <div *ngIf="getAttributeEnable('aliasName')" fxLayout="row" fxLayoutAlign="space-between center" >
                            <span>昵称</span>
                            <ion-input no-margin text-right maxlength="10" placeholder="请输入昵称" type="text" [(ngModel)]="viewData.addForm.aliasName"></ion-input>
                        </div>
                        <div *ngIf="getAttributeEnable('aliasName')" w-100 style="border-bottom:1px solid #f4f4f4;"></div>
                        
                        <div *ngIf="getAttributeEnable('job')" fxLayout="row" fxLayoutAlign="space-between center" >
                            <span>职位</span>
                            <ion-input no-margin text-right maxlength="10" placeholder="请输入职位" type="text" [(ngModel)]="viewData.addForm.job"></ion-input>
                        </div>
                        <div *ngIf="getAttributeEnable('job')"  w-100 style="border-bottom:1px solid #f4f4f4;"></div>
                        
                        <div *ngIf="getAttributeEnable('company')" fxLayout="row" fxLayoutAlign="space-between center" >
                            <span>工作单位</span>
                            <ion-input no-margin text-right maxlength="10" placeholder="请输入工作单位" type="text" [(ngModel)]="viewData.addForm.company"></ion-input>
                        </div>
                        <div *ngIf="getAttributeEnable('company')" w-100 style="border-bottom:1px solid #f4f4f4;"></div>
                        
                        <div *ngIf="getAttributeEnable('address')" fxLayout="row" fxLayoutAlign="space-between center" >
                            <span>联系地址</span>
                            <ion-input no-margin text-right placeholder="请输入联系地址" type="text" [(ngModel)]="viewData.addForm.address"></ion-input>
                        </div>
                         
                    </div>
                    <div border-gray></div>
                    <!--扩展属性-->
                    <div fxLayout="column" fxLayoutAlign="start" style="padding:0 10px;">
                        <div *ngFor="let item of viewData.expandAttritubeList" fxLayout="row" fxLayoutAlign="space-between center" style="padding:10px 0;border-bottom:1px solid #f4f4f4;" >
                            <span>{{item.label}}</span>
                            <ion-input no-margin text-right placeholder="{{item.tips}}" type="text" [(ngModel)]="item.value"></ion-input>
                        </div>
                        
                    </div>
             
                </div>
            </zm-page-content>
`,
  styles:[

  ],
  // changeDetection:ChangeDetectionStrategy.OnPush
})
export class AddLeaguerPage{

  public viewData:AddLeaguerViewData;
  private service:AddLeaguerService;

  constructor(private cdRef:ChangeDetectorRef){
    this.service = new AddLeaguerService();
    let initViewData = new AddLeaguerViewData();
    AddLeaguerViewDataMgr.getInstance().onDataChange(initViewData, (viewDataP => {
      if (viewDataP) {
        this.viewData = viewDataP;
        this.cdRef.markForCheck();
      }
    }));
  }

  ionViewDidLoad() {
    this.service.buildViewData();
  }

  /**
   * 获取属性启用
   * @param name
   * @returns {boolean}
   */
  getAttributeEnable(name: string): boolean {
    return !AppUtils.isNullObj(this.viewData.baseAttributeMap.get(name)) && (this.viewData.baseAttributeMap.get(name).status == LeaguerAttributeStateEnum.Enable);
  }

  /**
   * 调用微信上传头像
   */
  uploadHeadImg() {
    WxMediaUtil.getInstance().uploadImg(this.uploadImgCallback.bind(this));
  }

  /**
   * 上传图片回调
   * @param imgArr
   */
  private uploadImgCallback(imgArr: Array<string>) {
    if (imgArr && imgArr.length > 0) {
      this.viewData.imgUrl = AppCfg.getInstance().getImgPreUrl() + imgArr[0];
      this.viewData.addForm.headImg = imgArr[0];
      AddLeaguerViewDataMgr.getInstance().setData(this.viewData);
    }
  }

  /**
   * 跳转添加标签
   */
  goAddLabel(){
    LabelExChangeData.getInstance().setSelectedLabelList(this.viewData.selectedLabelList);
    AppRouter.getInstance().goAddLabelPage(()=>{
      AddLeaguerViewDataMgr.getInstance().setData(this.viewData);
    });
  }

  /**
   * 跳转选择跟进人员
   */
  // goSelectStaff(){
  //   StaffExChangeData.getInstance().setStaffList(this.viewData.staffList);
  //   AppRouter.getInstance().goSelectStaffPage(()=>{
  //     AddLeaguerViewDataMgr.getInstance().setData(this.viewData);
  //   });
  // }

  /**
   * 获取跟进人员名称
   * @returns {any}
   */
  // getStaffName():string{
  //   let nameArr = [];
  //   this.viewData.staffList.forEach((item:StaffItemData)=>{
  //     if(item.selected){
  //       nameArr.push(item.name);
  //     }
  //   });
  //   if(nameArr.length>0){
  //     return nameArr.join("、");
  //   }else{
  //     return "";
  //   }
  // }

  /**
   * 页面点击事件 添加会员
   */
  addLeaguer() {
    let addForm = this.viewData.addForm;
    if (AppUtils.isNullOrWhiteSpace(addForm.name)) {
      AppUtils.showWarn("提示", "会员姓名不能为空");
    } else if (AppUtils.isNullObj(addForm.phone) || AppUtils.isNullOrWhiteSpace(addForm.phone.toString())) {
      AppUtils.showWarn("提示", "手机号不能为空");
    }else{
      //出生日期
      addForm.birthday = new Date(this.viewData.birthday).getTime();
      //跟进人员
      // addForm.buserIds = this.viewData.staffList.filter((item)=>{
      //   if(item.selected){
      //     return true;
      //   }
      // }).map((item)=>{
      //   return item.id;
      // });
      //标签
      addForm.labelIds = this.viewData.selectedLabelList.map((item:LeaguerLabel)=>{
        return item.id;
      });
      //扩展属性
      let expandAttrMap = {};
      this.viewData.expandAttritubeList.forEach((item: ExpandAttributeItem) => {
        expandAttrMap[item.id] = item.value ? item.value : "";
      });
      addForm.expandAttrMap = expandAttrMap;
      addForm.name = AppUtils.trimBlank(addForm.name);

      this.service.addLeaguer(addForm).then((restResp:RestResp)=>{
        if (!AppUtils.isNullObj(restResp)) {
          if (restResp.code == 200) {
            AppUtils.showSuccess("提示","添加成功");
            AppRouter.getInstance().goLeaguerList();
          }else{
            AppUtils.showError("提示", restResp.tips);
          }
        } else {
          AppUtils.showError("提示", "添加失败");
        }
      })
    }
  }

}

export class AddLeaguerService{

  public async buildViewData(){
    let viewDataTmp = new AddLeaguerViewData();
    let storeId = SessionUtil.getInstance().getStoreId();
    //基础属性、扩展属性、来源
    let storeConfig:StoreConfig = await StoreConfigMgr.getInstance().get(storeId);
    if(!AppUtils.isNullObj(storeConfig)){
      let leaguerConfigTmp = new LeaguerConfig();
      AppUtils.copy(leaguerConfigTmp, storeConfig.leaguerConfig);
      viewDataTmp.originList = leaguerConfigTmp.getLeaguerOriginMap().values();
      viewDataTmp.baseAttributeMap = leaguerConfigTmp.getBaseAttributeMap();
      let expandAttritubeListTmp = leaguerConfigTmp.getLeaguerExpandAttributeMap().values();
      expandAttritubeListTmp.forEach((item: LeaguerExpandAttribute) => {
        if (item.status == LeaguerAttributeStateEnum.Enable) {
          let attributeItem = ExpandAttributeItem.formExpandAttribute(item);
          viewDataTmp.expandAttritubeList.push(attributeItem);
        }
      })
      viewDataTmp.expandAttritubeList.sort((a: ExpandAttributeItem, b: ExpandAttributeItem) => {
        return parseInt(a.sort.toString()) - parseInt(b.sort.toString());
      })
    }
    //跟进人员
    // let storeClerkInfoId = SessionUtil.getInstance().getIdByStoreId(storeId);
    // let storeClerkInfo: StoreClerkInfo = await StoreClerkInfoMgr.getInstance().get(storeClerkInfoId);
    // if (!AppUtils.isNullObj(storeClerkInfo)) {
    //   let idArr = storeClerkInfo.getClerkMap().keys();
    //   if (idArr.length > 0) {
    //     let buserList: Array<BUser> = await BUserMgr.getInstance().findByMultitId(idArr);
    //     viewDataTmp.staffList = buserList.map((buser: BUser) => {
    //       return StaffItemData.fromBuser(buser);
    //     })
    //   }
    // }

    viewDataTmp.birthday = AppUtils.formatDate(new Date(),"yyyy-MM-dd");
    AddLeaguerViewDataMgr.getInstance().setData(viewDataTmp);
  }

  /**
   * 添加会员
   * @param addForm
   * @param callbackP
   */
  public addLeaguer(addForm) {
    let storeId = SessionUtil.getInstance().getStoreId();
    return StoreLeaguerInfoMgr.getInstance().addLeaguer(storeId, addForm);
  }

}

export class AddLeaguerViewData{
  public addForm:LeaguerAddApiForm = new LeaguerAddApiForm();
  public imgUrl:string = "assets/img/iicon_my.png";

  public selectedLabelList:Array<LeaguerLabel> = new Array<LeaguerLabel>();//选中的标签

  // public staffList:Array<StaffItemData> = new Array<StaffItemData>();//跟进人员

  public originList: Array<LeaguerOriginConfig> = new Array<LeaguerOriginConfig>();//来源
  public baseAttributeMap:ZmMap<LeaguerBaseAttribute> = new ZmMap<LeaguerBaseAttribute>();//基础属性
  public expandAttritubeList: Array<ExpandAttributeItem> = new Array<ExpandAttributeItem>();//扩展属性

  public birthday:string;
  public maxDate:string;

  constructor() {
    this.addForm.sex = GenderEnum.FEMALE;
    this.addForm.dateType = DateTypeEnum.SOLARDATE;
    this.addForm.buserIds = new Array<string>();
    this.maxDate = AppUtils.formatDate(new Date(),"yyyy-MM-dd");
  }
}
