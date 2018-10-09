import {Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy} from "@angular/core";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {ActivatedRoute} from "@angular/router";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {StoreLeaguerInfoViewDataMgr} from "../StoreLeaguerInfoViewDataMgr";
import {StoreLeaguerInfoMgr} from "../../../bsModule/storeLeaguerInfo/StoreLeaguerInfoMgr";
import {LeaguerUpdateInfoApiForm} from "../../../bsModule/storeLeaguerInfo/apiData/LeaguerUpdateInfoApiForm";
import {ClerkInfo} from "../../../bsModule/storeClerkInfo/data/ClerkInfo";
import {StoreAdminRole} from "../../../bsModule/storeClerkInfo/data/storeAdminRole/StoreAdminRole";
import {BUserMgr} from "../../../bsModule/buser/BUserMgr";
import {AppRouter} from "../../../comModule/AppRouter";
import {BUser} from "../../../bsModule/buser/apiData/BUser";
import {StoreClerkInfoSynDataHolder} from "../../../bsModule/storeClerkInfo/StoreClerkInfoSynDataHolder";
import {RadioItem} from "../../zmComp/form/ZmInputRadio";
import {AppCfg} from "../../../comModule/AppCfg";
import {LeaguerDetailSynDataHolder} from "../../../bsModule/leaguerDetail/LeaguerDetailSynDataHolder";
import {LeaguerDetail} from "../../../bsModule/leaguerDetail/data/LeaguerDetail";
import {RestResp} from "../../../comModule/RestResp";
import {LeaguerLabel} from "../../../bsModule/storeLeaguerInfo/data/LeaguerLabel";
import {AttributeItem} from "../addLeaguer/AttributeItem";
import {LeaguerOriginConfig} from "../../../bsModule/storeConfig/data/leaguer/LeaguerOriginConfig";
import {StoreConfig} from "../../../bsModule/storeConfig/data/StoreConfig";
import {LeaguerConfig} from "../../../bsModule/storeConfig/data/LeaguerConfig";
import {LeaguerExpandAttribute} from "../../../bsModule/storeConfig/data/leaguer/LeaguerExpandAttribute";
import {LeaguerAttributeStateEnum} from "../../../bsModule/storeConfig/data/leaguer/LeaguerAttributeStateEnum";
import {StoreConfigSynDataHolder} from "../../../bsModule/storeConfig/StoreConfigSynDataHolder";
import {OperationEnum} from "../../../comModule/enum/OperationEnum";
import {LeaguerLabelModalComp} from "../addLeaguer/LeaguerLabelModalComp";
import {StoreLeaguerInfoSynDataHolder} from "../../../bsModule/storeLeaguerInfo/StoreLeaguerInfoSynDataHolder";
import {LeaguerBaseAttribute} from "../../../bsModule/storeConfig/data/leaguer/LeaguerBaseAttribute";
import {RequiredEnum} from "../../../bsModule/storeConfig/data/leaguer/RequiredEnum";
import {ZmModalMgr} from "../../zmComp/modal/ZmModalMgr";
import {MatDialog} from "@angular/material";
import {StaffPopup, StaffPopupViewData} from "../comp/staffPopup/staffPopup";
import {ClerkData} from "../comp/staffPopup/clerkData";

/**
 * 会员管理 编辑会员
 */
