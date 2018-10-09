import {Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy} from "@angular/core";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {AppointmentMgr} from "../../../bsModule/appointment/AppointmentMgr";
import {AppUtils} from "../../../comModule/AppUtils";
import {AppointmentAddApiForm, AppointProduct} from "../../../bsModule/appointment/apiData/AppointmentAddApiForm";
import {AppointDataWraper, ProductData, LeaguerCompData} from "../addAppointWraper/AddAppointDataWraper";
import {AppointDataWraperMgr} from "../addAppointWraper/AddAppointDataWraperMgr";
import {OperateTypeEnum} from "../../../bsModule/appointment/data/OperateTypeEnum";
import {PromptMsg} from "../../common/Util/PromptMsg";
import {StoreConfigSynDataHolder} from "../../../bsModule/storeConfig/StoreConfigSynDataHolder";
import {StoreConfig} from "../../../bsModule/storeConfig/data/StoreConfig";
import {AppointConfig} from "../../../bsModule/storeConfig/data/AppointConfig";
import {AppointTimeConfig} from "../../../bsModule/storeConfig/data/appoint/AppointTimeConfig";
import {ActivatedRoute} from "@angular/router";
import {LeaguerDetailSynDataHolder} from "../../../bsModule/leaguerDetail/LeaguerDetailSynDataHolder";
import {LeaguerDetail} from "../../../bsModule/leaguerDetail/data/LeaguerDetail";
import {AppRouter} from "../../../comModule/AppRouter";


