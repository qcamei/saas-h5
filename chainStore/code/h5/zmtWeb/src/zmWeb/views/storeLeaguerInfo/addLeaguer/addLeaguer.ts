import {Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy} from "@angular/core";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {StoreLeaguerInfoViewDataMgr} from "../StoreLeaguerInfoViewDataMgr";
import {StoreLeaguerInfoMgr} from "../../../bsModule/storeLeaguerInfo/StoreLeaguerInfoMgr";
import {LeaguerAddApiForm} from "../../../bsModule/storeLeaguerInfo/apiData/LeaguerAddApiForm";
import {ClerkInfo} from "../../../bsModule/storeClerkInfo/data/ClerkInfo";
import {StoreAdminRole} from "../../../bsModule/storeClerkInfo/data/storeAdminRole/StoreAdminRole";
import {BUserMgr} from "../../../bsModule/buser/BUserMgr";
import {BUser} from "../../../bsModule/buser/apiData/BUser";
import {StoreClerkInfoSynDataHolder} from "../../../bsModule/storeClerkInfo/StoreClerkInfoSynDataHolder";
import {DateTypeEnum} from "../../../bsModule/storeLeaguerInfo/data/DateTypeEnum";
import {RadioItem} from "../../zmComp/form/ZmInputRadio";
import {AppCfg} from "../../../comModule/AppCfg";
import {RestResp} from "../../../comModule/RestResp";
import {StoreConfigSynDataHolder} from "../../../bsModule/storeConfig/StoreConfigSynDataHolder";
import {StoreConfig} from "../../../bsModule/storeConfig/data/StoreConfig";
import {LeaguerConfig} from "../../../bsModule/storeConfig/data/LeaguerConfig";
import {LeaguerOriginConfig} from "../../../bsModule/storeConfig/data/leaguer/LeaguerOriginConfig";
import {StoreLeaguerInfoSynDataHolder} from "../../../bsModule/storeLeaguerInfo/StoreLeaguerInfoSynDataHolder";
import {LeaguerLabel} from "../../../bsModule/storeLeaguerInfo/data/LeaguerLabel";
import {LeaguerLabelModalComp} from "./LeaguerLabelModalComp";
import {OperationEnum} from "../../../comModule/enum/OperationEnum";
import {LeaguerExpandAttribute} from "../../../bsModule/storeConfig/data/leaguer/LeaguerExpandAttribute";
import {RequiredEnum} from "../../../bsModule/storeConfig/data/leaguer/RequiredEnum";
import {LeaguerAttributeStateEnum} from "../../../bsModule/storeConfig/data/leaguer/LeaguerAttributeStateEnum";
import {AttributeItem} from "./AttributeItem";
import {LeaguerBaseAttribute} from "../../../bsModule/storeConfig/data/leaguer/LeaguerBaseAttribute";
import {ZmModalMgr} from "../../zmComp/modal/ZmModalMgr";
import {MatDialog} from "@angular/material";
import {ClerkData} from "../comp/staffPopup/clerkData";
import {StaffPopup, StaffPopupViewData} from "../comp/staffPopup/staffPopup";
import {AddLeaguerFromPageFlag} from "../../../comModule/enum/AddLeaguerFromPageFlag";
import {AppRouter} from "../../../comModule/AppRouter";
import {ActivatedRoute} from "@angular/router";
import {Leaguer} from "../../../bsModule/storeLeaguerInfo/data/Leaguer";
import {StoreLeaguerInfo} from "../../../bsModule/storeLeaguerInfo/data/StoreLeaguerInfo";
import {PromptMsg} from "../../common/Util/PromptMsg";


/**
 * 会员管理 新建会员
 */