@Component({
  selector:'edit-leaguer',
  templateUrl:'editLeaguer.html',
  styleUrls:['editLeaguer.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})

export class EditLeaguerPage implements OnInit,OnDestroy{

  private viewDataSub: any;
  private paramSub: any;
  private  itembg:number;
  private service: EditLeaguerService;
  public viewData: EditLeaguerViewData;
  public activeModal;
  public today:Date;

  constructor(private storeLeaguerInfoMgr:StoreLeaguerInfoMgr,
              private storeLeaguerInfoSynDataHolder:StoreLeaguerInfoSynDataHolder,
              private leaguerDetailSynDataHolder: LeaguerDetailSynDataHolder,
              private storeClerkInfoSynDataHolder:StoreClerkInfoSynDataHolder,
              private buserMgr:BUserMgr,
              private storeConfigSynDataHolder:StoreConfigSynDataHolder,
              private storeLeaguerInfoViewDataMgr:StoreLeaguerInfoViewDataMgr,
              private cdRef: ChangeDetectorRef,
              private route:ActivatedRoute,
              matDialog: MatDialog) {
    ZmModalMgr.getInstance().reset(matDialog);
    this.service = new EditLeaguerService(this.storeLeaguerInfoMgr,
      this.storeLeaguerInfoSynDataHolder,
      this.leaguerDetailSynDataHolder,
      this.storeClerkInfoSynDataHolder,
      this.buserMgr,
      this.storeConfigSynDataHolder,
      this.storeLeaguerInfoViewDataMgr);
  }

  ngOnInit(): void {
    this.viewDataSub = this.storeLeaguerInfoViewDataMgr.subscribeEditLeaguerVD((viewDataP:EditLeaguerViewData) => {
        this.viewData = viewDataP;
        this.cdRef.markForCheck();
      })
    this.paramSub = this.route.params.subscribe(params =>{
      let leaguerId = params['leaguerId'];
      this.service.initViewData(leaguerId);
    })
  }

  ngOnDestroy(): void {
    if(!AppUtils.isNullObj(this.viewDataSub)){
      this.viewDataSub.unsubscribe();
    }

  }

  /**
   * 获取属性启用
   * @param name
   * @returns {boolean}
   */
  getAttributeEnable(name:string):boolean{
    return !AppUtils.isNullObj(this.viewData.leaguerBaseAttributeMap.get(name))&&(this.viewData.leaguerBaseAttributeMap.get(name).status == LeaguerAttributeStateEnum.Enable);
  }

  /**
   * 获取属性启用提示
   * @param name
   * @param prefix 前缀
   * @returns {string}
   */
  getPlaceholder(name:string, prefix:string):string{
    return prefix + ((!AppUtils.isNullObj(this.viewData.leaguerBaseAttributeMap.get(name))&&(this.viewData.leaguerBaseAttributeMap.get(name).require == RequiredEnum.Required))?"(必填)":"(选填)");
  }

  /**
   * 获取属性启用
   * @param name
   * @returns {boolean}
   */
  getAttrRequired(name:string):boolean{
    return (!AppUtils.isNullObj(this.viewData.leaguerBaseAttributeMap.get(name))&&(this.viewData.leaguerBaseAttributeMap.get(name).require == RequiredEnum.Required))?true:false;
  }


  /**
   * 选择跟进人员弹框
   * @param content
   */
  openChooseClerk() {
    const activeModal = ZmModalMgr.getInstance().newModal(StaffPopup,null,null);
    activeModal.componentInstance.viewData = StaffPopupViewData.fromEditLeaguer(this.viewData);
    activeModal.componentInstance.action = this.refreshChooseClerkName.bind(this);
  }

  /**
   * 刷新服务人员的名称
   */
  refreshChooseClerkName() {
    let nameArr = [];
    this.viewData.choosedClerkList.forEach((item)=>{
      nameArr.push(item.name);
    })
    this.viewData.choosedClerkName = nameArr.join("、");
  }

  /**
   * 设置标签模态框
   */
  openLabel() {
    const activeModal = ZmModalMgr.getInstance().newModal(LeaguerLabelModalComp,null,null);
    activeModal.componentInstance.operation = OperationEnum.EDIT;
    activeModal.componentInstance.selectedLeaguerLabelList = this.viewData.selectedLeaguerLabelList;
    activeModal.componentInstance.action = this.addLabelCallback.bind(this);
  }

  /**
   * 添加标签回调
   */
  addLabelCallback(selectedLeaguerLabelListP:Array<LeaguerLabel>){
    this.viewData.selectedLeaguerLabelList = selectedLeaguerLabelListP;
    this.viewData.choosedLabels = this.viewData.selectedLeaguerLabelList.map((item:LeaguerLabel)=>{
      return item.name;
    });
    this.storeLeaguerInfoViewDataMgr.setEditLeaguerViewData(this.viewData);//刷新页面
  }

  /**
   * 检查扩展属性输入  true为不合格
   * @returns {boolean}
   */
  private checkExpandAttribute():boolean{
    let attritubeList = this.viewData.attritubeList;
    let success:boolean = false;
    for(let i=0; i<attritubeList.length; i++){
      if(attritubeList[i].require && AppUtils.isNullObj(attritubeList[i].value)){
        success = true;
        break;
      }
    }
    return success;
  }

  /**
   * 检查属性是否启用必填 必填返回true
   * @param name
   * @returns {boolean}
   */
  private checkAttribute(name:string):boolean{
    let leaguerBaseAttribute = this.viewData.leaguerBaseAttributeMap.get(name);
    return (!AppUtils.isNullObj(leaguerBaseAttribute)) && (leaguerBaseAttribute.status == LeaguerAttributeStateEnum.Enable) && (leaguerBaseAttribute.require == RequiredEnum.Required);
  }

  /**
   * 页面点击事件 修改会员信息
   */
  updateLeaguerInfo(){
    let updateForm = this.viewData.updateForm;
    updateForm = AppUtils.copyField(updateForm,this.viewData.leaguer);
    //获取日历时间
    updateForm.birthday = this.getBirthday();
    //设置跟进人员
    updateForm.buserIds = this.getChooseClerks();
    //设置头像
    if(this.viewData.headImg){
      updateForm.headImg = this.viewData.headImg;
    }
    //性别
    if(this.viewData.genderValue){
      updateForm.sex = this.viewData.genderValue.value;
    }
    //生日类型
    if(this.viewData.dateTypeValue){
      updateForm.dateType = this.viewData.dateTypeValue.value;
    }
    //标签
    updateForm.labelIds = this.viewData.selectedLeaguerLabelList.map((item:LeaguerLabel)=>{
      return parseInt(item.id);
    })

    if(AppUtils.isNullOrWhiteSpace(updateForm.name)){
      AppUtils.showWarn("提示","会员姓名不能为空");
    }else if(AppUtils.isNullObj(updateForm.phone) || AppUtils.isNullOrWhiteSpace(updateForm.phone)){
      AppUtils.showWarn("提示","手机号不能为空");
    }
    // else if(this.checkAttribute("headImg") && (AppUtils.isNullObj(updateForm.headImg) || AppUtils.isNullOrWhiteSpace(updateForm.headImg))){
    //   AppUtils.showWarn("提示","请上传会员头像");
    // }else if(this.checkAttribute("buserIds") && (updateForm.buserIds.length == 0)){
    //   AppUtils.showWarn("提示","请选择跟进人员");
    // }else if(this.checkAttribute("originId") && (updateForm.originId == 0)){
    //   AppUtils.showWarn("提示","请选择会员来源");
    // }else if(this.checkAttribute("labelIds") && (updateForm.labelIds.length == 0)){
    //   AppUtils.showWarn("提示","请设置会员标签");
    // }else if(this.checkExpandAttribute()){
    //   AppUtils.showWarn("提示","扩展属性必填项不能为空");
    // }
    else{
      //扩展属性
      let expandAttrMap = {};
      this.viewData.attritubeList.forEach((item:AttributeItem)=>{
        expandAttrMap[item.id] = item.value?item.value:"";
        if(!AppUtils.isNullObj(item.value) && !AppUtils.isNullOrWhiteSpace(item.value)){
        }
      })
      updateForm.expandAttrMap = expandAttrMap;
      updateForm.name = AppUtils.trimBlank(updateForm.name);
      updateForm.phone = AppUtils.trimBlank(updateForm.phone.toString());
      this.service.updateLeaguerInfo(updateForm,(restResp:RestResp) =>{
        this.storeLeaguerInfoViewDataMgr.setEditLeaguerViewData(this.viewData);
        if(restResp.code == 200){
          AppUtils.showSuccess("提示","修改成功");
          AppRouter.goFindLeaguer();
        }else{
          AppUtils.showError("提示",restResp.tips);
        }
      })
    }
  }

  /**
   * 获取服务人员
   * @returns {string[]}
   */
  private getChooseClerks():Array<string> {
    let buserIds = new Array<string>();
    let choosedClerkList = this.viewData.choosedClerkList;
    if (choosedClerkList && choosedClerkList.length > 0) {
      let idArr = [];
      for (let i = 0; i < choosedClerkList.length; i++) {
        idArr.push(choosedClerkList[i].id);
      }
      buserIds = idArr;
    }
    return buserIds;
  }

  /**
   * 获取生日
   * @returns {number}
   */
  private getBirthday():number {
    let birthday = 0;
    //获取日历时间
    if (this.viewData.birthday) {
      let arrTmp = [this.viewData.birthday.year, this.viewData.birthday.month, this.viewData.birthday.day];
      let date = new Date(arrTmp.join("/"));
      birthday = date.getTime();
    }
    return birthday;
  }

  /**
   * 上传图片回调
   * @param imgArr
   */
  setImgUrl(imgArr: Array<string>) {
    if (imgArr && imgArr.length > 0){
      this.viewData.imgUrl = AppCfg.getInstance().getImgPreUrl() + imgArr[0];
      //设置上传图片url
      this.viewData.headImg = imgArr[0];
    }
  }

}

export class EditLeaguerService{
  constructor(private storeLeaguerInfoMgr:StoreLeaguerInfoMgr,
              private storeLeaguerInfoSynDataHolder:StoreLeaguerInfoSynDataHolder,
              private leaguerDetailSynDataHolder: LeaguerDetailSynDataHolder,
              private storeClerkInfoSynDataHolder:StoreClerkInfoSynDataHolder,
              private buserMgr:BUserMgr,
              private storeConfigSynDataHolder:StoreConfigSynDataHolder,
              private storeLeaguerInfoViewDataMgr:StoreLeaguerInfoViewDataMgr){}

  public initViewData(leaguerId):void{
    let viewDataTmp = new EditLeaguerViewData();
    this.storeLeaguerInfoViewDataMgr.setEditLeaguerViewData(viewDataTmp);

    this.buildViewData(leaguerId,(viewDataP:EditLeaguerViewData) =>{
      this.handleViewData(viewDataP);
    });
  }

  /**
   * 处理回调
   * @param viewDataP
   */
  public handleViewData(viewDataP:EditLeaguerViewData){
    this.storeLeaguerInfoViewDataMgr.setEditLeaguerViewData(viewDataP);
  }

  /**
   * 初始化页面数据
   * @param leaguerId
   * @param callback
   * @returns {Promise<void>}
   */
  public async buildViewData(leaguerId,callback:(viewDataP:EditLeaguerViewData) => void) {
    let viewDataTmp = new EditLeaguerViewData();
    //请求店铺所有会员
    let storeId = SessionUtil.getInstance().getStoreId();
    let storeClerkInfoId = SessionUtil.getInstance().getIdByStoreId(storeId);
    //会员详细信息
    let leaguer = await this.leaguerDetailSynDataHolder.getData(leaguerId);
    AppUtils.copy(viewDataTmp.leaguer,leaguer);
    if(viewDataTmp.leaguer.headImg){
      viewDataTmp.imgUrl = AppCfg.getInstance().getImgPreUrl()+viewDataTmp.leaguer.headImg;
    }
    let birthday = parseInt(viewDataTmp.leaguer.birthday.toString());
    if(birthday > 0){
      let date = new Date(birthday);
      viewDataTmp.birthday = {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()}
    }
    if(viewDataTmp.leaguer.sex){
      viewDataTmp.genderRadioList.forEach((item)=>{
        if(item.value == viewDataTmp.leaguer.sex){
          viewDataTmp.genderValue = item;
        }
      })
    }
    viewDataTmp.dateTypeRadioList.forEach((item)=>{
      if(item.value == viewDataTmp.leaguer.dateType){
        viewDataTmp.dateTypeValue = item;
      }
    })

    let storeLeaguerInfo = await this.storeLeaguerInfoSynDataHolder.getData(storeId);
    if(!AppUtils.isNullObj(storeLeaguerInfo)){
      let validLeaguerLabelMap = storeLeaguerInfo.getValidLeaguerLabelMap();
      if(!AppUtils.isNullObj(viewDataTmp.leaguer.labelIds)){
        viewDataTmp.leaguer.labelIds.forEach((id:string)=>{
          viewDataTmp.selectedLeaguerLabelList.push(validLeaguerLabelMap.get(id.toString()));
        })
      }
      viewDataTmp.choosedLabels = viewDataTmp.selectedLeaguerLabelList.map((item:LeaguerLabel)=>{
        return item.name;
      });
    }

    //请求店铺所有员工
    let storeClerkInfo = await this.storeClerkInfoSynDataHolder.getData(storeClerkInfoId);
    viewDataTmp.clerkMap = storeClerkInfo.getValidClerkMap();
    viewDataTmp.roleMap = storeClerkInfo.getRoleMap();

    //请求所有员工信息
    let clerkMap = viewDataTmp.clerkMap;
    let clerkIdArray = clerkMap.keys();
    let buserList = await this.buserMgr.findByMultitId(clerkIdArray);

    //构建clerkDataList
    viewDataTmp.clerkDataList = this.getClerkDataList(buserList, clerkMap,viewDataTmp.roleMap);
    viewDataTmp.clerkList = viewDataTmp.clerkDataList;

    //设置跟进人员名称
    let buserIds = viewDataTmp.leaguer.buserIds;
    if (buserIds) {
      viewDataTmp.choosedClerkList = this.getChoosedBusers(buserIds, viewDataTmp.clerkList);
      viewDataTmp.choosedClerkName = this.getChoosedClerkName(viewDataTmp.choosedClerkList);
    }

    //获取会员来源、会员扩展属性列表
    let storeConfig:StoreConfig = await this.storeConfigSynDataHolder.getData(storeId);
    if(!AppUtils.isNullObj(storeConfig)){
      let leaguerConfigTmp = new LeaguerConfig();
      AppUtils.copy(leaguerConfigTmp,storeConfig.leaguerConfig);
      viewDataTmp.originList = leaguerConfigTmp.getLeaguerOriginMap().values();
      viewDataTmp.originList.sort((a:LeaguerOriginConfig,b:LeaguerOriginConfig)=>{
        return parseInt(b.id) - parseInt(a.id);
      })
      //基础属性、扩展属性
      viewDataTmp.leaguerBaseAttributeMap = leaguerConfigTmp.getBaseAttributeMap();
      let expandAttritubeListTmp = leaguerConfigTmp.getLeaguerExpandAttributeMap().values();
      expandAttritubeListTmp.forEach((item:LeaguerExpandAttribute)=>{
        if(item.status == LeaguerAttributeStateEnum.Enable){
          let attributeItem = AttributeItem.formExpandAttribute(item);
          attributeItem.value = viewDataTmp.leaguer.getExpandAttributeMap().get(item.id);
          viewDataTmp.attritubeList.push(attributeItem);
        }
      })
      viewDataTmp.attritubeList.sort((a:AttributeItem,b:AttributeItem)=>{
        return parseInt(a.sort.toString()) - parseInt(b.sort.toString());
      })
    }

    let serviceAddress = AppCfg.getInstance().getServiceAddress();
    viewDataTmp.requestUrl = serviceAddress + "/img/saveImgs/img/storeLeaguerInfo/" + storeId;

    callback(viewDataTmp);
  }

  /**
   * 获取服务人员名称
   * @param choosedClerkList
   * @returns {string}
   */
  private getChoosedClerkName(choosedClerkList:Array<ClerkData>):string{
    let nameArr = [];
    for (let i = 0; i < choosedClerkList.length; i++) {
      nameArr.push(choosedClerkList[i].name);
    }
    return nameArr.join("、");
  }

  /**
   * 组装服务人员
   * @param buserIds
   * @param clerkList
   * @returns {ClerkData[]}
   */
  private getChoosedBusers(buserIds: Array<string>, clerkList:Array<ClerkData>):Array<ClerkData> {
    let choosedClerkList = new Array<ClerkData>();
    for (let i = 0; i < buserIds.length; i++) {
      for (let m = 0; m < clerkList.length; m++) {
        if (clerkList[m].id == buserIds[i]) {
          let clerk = clerkList[m];
          if (!AppUtils.arrayContains(choosedClerkList, clerk)) {
            choosedClerkList.push(clerk);
          }
        }
      }
    }
    return choosedClerkList;
  }

  /**
   * 组装clerkDataList
   * @param buserList
   * @param clerkMap
   * @param roleMap
   * @returns {ClerkData[]}
   */
  private getClerkDataList(buserList: Array<BUser>, clerkMap: ZmMap<ClerkInfo>,roleMap:ZmMap<StoreAdminRole>):Array<ClerkData> {
    let clerkDataList = new Array<ClerkData>();
    for (let i = 0; i < buserList.length; i++) {
      let buser = buserList[i];
      let clerk = clerkMap.get(buser.id);
      let clerkData = new ClerkData();
      clerkData.id = buser.id;
      clerkData.name = buser.name;
      if (clerk.roleSet) {
        //员工对应所有职位
        let roleNameArr = new Array();
        for (let i = 0; i < clerk.roleSet.length; i++) {
          if (roleMap.get(clerk.roleSet[i]) && roleMap.get(clerk.roleSet[i]).name) {
            roleNameArr.push(roleMap.get(clerk.roleSet[i]).name);
          }
        }
        clerkData.roleSetName = roleNameArr.join("、");
      }
      clerkDataList.push(clerkData);
    }
    return clerkDataList;
  }

  /**
   * 修改会员信息
   * @param updateForm
   * @param callbackP
   */
  public updateLeaguerInfo(updateForm,callbackP:(restResp:RestResp) => void){
    let storeId = SessionUtil.getInstance().getStoreId();
    this.storeLeaguerInfoMgr.updateLeaguerInfo(storeId,updateForm).then((restResp:RestResp) =>{
      callbackP(restResp);
    })
  }

}

export class EditLeaguerViewData{
  public choosedLabels: string[];//选中的标签
  public selectedLeaguerLabelList:Array<LeaguerLabel> = new Array<LeaguerLabel>();//已经选中的

  public attritubeList:Array<AttributeItem> = new Array<AttributeItem>();
  public leaguerBaseAttributeMap:ZmMap<LeaguerBaseAttribute> = new ZmMap<LeaguerBaseAttribute>();
  public originList:Array<LeaguerOriginConfig> = new Array<LeaguerOriginConfig>();

  public leaguer:LeaguerDetail = new LeaguerDetail();//当前会员

  public clerkMap:ZmMap<ClerkInfo>;

  public updateForm = new LeaguerUpdateInfoApiForm();
  public headImg: string;//头像url

  public requestUrl: string;//上传图片请求url
  public imgUrl: string = "assets/images/head.png";

  public birthday:any;

  public roleMap: ZmMap<StoreAdminRole>;
  //对应店铺所有员工
  public clerkDataList: Array<ClerkData> = new Array<ClerkData>();
  //对应页面过滤后的列表实体
  public clerkList: Array<ClerkData> = new Array();

  //选中的服务人员列表
  public choosedClerkList: Array<ClerkData> = new Array();
  public choosedClerkListTmp: Array<ClerkData> = new Array();
  public choosedClerkName: string;

  //查询参数
  public queryParam:string;
  //性别
  public genderRadioList = [new RadioItem("男",1),new RadioItem("女",2)];
  public genderValue:RadioItem;
  //阳历阴历
  public dateTypeRadioList = [new RadioItem("阴历",1),new RadioItem("阳历",0)];
  public dateTypeValue:RadioItem;
  constructor(){
    this.updateForm.id = "";
    this.updateForm.name = "";
    this.updateForm.sex = 0;
    this.updateForm.phone = "";
    this.updateForm.buserIds=[];
    this.updateForm.birthday = 0;
    this.updateForm.idCard = "";
    this.updateForm.aliasName = "";
    this.updateForm.wechatNumber = "";
    this.updateForm.recommender = "";
    this.updateForm.origin = "";
    this.updateForm.headImg = "";
    this.updateForm.address = "";
    this.updateForm.company = "";
    this.updateForm.job = "";
    this.updateForm.dateType = 0;
  }
}



