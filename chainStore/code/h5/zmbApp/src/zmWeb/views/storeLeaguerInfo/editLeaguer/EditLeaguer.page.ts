import {Component, ChangeDetectionStrategy, ChangeDetectorRef} from "@angular/core";
import {IonicPage, NavParams} from "ionic-angular";
import {EditLeaguerViewDataMgr} from "./EditLeaguerViewDataMgr";
import {LeaguerDetailMgr} from "../../../bsModule/leaguerDetail/LeaguerDetailMgr";
import {LeaguerDetail} from "../../../bsModule/leaguerDetail/data/LeaguerDetail";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {AppRouter} from "../../zmComUtils/AppRouter";
import {LeaguerUpdateInfoApiForm} from "../../../bsModule/storeLeaguerInfo/apiData/LeaguerUpdateInfoApiForm";
import {StoreLeaguerInfoMgr} from "../../../bsModule/storeLeaguerInfo/StoreLeaguerInfoMgr";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {RestResp} from "../../../comModule/asynDao/apiData/RestResp";
import {LeaguerLabel} from "../../../bsModule/storeLeaguerInfo/data/LeaguerLabel";
import {StaffItemData} from "../selectStaff/StaffItemData";
import {LeaguerOriginConfig} from "../../../bsModule/storeConfig/data/leaguer/LeaguerOriginConfig";
import {LeaguerBaseAttribute} from "../../../bsModule/storeConfig/data/leaguer/LeaguerBaseAttribute";
import {ExpandAttributeItem} from "../addLeaguer/ExpandAttributeItem";
import {StoreConfig} from "../../../bsModule/storeConfig/data/StoreConfig";
import {StoreConfigMgr} from "../../../bsModule/storeConfig/StoreConfigMgr";
import {LeaguerConfig} from "../../../bsModule/storeConfig/data/LeaguerConfig";
import {LeaguerExpandAttribute} from "../../../bsModule/storeConfig/data/leaguer/LeaguerExpandAttribute";
import {LeaguerAttributeStateEnum} from "../../../bsModule/storeConfig/data/leaguer/LeaguerAttributeStateEnum";
import {StoreClerkInfo} from "../../../bsModule/storeClerkInfo/data/StoreClerkInfo";
import {StoreClerkInfoMgr} from "../../../bsModule/storeClerkInfo/StoreClerkInfoMgr";
import {BUser} from "../../../bsModule/buser/data/BUser";
import {BUserMgr} from "../../../bsModule/buser/BUserMgr";
import {StaffExChangeData} from "../selectStaff/StaffExChangeData";
import {LabelExChangeData} from "../addLabel/LabelExChangeData";
import {AppCfg} from "../../../comModule/AppCfg";
import {WxMediaUtil} from "../../zmComUtils/WxMediaUtil";
import {StoreLeaguerInfoSynDataHolder} from "../../../bsModule/storeLeaguerInfo/StoreLeaguerInfoSynDataHolder";
import {StoreLeaguerInfo} from "../../../bsModule/storeLeaguerInfo/data/StoreLeaguerInfo";

/**
 * 会员管理-编辑会员
 */