@Component({
  selector: 'addAppointment',
  templateUrl: 'addAppointment.html',
  styleUrls: ['addAppointment.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush  //变化检测器的策略 CheckOnce ->Checked

})


export class AddAppointmentPage implements OnInit,OnDestroy {


  private paramSub:any;
  public leaguerId:string;
  private service: AddAppointmentService;
  public today:Date;
  private _appointDate:any;


  get appointDate(): any {
    return this._appointDate;
  }

  set appointDate(value: any) {
    this._appointDate = value;
    console.log(value);
  }

  public minAppointTime:any;
  public maxAppointTime:any;
  public curAppointTime:any;

  public appointWraperSub: any;
  public appointWraper: AppointDataWraper = new AppointDataWraper();

  public hasLeaguer: boolean = false;
  public hasProduct: boolean = false;
  public submitSuccess:boolean = false;//提交标志

  constructor(private appointmentMgr: AppointmentMgr,
              private appointDataWraperMgr: AppointDataWraperMgr,
              private storeConfigSynDataHolder:StoreConfigSynDataHolder,
              private leaguerDetailSynDataHolder:LeaguerDetailSynDataHolder,
              private route:ActivatedRoute,
              private cdRef: ChangeDetectorRef,) {
    this.service = new AddAppointmentService(this.appointmentMgr);
  }

  public async ngOnInit() {
    this.appointWraper = this.appointDataWraperMgr.initWraper();
    this.appointWraperSub = this.appointDataWraperMgr.subscribeAppointDataWraper((appointWraper: AppointDataWraper) => {

      let appointWraperTmp = new AppointDataWraper();
      AppUtils.copy(appointWraperTmp, appointWraper);
      this.appointWraper = appointWraperTmp;

      let leaguer = this.appointWraper.getLeaguerCompData().selectLeaguer;
      if (leaguer) {
        if (leaguer.id){
          this.hasLeaguer = true;
        }
      }
      let productList = this.appointWraper.getProductCompData().productList;
      if (productList.length > 0) {
        this.hasProduct = true;
      }
      this.cdRef.markForCheck();
    });

    this.paramSub = this.route.params.subscribe((params)=>{
      this.leaguerId = params['leaguerId'];
      if(this.leaguerId != "0"){
        this.leaguerDetailSynDataHolder.getData(this.leaguerId).then((leaguer:LeaguerDetail)=>{
          let leaguerCompData:LeaguerCompData = new LeaguerCompData();
          leaguerCompData.selectLeaguer = leaguer;
          this.appointWraper.setLeaguerCompData(leaguerCompData);
          this.appointDataWraperMgr.refreshWraper(this.appointWraper);
        });
      }
    });

    //预约时间日历控件初始化
    await this.initAppointTime();

  }

  ngOnDestroy() {
    if (!AppUtils.isNullObj(this.appointWraperSub)) {
      this.appointWraperSub.unsubscribe();
    }
    if(!AppUtils.isNullObj(this.paramSub)){
      this.paramSub.unsubscribe();
    }
  }

  private async initAppointTime(){
    const now = new Date();
    this.today = now;
    this._appointDate = {year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()};
    this.curAppointTime = {hour:now.getHours(), minute:now.getMinutes()};

    let storeId = SessionUtil.getInstance().getStoreId();
    let storeConfig:StoreConfig = await this.storeConfigSynDataHolder.getData(storeId);
    let appointConfig:AppointConfig = new AppointConfig();
    AppUtils.copy(appointConfig,storeConfig.appointConfig);
    let appointTimeConfig:AppointTimeConfig = new AppointTimeConfig();
    AppUtils.copy(appointTimeConfig,appointConfig.appointTimeConfig);
    let startTime = appointTimeConfig.startTime;
    let endTime = appointTimeConfig.endTime;

    let startTimeArr = startTime.split(":");
    this.minAppointTime = {hour: startTimeArr[0],minute:startTimeArr[1]};
    let endTimeArr = endTime.split(":");
    this.maxAppointTime = {hour: endTimeArr[0],minute:endTimeArr[1]};

    if(this.getAppointTime(this._appointDate,this.curAppointTime)<this.getAppointTime(this._appointDate,this.minAppointTime)){
      this.curAppointTime = {hour: startTimeArr[0],minute:startTimeArr[1]};
    }


  }

  /**
   * 新建预约点击事件
   */
  public async addAppointment() {
    let listTmp:Array<ProductData> = this.appointWraper.getProductCompData().productList;
    let leaguerId = this.appointWraper.getLeaguerCompData().selectLeaguer.id;

    let checkSuccess = this.checkRequired(listTmp);
    if(checkSuccess){
      let addFormData = this.buildAddFormData(leaguerId,listTmp);
      if(leaguerId){
        let success = await this.service.addAppointment(addFormData);
        this.handleResult(success);
      }
    }
  }

  /**检查必填项*/
  private checkRequired(listTmp):boolean{
    let checkSuccess = true;
    if (listTmp.length == 0) {
      AppUtils.showWarn("提示", "请选择预约项目");
      checkSuccess =  false;
    }
    let appointmentTime = null;
    if(!AppUtils.isNullOrWhiteSpace(this.curAppointTime.hour)
      && !AppUtils.isNullOrWhiteSpace(this.curAppointTime.minute)){
      //预约时间
      appointmentTime = this.getAppointTime(this._appointDate,this.curAppointTime);
      let curTime =  new Date().getTime();

      if(appointmentTime < curTime){
        AppUtils.showWarn("提示", "预约时间不能早于当前时间");
        checkSuccess =  false;
      }

      let maxTime = this.getAppointTime(this._appointDate,this.maxAppointTime);
      let minTime = this.getAppointTime(this._appointDate,this.minAppointTime);

      if(appointmentTime > maxTime || appointmentTime < minTime){
        AppUtils.showWarn("提示", "选择的时间不在店铺可预约时间内，请重新选择");
        checkSuccess =  false;
      }
    }else{
      AppUtils.showWarn("提示", "预约时间不能存在空值");
      checkSuccess =  false;
    }

    return checkSuccess;
  }

  /***组装addForm*/
  private buildAddFormData(leaguerId,listTmp){
    let  addFormDataTmp = new AppointmentAddApiForm();
    let storeId = SessionUtil.getInstance().getStoreId();
    addFormDataTmp.storeId = storeId;
    addFormDataTmp.leaguerId = leaguerId;
    addFormDataTmp.appointTime = this.getAppointTime(this._appointDate,this.curAppointTime);
    addFormDataTmp.appointProducts  = new Array<AppointProduct>();
    addFormDataTmp.appointProducts = this.getAppointProducts(listTmp);
    addFormDataTmp.creatorId = SessionUtil.getInstance().getUserId();
    addFormDataTmp.creatorName = SessionUtil.getInstance().getUserName();
    return addFormDataTmp;
  }

  /**
   * 组装预约时间
   * @return 时间戳
   */
  private getAppointTime(appointDateTmp,appointTimeTmp){
      let appointDate = this.formatDate(appointDateTmp);
      let appointTime = this.formatTime(appointTimeTmp);
      let date = new Date(appointDate + " " + appointTime);
      let time = date.getTime();
      return time;
  }

  /**预约日期格式*/
  private formatDate(appointDate: any):string{
    let arrTmp = [appointDate.year, appointDate.month, appointDate.day];
    let date:string = arrTmp.join("/");
    return date;
  }

  /**预约时间格式*/
  private formatTime(appointTime: any):string{
    let arrTmp = [appointTime.hour, appointTime.minute];
    let time:string = arrTmp.join(":");
    return time;
  }
  /**
   * 组装预约项目
   * @param listTmp Array<ProductData>
   * @return Array<AppointProduct>
   */
  private getAppointProducts(listTmp:Array<ProductData>):Array<AppointProduct>{
    let appointProducts: Array<AppointProduct> = new Array<AppointProduct>();
    for (let i in listTmp) {
      let appointProduct: AppointProduct = new AppointProduct();
      appointProduct.productId = listTmp[i].id;
      appointProduct.productCount = listTmp[i].count;
      appointProduct.productCardId = listTmp[i].productCardId;
      listTmp[i].payType == 0 ?appointProduct.operateType = OperateTypeEnum.CASH:appointProduct.operateType = OperateTypeEnum.SWINGCARD;
      appointProduct.buserIds = listTmp[i].buserId;
      appointProducts.push(appointProduct);
    }
    return appointProducts;
  }


  /**
   * 处理结果
   */
  private handleResult(successP: boolean): void {

    this.submitSuccess = true;//避免重复提交

    if (successP) {
      AppUtils.showSuccess(PromptMsg.PROMPT, PromptMsg.NEW_SUCCESS);
      AppRouter.goAppointmentList();
    } else {
      AppUtils.showError(PromptMsg.PROMPT, PromptMsg.NEW_ERROR);
    }
  }


}


class AddAppointmentService {

  constructor(private appointmentMgr: AppointmentMgr) {
  }

  /**
   *新建方法
   *@param storeId:string
   *@param formData:AddMembershipCard
   *@returns Promise<boolean>
   */
  public addAppointment(formData: AppointmentAddApiForm): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      let success = false;
      this.appointmentMgr.addAppointment(formData).then(
        (appointment) => {
          if (!AppUtils.isNullObj(appointment)) {
            success = true;
          }
          resolve(success);
        }
      )
    });
  }

}