@Component({
  selector: 'add-leaguer',
  templateUrl: 'addLeaguer.html',
  styleUrls: ['addLeaguer.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AddLeaguerPage implements OnInit,OnDestroy {

  private viewDataSub: any;
  private paramsSub: any;
  private service: AddLeaguerService;
  public viewData: AddLeaguerViewData;
  private itembg: number;
  public activeModal;
  private fromFlag: number;

  constructor(private storeClerkInfoSynDataHolder: StoreClerkInfoSynDataHolder,
              private storeLeaguerInfoMgr: StoreLeaguerInfoMgr,
              private storeLeaguerInfoSynDataHolder: StoreLeaguerInfoSynDataHolder,
              private buserMgr: BUserMgr,
              private storeConfigSynDataHolder: StoreConfigSynDataHolder,
              private storeLeaguerInfoViewDataMgr: StoreLeaguerInfoViewDataMgr,
              private cdRef: ChangeDetectorRef,
              public route: ActivatedRoute,
              matDialog: MatDialog) {
    ZmModalMgr.getInstance().reset(matDialog);
    this.service = new AddLeaguerService(this.storeClerkInfoSynDataHolder, this.storeLeaguerInfoMgr, this.storeLeaguerInfoSynDataHolder, this.buserMgr, this.storeConfigSynDataHolder, this.storeLeaguerInfoViewDataMgr);
  }

  ngOnInit(): void {
    this.viewDataSub = this.storeLeaguerInfoViewDataMgr.subscribeAddLeaguerVD((viewDataP: AddLeaguerViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.paramsSub = this.route.params.subscribe(params => {
      this.fromFlag = params['fromFlag'];
    });
    this.service.initViewData();
  }

  ngOnDestroy(): void {
    if (!AppUtils.isNullObj(this.viewDataSub)) {
      this.viewDataSub.unsubscribe();
    }
  }

  /**
   * 获取属性启用
   * @param name
   * @returns {boolean}
   */
  getAttributeEnable(name: string): boolean {
    return !AppUtils.isNullObj(this.viewData.leaguerBaseAttributeMap.get(name)) && (this.viewData.leaguerBaseAttributeMap.get(name).status == LeaguerAttributeStateEnum.Enable);
  }

  /**
   * 获取属性启用提示
   * @param name
   * @param prefix 前缀
   * @returns {string}
   */
  getPlaceholder(name: string, prefix: string): string {
    return prefix + ((!AppUtils.isNullObj(this.viewData.leaguerBaseAttributeMap.get(name)) && (this.viewData.leaguerBaseAttributeMap.get(name).require == RequiredEnum.Required)) ? "(必填)" : "(选填)");
  }

  /**
   * 获取属性启用
   * @param name
   * @returns {boolean}
   */
  getAttrRequired(name: string): boolean {
    return (!AppUtils.isNullObj(this.viewData.leaguerBaseAttributeMap.get(name)) && (this.viewData.leaguerBaseAttributeMap.get(name).require == RequiredEnum.Required)) ? true : false;
  }

  /**
   * 选择跟进人员弹框
   * @param content
   */
  openChooseClerk() {
    const activeModal = ZmModalMgr.getInstance().newModal(StaffPopup, null, null);
    activeModal.componentInstance.viewData = StaffPopupViewData.fromAddLeaguer(this.viewData);
    activeModal.componentInstance.action = this.refreshChooseClerkName.bind(this);
  }

  /**
   * 刷新服务人员的名称
   */
  refreshChooseClerkName() {
    let nameArr = [];
    this.viewData.choosedClerkList.forEach((item) => {
      nameArr.push(item.name);
    })
    this.viewData.choosedClerkName = nameArr.join("、");
  }

  /**
   * 设置标签模态框
   */
  openLabel() {
    const activeModal = ZmModalMgr.getInstance().newModal(LeaguerLabelModalComp, null, null);
    activeModal.componentInstance.operation = OperationEnum.ADD;
    activeModal.componentInstance.selectedLeaguerLabelList = this.viewData.selectedLeaguerLabelList;
    activeModal.componentInstance.action = this.addLabelCallback.bind(this);
  }

  /**
   * 添加标签回调
   */
  addLabelCallback(selectedLeaguerLabelListP: Array<LeaguerLabel>) {
    this.viewData.selectedLeaguerLabelList = selectedLeaguerLabelListP;
    this.viewData.choosedLabels = this.viewData.selectedLeaguerLabelList.map((item: LeaguerLabel) => {
      return item.name;
    });
    this.storeLeaguerInfoViewDataMgr.setAddLeaguerViewData(this.viewData);//刷新页面
  }

  /**
   * 检查扩展属性输入  true为不合格
   * @returns {boolean}
   */
  private checkExpandAttribute(): boolean {
    let attritubeList = this.viewData.attritubeList;
    let success: boolean = false;
    for (let i = 0; i < attritubeList.length; i++) {
      if (attritubeList[i].require && AppUtils.isNullObj(attritubeList[i].value)) {
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
  private checkAttribute(name: string): boolean {
    let leaguerBaseAttribute = this.viewData.leaguerBaseAttributeMap.get(name);
    return (!AppUtils.isNullObj(leaguerBaseAttribute)) && (leaguerBaseAttribute.status == LeaguerAttributeStateEnum.Enable) && (leaguerBaseAttribute.require == RequiredEnum.Required);
  }

  /**
   * 页面点击事件 添加会员
   */
  async addLeaguer() {
    let addForm = this.viewData.addForm;
    //获取日历时间
    addForm.birthday = this.getBirthday();
    //设置跟进人员
    addForm.buserIds = this.getChooseClerks();
    //标签
    addForm.labelIds = this.viewData.selectedLeaguerLabelList.map((item: LeaguerLabel) => {
      return parseInt(item.id);
    })
    if (AppUtils.isNullOrWhiteSpace(addForm.name)) {
      AppUtils.showWarn("提示", "会员姓名不能为空");
    } else if (AppUtils.isNullObj(addForm.phone) || AppUtils.isNullOrWhiteSpace(addForm.phone.toString())) {
      AppUtils.showWarn("提示", "手机号不能为空");
    }
    // else if(this.checkAttribute("headImg") && (AppUtils.isNullObj(addForm.headImg) || AppUtils.isNullOrWhiteSpace(addForm.headImg))){
    //   AppUtils.showWarn("提示","请上传会员头像");
    // }else if(this.checkAttribute("buserIds") && (addForm.buserIds.length == 0)){
    //   AppUtils.showWarn("提示","请选择跟进人员");
    // }else if(this.checkAttribute("originId") && (addForm.originId == 0)){
    //   AppUtils.showWarn("提示","请选择会员来源");
    // }else if(this.checkAttribute("labelIds") && (addForm.labelIds.length == 0)){
    //   AppUtils.showWarn("提示","请设置会员标签");
    // }
    // else if(this.checkExpandAttribute()){
    //   AppUtils.showWarn("提示","扩展属性必填项不能为空");
    // }
    else {
      //扩展属性
      let expandAttrMap = {};
      this.viewData.attritubeList.forEach((item: AttributeItem) => {
        expandAttrMap[item.id] = item.value ? item.value : "";
        if (!AppUtils.isNullObj(item.value) && !AppUtils.isNullOrWhiteSpace(item.value)) {
        }
      });
      addForm.expandAttrMap = expandAttrMap;
      addForm.name = AppUtils.trimBlank(addForm.name);
      addForm.sex = this.viewData.genderValue.value;
      addForm.dateType = this.viewData.dateTypeValue.value;

      let restResp: RestResp = await this.service.addLeaguer(addForm);
      this.storeLeaguerInfoViewDataMgr.setAddLeaguerViewData(this.viewData);


      if (!AppUtils.isNullObj(restResp)) {
        if (restResp.code == 200) {
          AppUtils.showSuccess(PromptMsg.PROMPT, PromptMsg.NEW_SUCCESS);

          await this.goPage(addForm.phone);

        } else if (restResp.code == 500) {
          AppUtils.showError(PromptMsg.PROMPT, PromptMsg.NEW_ERROR);
        } else {
          AppUtils.showError(PromptMsg.PROMPT, restResp.tips);
        }
      } else {
        AppUtils.showError(PromptMsg.PROMPT, PromptMsg.NEW_ERROR);
      }


      // this.service.addLeaguer(addForm, (restResp:RestResp) => {
      //   this.storeLeaguerInfoViewDataMgr.setAddLeaguerViewData(this.viewData);
      //   if (restResp.code == 200) {
      //     AppUtils.showSuccess("提示", "添加成功");
      //     // history.go(-1);
      //     await this.goPage(addForm.phone);
      //   } else {
      //     AppUtils.showError("提示", restResp.tips);
      //   }
      // })
    }

  }

  private async goPage(phone: number) {
    let storeId = SessionUtil.getInstance().getStoreId();
    let storeLeaguerInfo: StoreLeaguerInfo = await this.storeLeaguerInfoSynDataHolder.getData(storeId);
    let leaguerMap = storeLeaguerInfo.getLeaguerMapWithPhone();
    let leaguer = leaguerMap.get(phone.toString());
    let leaguerId = leaguer ? leaguer.id : '-';

    if (this.fromFlag == AddLeaguerFromPageFlag.FROM_MANAGE_MODULE) {
      AppRouter.goFindLeaguer();
    } else if (this.fromFlag == AddLeaguerFromPageFlag.FROM_GUIDE) {
      AppRouter.goGuide();
    } else if (this.fromFlag == AddLeaguerFromPageFlag.FROM_CONSUME) {
      AppRouter.goConsumeWithLeaguerId(0, leaguerId);
    } else if (this.fromFlag == AddLeaguerFromPageFlag.FROM_RECHARGE) {
      AppRouter.goRechargeWithLeaguerId(0, leaguerId);
    }
  }

  /**
   * 获取服务人员
   * @returns {string[]}
   */
  private getChooseClerks(): Array<string> {
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
  private getBirthday(): number {
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
    if (imgArr && imgArr.length > 0) {
      this.viewData.imgUrl = AppCfg.getInstance().getImgPreUrl() + imgArr[0];
      //设置上传图片url
      this.viewData.addForm.headImg = imgArr[0];
    }
  }

}

export class AddLeaguerService {
  constructor(private storeClerkInfoSynDataHolder: StoreClerkInfoSynDataHolder,
              private storeLeaguerInfoMgr: StoreLeaguerInfoMgr,
              private storeLeaguerInfoSynDataHolder: StoreLeaguerInfoSynDataHolder,
              private buserMgr: BUserMgr,
              private storeConfigSynDataHolder: StoreConfigSynDataHolder,
              private storeLeaguerInfoViewDataMgr: StoreLeaguerInfoViewDataMgr) {
  }

  public initViewData(): void {
    let viewDataTmp = new AddLeaguerViewData();
    this.storeLeaguerInfoViewDataMgr.setAddLeaguerViewData(viewDataTmp);

    this.buildViewData((viewDataP: AddLeaguerViewData) => {
      this.handleViewData(viewDataP);
    });
  }

  /**
   * 处理回调
   * @param viewDataP
   */
  public handleViewData(viewDataP: AddLeaguerViewData) {
    this.storeLeaguerInfoViewDataMgr.setAddLeaguerViewData(viewDataP);
  }

  public async buildViewData(callback: (viewDataP: AddLeaguerViewData) => void) {
    let viewDataTmp = new AddLeaguerViewData();

    let storeId = SessionUtil.getInstance().getStoreId();

    //请求店铺所有员工
    let clerkInfoId = SessionUtil.getInstance().getIdByStoreId(storeId);
    let storeClerkInfo = await this.storeClerkInfoSynDataHolder.getData(clerkInfoId);
    viewDataTmp.clerkMap = storeClerkInfo.getValidClerkMap();
    viewDataTmp.roleMap = storeClerkInfo.getRoleMap();

    //请求所有员工信息
    let clerkMap = viewDataTmp.clerkMap;
    let clerkIdArray = clerkMap.keys();
    let buserList = await this.buserMgr.findByMultitId(clerkIdArray);

    //构建clerkDataList
    viewDataTmp.clerkDataList = this.getClerkDataList(buserList, clerkMap, viewDataTmp.roleMap);
    viewDataTmp.clerkList = viewDataTmp.clerkDataList;

    //获取会员来源、会员扩展属性列表
    let storeConfig: StoreConfig = await this.storeConfigSynDataHolder.getData(storeId);
    if (!AppUtils.isNullObj(storeConfig)) {
      let leaguerConfigTmp = new LeaguerConfig();
      AppUtils.copy(leaguerConfigTmp, storeConfig.leaguerConfig);
      viewDataTmp.originList = leaguerConfigTmp.getLeaguerOriginMap().values();
      viewDataTmp.originList.sort((a: LeaguerOriginConfig, b: LeaguerOriginConfig) => {
        return parseInt(b.id) - parseInt(a.id);
      })
      //基础属性、扩展属性
      viewDataTmp.leaguerBaseAttributeMap = leaguerConfigTmp.getBaseAttributeMap();
      let expandAttritubeListTmp = leaguerConfigTmp.getLeaguerExpandAttributeMap().values();
      expandAttritubeListTmp.forEach((item: LeaguerExpandAttribute) => {
        if (item.status == LeaguerAttributeStateEnum.Enable) {
          let attributeItem = AttributeItem.formExpandAttribute(item);
          viewDataTmp.attritubeList.push(attributeItem);
        }
      })
      viewDataTmp.attritubeList.sort((a: AttributeItem, b: AttributeItem) => {
        return parseInt(a.sort.toString()) - parseInt(b.sort.toString());
      })
    }

    let serviceAddress = AppCfg.getInstance().getServiceAddress();
    viewDataTmp.requestUrl = serviceAddress + "/img/saveImgs/img/storeLeaguerInfo/" + storeId;

    callback(viewDataTmp);
  }

  /**
   * 组装clerkDataList
   * @param buserList
   * @param clerkMap
   * @param roleMap
   * @returns {ClerkData[]}
   */
  private getClerkDataList(buserList: Array<BUser>, clerkMap: ZmMap<ClerkInfo>, roleMap: ZmMap<StoreAdminRole>): Array<ClerkData> {
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
   * 添加会员
   * @param addForm
   * @param callbackP
   */
  public addLeaguer(addForm) {
    let storeId = SessionUtil.getInstance().getStoreId();
    return this.storeLeaguerInfoMgr.addLeaguer(storeId, addForm);
  }

}

export class AddLeaguerViewData {
  public choosedLabels: string[];//选中的标签
  public selectedLeaguerLabelList: Array<LeaguerLabel> = new Array<LeaguerLabel>();//已经选中的

  public attritubeList: Array<AttributeItem> = new Array<AttributeItem>();
  public leaguerBaseAttributeMap: ZmMap<LeaguerBaseAttribute> = new ZmMap<LeaguerBaseAttribute>();
  public originList: Array<LeaguerOriginConfig> = new Array<LeaguerOriginConfig>();

  public genderRadioList = [new RadioItem("男", 1), new RadioItem("女", 2)];
  public genderValue = this.genderRadioList[1];

  public dateTypeRadioList = [new RadioItem("阴历", 1), new RadioItem("阳历", 0)];
  public dateTypeValue = this.dateTypeRadioList[1];

  public addForm: LeaguerAddApiForm = new LeaguerAddApiForm();

  public birthday: any;

  public clerkMap: ZmMap<ClerkInfo>;

  public requestUrl: string;//上传图片请求url
  public imgUrl: string = "assets/images/head.png";

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
  public queryParam: string;

  constructor() {
    this.addForm.sex = 2;
    this.addForm.dateType = DateTypeEnum.SOLARDATE;
  }

}