@IonicPage({
  name:"editLeaguer",
  segment:"editLeaguer"
})
@Component({
  template:`
            <zm-page-header title="编辑会员" [operation]="true" [edit]="'保存'" (zmbBtnClick)="updateLeaguerInfo()"></zm-page-header>
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
                            <ion-input no-margin maxlength="10" placeholder="请输入姓名" text-right type="text" [(ngModel)]="viewData.updateForm.name"></ion-input>
                        </div>
                         <div *ngIf="getAttributeEnable('name')"  w-100 style="border-bottom:1px solid #f4f4f4;"></div>
                        <div *ngIf="getAttributeEnable('sex')" >
                            <zm-input-gender [(zmValue)]="viewData.updateForm.sex"></zm-input-gender>
                        </div>
                         <div *ngIf="getAttributeEnable('sex')" w-100 style="border-bottom:1px solid #f4f4f4;"></div>
                        <div *ngIf="getAttributeEnable('phone')" fxLayout="row" fxLayoutAlign="space-between center" >
                            <div>手机号码<span style="color:red;">*</span></div>
                            <ion-input no-margin  placeholder="请输入手机号码" text-right type="text" [(ngModel)]="viewData.updateForm.phone"></ion-input>
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
                            <div style="width:70%;"><zmb-select-staff [placeHolder]="'请选择跟进人员'" [(idArr)]="viewData.updateForm.buserIds"></zmb-select-staff></div>
                            <!--<span style="color:#999;" *ngIf="getStaffName()==''" (click)="goSelectStaff()">请选择跟进人员</span>-->
                            <!--<span *ngIf="getStaffName() !=''" (click)="goSelectStaff()">{{getStaffName()}}</span>-->
                        </div>
                        <div *ngIf="getAttributeEnable('buserIds')" w-100 style="border-bottom:1px solid #f4f4f4;"></div>
                        
                        <div *ngIf="getAttributeEnable('originId')">
                            <zmb-select w-100 [title]="'客户来源'" [(zmValue)]="viewData.updateForm.originId" [selectList]="viewData.originList" [name]="'originName'" [value]="'id'"></zmb-select>
                        </div>
                         <div *ngIf="getAttributeEnable('originId')" w-100 style="border-bottom:1px solid #f4f4f4;"></div>
                         
                        <div *ngIf="getAttributeEnable('recommender')" fxLayout="row" fxLayoutAlign="space-between center" >
                            <span>介绍人</span>
                            <ion-input no-margin text-right maxlength="10" placeholder="请输入介绍人" type="text" [(ngModel)]="viewData.updateForm.recommender"></ion-input>
                        </div>
                        <div *ngIf="getAttributeEnable('recommender')" w-100 style="border-bottom:1px solid #f4f4f4;"></div>
                        
                        <div *ngIf="getAttributeEnable('dateType')" fxLayout="row" fxLayoutAlign="space-between center" >
                            <zmb-select w-100 [title]="'阴历阳历'" [(zmValue)]="viewData.updateForm.dateType" [selectList]="[{name:'阴历',value:'0'},{name:'阳历',value:'1'}]"></zmb-select>
                        </div>
                        <div  *ngIf="getAttributeEnable('dateType')" w-100 style="border-bottom:1px solid #f4f4f4;"></div>
                        
                        <div w-100 *ngIf="getAttributeEnable('birthday')" fxLayout="row" fxLayoutAlign="space-between center" >
                            <zm-date [small]="true" w-100 [label]="'出生日期'" [placeholder]="'请选择出生日期'" [maxDate]="viewData.maxDate" [(currentValue)]="viewData.birthday"></zm-date>
                        </div>
                         <div *ngIf="getAttributeEnable('birthday')" w-100 style="border-bottom:1px solid #f4f4f4;"></div>
                         
                        <div *ngIf="getAttributeEnable('idCard')" fxLayout="row" fxLayoutAlign="space-between center" >
                            <span>身份证</span>
                            <ion-input no-margin text-right maxlength="14" placeholder="请输入身份证" type="text" [(ngModel)]="viewData.updateForm.idCard"></ion-input>
                        </div>
                        <div *ngIf="getAttributeEnable('idCard')" w-100 style="border-bottom:1px solid #f4f4f4;"></div>
                        
                        <div *ngIf="getAttributeEnable('wechatNumber')" fxLayout="row" fxLayoutAlign="space-between center" >
                            <span>微信号</span>
                            <ion-input no-margin text-right placeholder="请输入微信号" type="text" [(ngModel)]="viewData.updateForm.wechatNumber"></ion-input>
                        </div>
                        <div *ngIf="getAttributeEnable('wechatNumber')" w-100 style="border-bottom:1px solid #f4f4f4;"></div>
                        
                        <div *ngIf="getAttributeEnable('aliasName')" fxLayout="row" fxLayoutAlign="space-between center" >
                            <span>昵称</span>
                            <ion-input no-margin text-right maxlength="10" placeholder="请输入昵称" type="text" [(ngModel)]="viewData.updateForm.aliasName"></ion-input>
                        </div>
                        <div *ngIf="getAttributeEnable('aliasName')" w-100 style="border-bottom:1px solid #f4f4f4;"></div>
                        
                        <div *ngIf="getAttributeEnable('job')" fxLayout="row" fxLayoutAlign="space-between center" >
                            <span>职位</span>
                            <ion-input no-margin text-right maxlength="10" placeholder="请输入职位" type="text" [(ngModel)]="viewData.updateForm.job"></ion-input>
                        </div>
                        <div *ngIf="getAttributeEnable('job')"  w-100 style="border-bottom:1px solid #f4f4f4;"></div>
                        
                        <div *ngIf="getAttributeEnable('company')" fxLayout="row" fxLayoutAlign="space-between center" >
                            <span>工作单位</span>
                            <ion-input no-margin text-right maxlength="10" placeholder="请输入工作单位" type="text" [(ngModel)]="viewData.updateForm.company"></ion-input>
                        </div>
                        <div *ngIf="getAttributeEnable('company')" w-100 style="border-bottom:1px solid #f4f4f4;"></div>
                        
                        <div *ngIf="getAttributeEnable('address')" fxLayout="row" fxLayoutAlign="space-between center" >
                            <span>联系地址</span>
                            <ion-input no-margin text-right placeholder="请输入联系地址" type="text" [(ngModel)]="viewData.updateForm.address"></ion-input>
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
export class EditLeaguerPage{

  public viewData:EditLeaguerViewData;
  private service:EditLeaguerService;

  constructor(private navParams: NavParams,
              private cdRef:ChangeDetectorRef){
    this.service = new EditLeaguerService();
    let initViewData = new EditLeaguerViewData();
    EditLeaguerViewDataMgr.getInstance().onDataChange(initViewData, (viewDataP => {
      if (viewDataP) {
        this.viewData = viewDataP;
        this.cdRef.markForCheck();
      }
    }));
  }

  ionViewDidLoad() {
    this.initViewData()
  }

  private initViewData() {
    let targetId = AppRouter.getInstance().getTargetId(this.navParams);
    this.service.buildViewData(targetId);
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
      this.viewData.updateForm.headImg = imgArr[0];
      EditLeaguerViewDataMgr.getInstance().setData(this.viewData);
    }
  }

  /**
   * 跳转添加标签
   */
  goAddLabel(){
    LabelExChangeData.getInstance().setSelectedLabelList(this.viewData.selectedLabelList);
    AppRouter.getInstance().goAddLabelPage(()=>{
      EditLeaguerViewDataMgr.getInstance().setData(this.viewData);
    });
  }

  /**
   * 跳转选择跟进人员
   */
  // goSelectStaff(){
  //   StaffExChangeData.getInstance().setStaffList(this.viewData.staffList);
  //   AppRouter.getInstance().goSelectStaffPage(()=>{
  //     EditLeaguerViewDataMgr.getInstance().setData(this.viewData);
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
  //     return "请选择跟进人员";
  //   }
  // }

  /**
   * 页面点击事件 修改会员信息
   */
  updateLeaguerInfo(){
    let updateForm = this.viewData.updateForm;
    updateForm.id = this.viewData.detail.id;
    if(AppUtils.isNullOrWhiteSpace(updateForm.name)){
      AppUtils.showWarn("提示","会员姓名不能为空");
    }else if(AppUtils.isNullObj(updateForm.phone) || AppUtils.isNullOrWhiteSpace(updateForm.phone)){
      AppUtils.showWarn("提示","手机号不能为空");
    }else{
      //出生日期
      updateForm.birthday = new Date(this.viewData.birthday).getTime();
      //跟进人员
      // updateForm.buserIds = this.viewData.staffList.filter((item)=>{
      //   if(item.selected){
      //     return true;
      //   }
      // }).map((item)=>{
      //   return item.id;
      // });
      //标签
      updateForm.labelIds = this.viewData.selectedLabelList.map((item:LeaguerLabel)=>{
        return item.id;
      })
      //扩展属性
      let expandAttrMap = {};
      this.viewData.expandAttritubeList.forEach((item:ExpandAttributeItem)=>{
        expandAttrMap[item.id] = item.value?item.value:"";
      })
      updateForm.expandAttrMap = expandAttrMap;
      updateForm.name = AppUtils.trimBlank(updateForm.name);
      updateForm.phone = AppUtils.trimBlank(updateForm.phone);
      this.service.updateLeaguerInfo(updateForm).then((restResp:RestResp)=>{
        if(!AppUtils.isNullObj(restResp)){
          if(restResp.code == 200){
            AppUtils.showSuccess("提示","保存成功");
            AppRouter.getInstance().pop();
          }else{
            AppUtils.showError("提示",restResp.tips);
          }
        }else{
          AppUtils.showError("提示","保存失败");
        }
      })
    }
  }
}

class EditLeaguerService{

  public async buildViewData(id:string){
    let viewDataTmp = new EditLeaguerViewData();
    let leaguerDetail:LeaguerDetail = await LeaguerDetailMgr.getInstance().get(id);
    if(!AppUtils.isNullObj(leaguerDetail)){
      viewDataTmp.detail = leaguerDetail;
      let storeId = SessionUtil.getInstance().getStoreId();
      let storeConfig:StoreConfig = await StoreConfigMgr.getInstance().get(storeId);
      if(!AppUtils.isNullObj(storeConfig)){
        let leaguerConfigTmp = new LeaguerConfig();
        AppUtils.copy(leaguerConfigTmp, storeConfig.leaguerConfig);
        //来源
        viewDataTmp.originList = leaguerConfigTmp.getLeaguerOriginMap().values();
        //基础属性
        viewDataTmp.baseAttributeMap = leaguerConfigTmp.getBaseAttributeMap();
        viewDataTmp.baseAttributeMap.keys().forEach((attrName:string)=>{
          viewDataTmp.updateForm[attrName] = leaguerDetail[attrName];
        })
        //扩展属性
        let expandAttritubeListTmp = leaguerConfigTmp.getLeaguerExpandAttributeMap().values();
        let expandAttributeValueMap:ZmMap<string> = leaguerDetail.getExpandAttributeMap();
        expandAttritubeListTmp.forEach((item: LeaguerExpandAttribute) => {
          if (item.status == LeaguerAttributeStateEnum.Enable) {
            let attributeItem = ExpandAttributeItem.formExpandAttribute(item,expandAttributeValueMap.get(item.id));
            viewDataTmp.expandAttritubeList.push(attributeItem);
          }
        })
        viewDataTmp.expandAttritubeList.sort((a: ExpandAttributeItem, b: ExpandAttributeItem) => {
          return parseInt(a.sort.toString()) - parseInt(b.sort.toString());
        })
      }
      //设置已选标签
      if(leaguerDetail.labelIds && leaguerDetail.labelIds.length>0){
        let storeLeaguerInfo:StoreLeaguerInfo = await StoreLeaguerInfoSynDataHolder.getInstance().getData(storeId);
        if(!AppUtils.isNullObj(storeLeaguerInfo)){
          let leaguerLabelMap = storeLeaguerInfo.getValidLeaguerLabelMap();
          leaguerDetail.labelIds.forEach((id)=>{
            viewDataTmp.selectedLabelList.push(leaguerLabelMap.get(id));
          })
        }
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
      // //设置已选中跟进人员
      // if(leaguerDetail.buserIds && leaguerDetail.buserIds.length>0){
      //   for(let i=0;i<leaguerDetail.buserIds.length;i++){
      //     let buserId = leaguerDetail.buserIds[i];
      //     for(let j=0;j<viewDataTmp.staffList.length;j++){
      //       if(buserId == viewDataTmp.staffList[j].id){
      //         viewDataTmp.staffList[j].selected = true;
      //         break;
      //       }
      //     }
      //   }
      // }

      viewDataTmp.updateForm.sex = parseInt(leaguerDetail.sex.toString());
      viewDataTmp.updateForm.originId = leaguerDetail.originId.toString();
      viewDataTmp.updateForm.dateType = parseInt(leaguerDetail.dateType.toString());
      viewDataTmp.imgUrl = AppCfg.getInstance().getImgPreUrl() + leaguerDetail.headImg;
      viewDataTmp.birthday = AppUtils.formatDate(new Date(Number(leaguerDetail.birthday)),"yyyy-MM-dd");
    }
    EditLeaguerViewDataMgr.getInstance().setData(viewDataTmp);
  }

  /**
   * 修改会员信息
   * @param updateForm
   */
  public updateLeaguerInfo(updateForm):Promise<RestResp>{
    let storeId = SessionUtil.getInstance().getStoreId();
    return StoreLeaguerInfoMgr.getInstance().updateLeaguerInfo(storeId,updateForm);
  }

}

export class EditLeaguerViewData{
  public detail: LeaguerDetail = new LeaguerDetail();

  public updateForm:LeaguerUpdateInfoApiForm = new LeaguerUpdateInfoApiForm();

  public selectedLabelList:Array<LeaguerLabel> = new Array<LeaguerLabel>();//选中的标签

  // public staffList:Array<StaffItemData> = new Array<StaffItemData>();//跟进人员

  public originList:Array<LeaguerOriginConfig> = new Array<LeaguerOriginConfig>();//来源
  public baseAttributeMap:ZmMap<LeaguerBaseAttribute> = new ZmMap<LeaguerBaseAttribute>();//基础属性
  public expandAttritubeList:Array<ExpandAttributeItem> = new Array<ExpandAttributeItem>();//扩展属性

  public imgUrl:string;
  public birthday:string;//出生日期
  public maxDate:string;
  constructor(){
    this.maxDate = AppUtils.formatDate(new Date(),"yyyy-MM-dd");
  }
}
