import {Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy} from "@angular/core";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {StoreLeaguerInfoViewDataMgr} from "../StoreLeaguerInfoViewDataMgr";
import {StoreLeaguerInfoMgr} from "../../../bsModule/storeLeaguerInfo/StoreLeaguerInfoMgr";
import {MembershipCard} from "../../../bsModule/storeCardInfo/data/MembershipCard";
import {UpdateMemberCardForm} from "../../../bsModule/storeLeaguerInfo/apiData/UpdateMemberCardForm";
import {AppRouter} from "../../../comModule/AppRouter";
import {ValidPerioItem} from "../../zmComp/form/zmValidPeriodRadio";
import {LimitUnitEnum} from "../../../bsModule/storeLeaguerInfo/data/LimitUnitEnum";
import {LeaguerDetailMgr} from "../../../bsModule/leaguerDetail/LeaguerDetailMgr";
import {LeaguerDetailQueryForm} from "../../../bsModule/leaguerDetail/apiData/LeaguerDetailQueryForm";
import {PageResp} from "../../../comModule/PageResp";
import {LeaguerDetail} from "../../../bsModule/leaguerDetail/data/LeaguerDetail";
import {MemberCardExist} from "../../../bsModule/leaguerDetail/data/MemberCardExist";
import {StoreCardInfoSynDataHolder} from "../../../bsModule/storeCardInfo/StoreCardInfoSynDataHolder";
import {Popup} from "../../common/popup/popup";
import {BUser} from "../../../bsModule/buser/apiData/BUser";
import {BUserCacheMgr} from "../../../bsModule/buser/BUserCacheMgr";
import {StoreClerkInfoSynDataHolder} from "../../../bsModule/storeClerkInfo/StoreClerkInfoSynDataHolder";
import {StoreAdminRole} from "../../../bsModule/storeClerkInfo/data/storeAdminRole/StoreAdminRole";
import {ClerkInfo} from "../../../bsModule/storeClerkInfo/data/ClerkInfo";
import {BUserMgr} from "../../../bsModule/buser/BUserMgr";
import {LeaguerUpdateInfoApiForm} from "../../../bsModule/storeLeaguerInfo/apiData/LeaguerUpdateInfoApiForm";
import {BuserPopup} from "../comp/buserPopup/buserPopup";
import {MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../zmComp/modal/ZmModalMgr";
import {ClerkData} from "../comp/staffPopup/clerkData";
import {AddLeaguerFromPageFlag} from "../../../comModule/enum/AddLeaguerFromPageFlag";

/**
 * 会员管理 会员查询/会员列表
 */
@Component({
  selector:'find-leaguer',
  templateUrl:'findLeaguer.html',
  styleUrls:['findLeaguer.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})

export class FindLeaguerPage implements OnInit,OnDestroy{

  private viewDataSub: any;
  private service: FindLeaguerService;
  public viewData: FindLeaguerViewData;
  public myModal:any;

  constructor(private storeLeaguerInfoMgr:StoreLeaguerInfoMgr,
              private storeCardInfoSynDataHolder:StoreCardInfoSynDataHolder,
              private buserCacheMgr:BUserCacheMgr,
              private storeLeaguerInfoViewDataMgr:StoreLeaguerInfoViewDataMgr,
              private storeClerkInfoSynDataHolder:StoreClerkInfoSynDataHolder,
              private buserMgr:BUserMgr,
              private leaguerDetailMgr:LeaguerDetailMgr,
              private cdRef: ChangeDetectorRef,
              private matDialog: MatDialog){
    ZmModalMgr.getInstance().reset(matDialog);
    this.service = new FindLeaguerService(this.storeLeaguerInfoMgr,this.leaguerDetailMgr,this.storeCardInfoSynDataHolder,this.storeClerkInfoSynDataHolder,this.buserMgr,this.buserCacheMgr,this.storeLeaguerInfoViewDataMgr);
  }

  ngOnInit(): void {
    this.viewDataSub = this.storeLeaguerInfoViewDataMgr.subscribeFindLeaguerVD((viewDataP:FindLeaguerViewData) => {
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
   getDay(time : number):number{
    let nowDate = new Date();
    var milliSeconde = nowDate.getTime() - time;
    var timeDiff = Math.round(milliSeconde/(24*60*60*1000));
    return timeDiff;
  }

  getBuserNames(item:LeaguerDetail):Array<string> {
    var buserNames = item.buserIds.map((item) => {
      return this.viewData.buserMap.get(item) ? this.viewData.buserMap.get(item).name : '-';
    });
    return buserNames;
  }

  /**
   * 分配负责人弹框
   * @param leaguer
   */
  openChooseClerk(leaguer:LeaguerDetail) {
    this.viewData.queryParam = undefined;
    const activeModal = ZmModalMgr.getInstance().newModal(BuserPopup);
    activeModal.componentInstance.data = leaguer;
    activeModal.componentInstance.action = ()=>{
      this.storeLeaguerInfoViewDataMgr.setFindLeaguerViewData(this.viewData);
    };
  }

  /**
   * 设置会员卡模态框
   * @param content
   * @param leaguer
   */
  openSettingMemberCard(content,leaguer:LeaguerDetail) {
    this.myModal = ZmModalMgr.getInstance().newModal(content);
    this.viewData.choosedLeaguer = leaguer;
    let leaguerMemberCard = this.viewData.choosedLeaguer.leaguerMemberCard;
    if(!AppUtils.isNullObj(leaguerMemberCard) && !AppUtils.isNullOrWhiteSpace(leaguerMemberCard.cardId)){//已设置会员卡
      this.viewData.choosedCardId = leaguerMemberCard.cardId;//会员卡id
      if(leaguerMemberCard.number){//会员卡号
        this.viewData.updateMemberCardForm.number = leaguerMemberCard.number;
      }
      if(leaguerMemberCard.limitUnit == LimitUnitEnum.EMPTY){//有效期永久
        this.viewData.validPerioItem = new ValidPerioItem(0,null,1);
      }else{
        this.viewData.validPerioItem = new ValidPerioItem(1,leaguerMemberCard.limitTime,leaguerMemberCard.limitUnit);
      }
    }else{
      this.viewData.choosedCardId = undefined;
      this.viewData.updateMemberCardForm.number = undefined;
      this.viewData.validPerioItem = new ValidPerioItem(0,null,1);
    }
  }

  /**
   * 选择服务人员
   * @param index
   */
  chooseClerk(index) {
    let clerk = this.viewData.clerkList[index];
    let choosedClerkListTmp = this.viewData.choosedClerkListTmp;
    if (!AppUtils.arrayContains(choosedClerkListTmp, clerk)) {
      choosedClerkListTmp.push(clerk);
    } else {
      AppUtils.showWarn("提示", "已选择该服务人员");
    }
  }

  /**
   * 删除选中的服务人员
   * @param index
   */
  delChoosedClerk(index) {
    this.viewData.choosedClerkListTmp.splice(index, 1);
  }

  /**
   * 刷新服务人员的名称
   */
  refreshChooseClerkName() {
    let choosedClerkList = this.viewData.choosedClerkList;
    let nameArr = [];
    for (let i = 0; i < choosedClerkList.length; i++) {
      nameArr.push(choosedClerkList[i].name);
    }
    // this.viewData.choosedClerkName = nameArr.join("、");
  }

  /**
   * 查询会员 页面点击事件
   */
  findLeaguer(){
    this.viewData.queryForm.leaguerNameOrPhone = AppUtils.isNullOrWhiteSpace(this.viewData.queryForm.leaguerNameOrPhone)?"":AppUtils.trimBlank(this.viewData.queryForm.leaguerNameOrPhone);
    this.getPageData(1);
  }

  /**
   * 点击事件 跳转新建会员页面
   */
  goAddLeaguer(){
    AppRouter.goAddLeaguer(AddLeaguerFromPageFlag.FROM_MANAGE_MODULE);
  }

  /**
   * 点击事件 跳转会员详情页面
   * @param leaguerId
   */
  goLeaguerDetail(leaguerId){
    AppRouter.goLeaguerDetail(leaguerId);
  }

  /**
   * 点击事件 跳转编辑会员信息页面
   * @param leaguerId
   */
  goEditLeaguer(leaguerId){
    AppRouter.goEditLeaguer(leaguerId);
  }

  /**
   * 点击事件 删除会员
   * @param leaguer
   */
  deleteLeaguer(leaguer:LeaguerDetail){
    let tips = "确定删除"+leaguer.name+"？";
    let checkLeaguerProductCard = leaguer.checkLeaguerProductCard();
    if(leaguer.leaguerMemberCard.balance > 0 || checkLeaguerProductCard){
      tips = "该会员还有未消费的卡项，确定要删除？"
    }
    Popup.getInstance().open("删除会员",tips,() =>{
      this.service.deleteLeaguer(leaguer.id,(successP:boolean) =>{
        if(successP){
          AppUtils.showSuccess("提示","删除成功");
          this.service.initViewData();
        }else{
          AppUtils.showSuccess("提示","删除失败");
        }
      })
    })
  }

  /**
   * 页面点击事件 设置会员卡
   */
  async updateMemberCard(){
    let updateForm = this.viewData.updateMemberCardForm;
    let cardNumber = this.viewData.choosedLeaguer.leaguerMemberCard.number;
    if(!AppUtils.isNullObj(updateForm.number) && !AppUtils.isNullOrWhiteSpace(updateForm.number)){
      updateForm.number = AppUtils.trimBlank(updateForm.number);
      let checkMemberCardNumber = await this.service.checkMemberCardNumber(updateForm.number);
      let exist = checkMemberCardNumber.exist == 'true'?true:false;
      if((updateForm.number!=cardNumber) && exist){
        AppUtils.showWarn("提示","会员卡号重复");
        return;
      }
    }
    updateForm.leaguerId = this.viewData.choosedLeaguer.id;
    updateForm.cardId = this.viewData.choosedCardId;
    updateForm.limitTime = this.viewData.validPerioItem.value;
    updateForm.limitUnit = this.viewData.validPerioItem.unit;
    if(this.viewData.validPerioItem && this.viewData.validPerioItem.type == 0){
      updateForm.limitUnit = 0;
    }
    if(AppUtils.isNullObj(updateForm.cardId) || AppUtils.isNullOrWhiteSpace(updateForm.cardId)){
      AppUtils.showWarn("提示","请选择会员卡");
    }else if(this.viewData.validPerioItem.type == 1
      && !AppUtils.isPositiveInteger(this.viewData.validPerioItem.value+"")){
      AppUtils.showWarn("提示","请输入正确的有效期");
    }else{
      this.service.updateMemberCard(updateForm,(successP:boolean) =>{
        if(successP){
          AppUtils.showSuccess("提示","设置成功");
          this.service.initViewData();
          this.myModal.close();
        }else{
          AppUtils.showError("提示","设置失败");
        }
      })
    }
  }

  /**
   * 分页过滤数据
   */
  getPageData(curPage){
    this.service.getPageData(curPage,this.viewData);
  }

  /**
   * 页面点击事件 查询员工
   */
  findServiceClerk(){
    if(!AppUtils.isNullObj(this.viewData.queryParam)){
      this.viewData.queryParam = AppUtils.trimBlank(this.viewData.queryParam);//去掉空格
      this.viewData.clerkList = this.viewData.clerkDataList.filter((item) =>{
        if(item.name && item.name.indexOf(this.viewData.queryParam) > -1){
          return true;
        }else{
          return false;
        }
      })
    }
  }

  /**
   * 取消
   */
  closeModal(){
    this.viewData.choosedClerkListTmp.splice(0,this.viewData.choosedClerkListTmp.length);
    this.viewData.choosedClerkList = [];
    this.myModal.close();
  }

  /**
   * 确定关闭
   */
  confirm(){
    this.viewData.choosedClerkList.splice(0,this.viewData.choosedClerkList.length);
    this.viewData.choosedClerkListTmp.forEach((item) =>{
      this.viewData.choosedClerkList.push(item);
    })
    // this.refreshChooseClerkName();
    this.updateMemberCard()
    this.closeModal();
  }
}

export class FindLeaguerService{
  constructor(private storeLeaguerInfoMgr:StoreLeaguerInfoMgr,
              private leaguerDetailMgr:LeaguerDetailMgr,
              private storeCardInfoSynDataHolder:StoreCardInfoSynDataHolder,
              private storeClerkInfoSynDataHolder:StoreClerkInfoSynDataHolder,
              private buserMgr:BUserMgr,
              private buserCacheMgr:BUserCacheMgr,
              private storeLeaguerInfoViewDataMgr:StoreLeaguerInfoViewDataMgr){}

  public initViewData():void{
    let viewDataTmp = new FindLeaguerViewData();
    this.storeLeaguerInfoViewDataMgr.setFindLeaguerViewData(viewDataTmp);

    this.buildViewData((viewDataP:FindLeaguerViewData) =>{
      this.handleViewData(viewDataP);
    });
  }

  /**
   * 处理回调数据
   * @param viewDataP
   */
  public handleViewData(viewDataP){
    this.storeLeaguerInfoViewDataMgr.setFindLeaguerViewData(viewDataP);
  }

  /**
   * 查询storeLeaguerInfo
   * @param callback
   */
  public async buildViewData(callback:(viewDataP:FindLeaguerViewData) => void){
    let viewDataTmp = new FindLeaguerViewData();

    let storeId = SessionUtil.getInstance().getStoreId();
    let storeClerkInfoId = SessionUtil.getInstance().getIdByStoreId(storeId);

    viewDataTmp.queryForm.storeId = storeId;
    viewDataTmp.queryForm.pageItemCount = 10;
    viewDataTmp.queryForm.pageNo = 1;
    let pageResp:PageResp = await this.leaguerDetailMgr.getLeaguerDetailPageInfo(viewDataTmp.queryForm);

    this.buildLeaguerList(pageResp).then((leaguerList : Array<LeaguerDetail>) => {
      viewDataTmp.leaguerList = leaguerList;
      this.handleViewData(viewDataTmp);
    });
    viewDataTmp.page = pageResp.pageNo;
    viewDataTmp.recordCount = pageResp.totalCount;

    //请求店铺所有员工
    let storeClerkInfo = await this.storeClerkInfoSynDataHolder.getData(storeClerkInfoId);
    viewDataTmp.clerkMap = storeClerkInfo.getValidClerkMap();
    viewDataTmp.roleMap = storeClerkInfo.getRoleMap();

    //请求所有员工信息
    let clerkMap = viewDataTmp.clerkMap;
    let clerkIdArray = clerkMap.keys();
    let buserList = await this.buserMgr.findByMultitId(clerkIdArray);

    buserList.forEach((item) =>{
      viewDataTmp.buserMap.put(item.id,item);
    });

    //构建clerkDataList
    viewDataTmp.clerkDataList = this.getClerkDataList(buserList, clerkMap,viewDataTmp.roleMap);
    viewDataTmp.clerkList = viewDataTmp.clerkDataList;

    //设置跟进人员名称
    let buserIds = viewDataTmp.choosedLeaguer.buserIds;
    if (buserIds) {
      viewDataTmp.choosedClerkList = this.getChoosedBusers(buserIds, viewDataTmp.clerkList);
      // viewDataTmp.choosedClerkName = this.getChoosedClerkName(viewDataTmp.choosedClerkList);
    }

    let storeCardInfo = await this.storeCardInfoSynDataHolder.getData(storeId);
    let openMemberCardMap = storeCardInfo.getOpenMemberCardMap();
    viewDataTmp.memberCardMap = openMemberCardMap;
    viewDataTmp.memberCardList = openMemberCardMap.values();

    viewDataTmp.loadingFinish = true;
    callback(viewDataTmp);
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
   * build 列表数据
   * @param pageResp
   * @returns {LeaguerDetail[]}
   */
  private async buildLeaguerList(pageResp: PageResp):Promise<Array<LeaguerDetail>> {
    var leaguerList: Array<LeaguerDetail> = [];
    for (let item of pageResp.list) {
      let buserMap:ZmMap<BUser> = await this.buserCacheMgr.getList(item.buserIds);
      item.buserName = this.getBuserName(item.buserIds,buserMap);
      leaguerList.push(item.encryptLeaguerDetail4New());
    }
    return leaguerList;
  }

  /**
   * 获取服务人员姓名
   */
  private getBuserName(buserIdArray:Array<string>,buserMap:ZmMap<BUser>):string{
    let buserNameArr = [];
    for (let i in buserIdArray) {
      let buser = buserMap.get(buserIdArray[i]);
      if(buser){
        buserNameArr.push(buser.name);
      }
    }
    return buserNameArr.join("、");
  }

  /**
   * 获取分页数据
   * @param curPage
   * @param viewData
   */
  public async getPageData(curPage:number,viewData:FindLeaguerViewData){
    let storeId = SessionUtil.getInstance().getStoreId();
    viewData.queryForm.storeId = storeId;
    viewData.queryForm.pageItemCount = 10;
    viewData.queryForm.pageNo = curPage;
    let pageResp:PageResp = await this.leaguerDetailMgr.getLeaguerDetailPageInfo(viewData.queryForm);

    this.buildLeaguerList(pageResp).then((leaguerList : Array<LeaguerDetail>) => {
      viewData.leaguerList = leaguerList;
      this.handleViewData(viewData);
    });
    viewData.page = pageResp.pageNo;
    viewData.recordCount = pageResp.totalCount;
  }

  /**
   * 删除会员
   * @param leaguerId
   * @param callback
   */
  public deleteLeaguer(leaguerId, callback:(successP:boolean) => void){
    let storeId = SessionUtil.getInstance().getStoreId();
    this.storeLeaguerInfoMgr.deleteLeaguer(storeId,leaguerId).then((success) =>{
      callback(success);
    })
  }

  /**
   * 设置会员卡
   * @param updateForm
   * @param callback
   */
  public updateMemberCard(updateForm:UpdateMemberCardForm, callback:(successP:boolean) => void){
    let storeId = SessionUtil.getInstance().getStoreId();
    this.storeLeaguerInfoMgr.updateMemberCard(storeId,updateForm).then((success) =>{
      callback(success);
    })
  }

  /**
   * 检查会员卡号是否重复
   * @param cardNumber
   * @returns {Promise<MemberCardExist>}
   */
  public checkMemberCardNumber(cardNumber:string):Promise<MemberCardExist>{
    let storeId = SessionUtil.getInstance().getStoreId();
    return this.leaguerDetailMgr.checkMemberCardExist(storeId,cardNumber);
  }

}

export class FindLeaguerViewData{
  public validPerioItem:ValidPerioItem = new ValidPerioItem(0,null,0);//默认永久
  //查询结果列表
  public leaguerList:Array<LeaguerDetail> = new Array();
  //设置会员卡选中的会员
  public choosedLeaguer:LeaguerDetail = new LeaguerDetail();

  public clerkMap:ZmMap<ClerkInfo>;

  public roleMap: ZmMap<StoreAdminRole>;
  //对应店铺所有员工
  public clerkDataList: Array<ClerkData> = new Array<ClerkData>();
  //对应页面过滤后的列表实体
  public clerkList: Array<ClerkData> = new Array();

  public buserMap: ZmMap<BUser> = new  ZmMap<BUser>();

  //选中的服务人员列表
  public choosedClerkList: Array<ClerkData> = new Array();
  public choosedClerkListTmp: Array<ClerkData> = new Array();

  //店铺会员卡map
  public memberCardMap: ZmMap<MembershipCard>;
  public memberCardList: Array<MembershipCard>;
  //选中的会员卡id
  public choosedCardId:string;
  //设置会员卡form
  public updateMemberCardForm:UpdateMemberCardForm = new UpdateMemberCardForm();

  //修改负责人
  public updateLeaguerInfoForm:LeaguerUpdateInfoApiForm = new LeaguerUpdateInfoApiForm();

  public page:number;//当前页码
  public recordCount:number;//总记录数

  public loadingFinish :boolean = false;

  public queryForm = new LeaguerDetailQueryForm();

  //员工查询参数
  public queryParam:string;

  constructor(){
    this.updateMemberCardForm.limitUnit = 1;
  }


}


