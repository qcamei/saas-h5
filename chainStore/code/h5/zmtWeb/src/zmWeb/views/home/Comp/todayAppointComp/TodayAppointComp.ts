import {
  Component, Input, OnChanges, OnInit, ChangeDetectorRef, ChangeDetectionStrategy,
  OnDestroy
} from "@angular/core";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {ZmMap, AppUtils} from "../../../../comModule/AppUtils";
import {Leaguer} from "../../../../bsModule/storeLeaguerInfo/data/Leaguer";
import {BusinessUtil} from "../../../common/Util/BusinessUtil";
import {AppointmentMgr} from "../../../../bsModule/appointment/AppointmentMgr";
import {AppointmentUpdateApiForm} from "../../../../bsModule/appointment/apiData/AppointmentUpdateApiForm";
import {AppointmentUpdateType} from "../../../../bsModule/appointment/apiData/AppointmentUpdateType";
import {AppointmentUpdateStatusApiForm} from "../../../../bsModule/appointment/apiData/AppointmentUpdateStatusApiForm";
import {Appointment} from "../../../../bsModule/appointment/data/Appointment";
import {AppointData} from "../../homeWraper/HomeDataWraper";
import {WorkFlowDataAddByAppoint} from "../../../../bsModule/workFlow/apiData/WorkFlowDataAddByAppoint";
import {WorkFlowMgr} from "../../../../bsModule/workFlow/WorkFlowMgr";
import {AppRouter} from "../../../../comModule/AppRouter";
import {UserPermData} from "../../../../comModule/session/SessionData";
import {StoreLeaguerInfoSynDataHolder} from "../../../../bsModule/storeLeaguerInfo/StoreLeaguerInfoSynDataHolder";
import {TodayAppointViewDataMgr} from "./TodayAppointViewDataMgr";
import {Popup} from "../../../common/popup/popup";
import {AppointmentStatusEnum} from "../../../../bsModule/appointment/data/AppointmentStatusEnum";
@Component({
  selector: 'home-todayAppoint-comp',
  template: ` 
 <!--有预约权限-->
    <div class=" appointmentToday" *ngIf="viewData.buserPermData.isAppointmentAdmin == true">
        <div class="header fz-18">
          今日预约
        </div>
      <div class="contet" fusePerfectScrollbar>
        <div  style="border: 1px solid #EBEFF5;border-radius: 8px;" *ngFor="let item of viewData.todayAppoint;let i = index;" class="item mg-t-20" [ngStyle]="{'margin-top':i === 0 ? '0' : '' }">
          <div class="item-header">
            预约时间：{{item.appointTime|times}}
          </div>
          <div fxLayout="row wrap" fxLayoutAlign="space-between center"  class=" item-con">
            <div fxLayout="row wrap" fxLayoutGap="8px" fxLayoutAlign="start center">
              <img class="item-img" src="{{item.headImg|imgPrePath}}" alt="">
              <div class="dib">
                <p class="font-bold fz-16 my-0 c-message">{{item.name}}</p>
              </div>
              <span class="fz-14 " >{{item.phone}}</span>
            </div>
            <zm-btn  *ngIf="item.status == 1" [stroked] = "true" (zmbtnClick)="turnToConsume(item.id)" name="转为开单"></zm-btn>
          
            <zm-btn *ngIf="item.status == 0"  [stroked] = "true" (zmbtnClick)="receiveAppointment(item.id)" name="接受"></zm-btn>
           
            
            <div class="disFlex align-center" *ngIf="item.status ==3">
              <img src="assets/images/home/icon_Completed.png" alt="">
              <span style="color:#41c071;font-size: 16px;margin-left: 20px;">已完成</span>
            </div>
            
            <div class="disFlex align-center" *ngIf="item.status ==2">
              <img src="assets/images/home/icon_cancel.png" alt="">
              <span style="color:#999999;font-size: 16px;margin-left: 20px;">已取消</span>
            </div>

          </div>
        </div>


        <div *ngIf="viewData.appointLoadingFinish && viewData.todayAppoint.length == 0" class="text-center disFlex hor-center align-center" style="border-top: none;height: 100%;" >
          <div style="">
            <img src="assets/images/subscribe.png" height="220" width="220"/>
            <h4 class="font-bold fz-18">今日暂无预约</h4>
          </div>
        </div>
        <!--有预约权限 无预约数据-->
       
        <!--<no-data [loadingFinish]="viewData.appointLoadingFinish" [dataList]="viewData.todayAppoint" [text]=" '今日暂无预约' "[showImg]="'subscribe'"></no-data>-->
        
      </div>
    </div>`,
  styleUrls:['./todayAppointComp.scss'] ,
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class TodayAppointComp implements OnInit,OnChanges,OnDestroy {

  private service: TodayAppointCompService;
  public viewData: TodayAppointCompViewData;
  @Input() storeId: string;

  constructor(private appointmentMgr: AppointmentMgr,
              private storeLeaguerInfoSynDataHolder: StoreLeaguerInfoSynDataHolder,
              private workFlowMgr: WorkFlowMgr,
              private cdRef: ChangeDetectorRef) {
    this.service = new TodayAppointCompService(this.appointmentMgr, this.storeLeaguerInfoSynDataHolder);
  }


  private isInited: boolean = false;

  ngOnInit(): void {

    TodayAppointViewDataMgr.getInstance().onDataChanged(new TodayAppointCompViewData(), (viewDataTmp: TodayAppointCompViewData) => {
      this.viewData = viewDataTmp;
      this.cdRef.markForCheck();
    });

    TodayAppointViewDataMgr.getInstance().onInformDataChanged(() => {
      this.service.initViewData();
    });

    this.service.initViewData();
    this.isInited = true;
  }

  //切换店铺的时候要调用
  ngOnChanges(): void {
    if (this.isInited) {
      this.service.initViewData();
    }
  }

  ngOnDestroy(): void {
    TodayAppointViewDataMgr.getInstance().onViewDestroy();
  }


  /**
   * 接受预约
   */
  receiveAppointment(appointmentId:string) {
    Popup.getInstance().open("提示", "确定接受预约", () => {
      this.changeState(appointmentId,AppointmentStatusEnum.RECEIVE);
    });
  }

  /**
   * 改变预约接受状态事件
   */
  changeState(appointmentId:string, state) {
    this.service.updateAppointmentState(appointmentId, state).then(
      (success) => {
        if (success) {
          this.service.initViewData();
        }
      }
    );
  }

  /**
   * 预约转收银
   */
  public async turnToConsume(appointmentId:string) {
    Popup.getInstance().open("提示", "是否确定转为开单", () => {
      //修改预约状态
      this.service.updateAppointmentState(appointmentId,AppointmentStatusEnum.SUCCESS).then(
        (success) => {
          //添加工作流
          if (success) {
            let addForm: WorkFlowDataAddByAppoint = this.buildAddForm(appointmentId);
            this.workFlowMgr.addByAppoint(addForm).then(
              (workFlowData) => {
                this.dealResult(workFlowData);
              }
            );
          }
        }
      );
    });
  }

  /**判断添加工作流是否成功*/
  private dealResult(workFlowData) {
    if (!AppUtils.isNullObj(workFlowData)) {
      let workFlowId = workFlowData.id;
      AppRouter.goConsume(workFlowId);
      AppUtils.showSuccess("提示", "转为开单成功");
    } else {
      AppUtils.showError("提示", "转为开单失败");
    }
  }

  /**组装AddForm*/
  private buildAddForm(appointmentId:string) {
    let creatorId = SessionUtil.getInstance().getUserId();
    let addForm = new WorkFlowDataAddByAppoint();
    addForm.appointmentId = appointmentId;
    addForm.creatorId = creatorId;
    return addForm;
  };


}
export class TodayAppointCompService {
  constructor(private appointmentMgr: AppointmentMgr,
              private storeLeaguerInfoSynDataHolder: StoreLeaguerInfoSynDataHolder,) {
  }


  public initViewData() {
    TodayAppointViewDataMgr.getInstance().setData(new TodayAppointCompViewData());

    this.buildViewData((viewDataTmp: TodayAppointCompViewData) => {
      this.handleViewData(viewDataTmp);
    });

  }

  public handleViewData(viewDataP: TodayAppointCompViewData) {
    TodayAppointViewDataMgr.getInstance().setData(viewDataP);
  }

  /**
   * 初始化页面数据
   * @param callback
   */
  public async buildViewData(callBack: (viewDataTmp: TodayAppointCompViewData) => void) {

    let viewDataTmp = new TodayAppointCompViewData();
    let storeId = SessionUtil.getInstance().getStoreId();
    //会员信息
    let storeLeaguerInfo = await this.storeLeaguerInfoSynDataHolder.getData(storeId);
    if (storeLeaguerInfo) {
      viewDataTmp.leaguerMap = storeLeaguerInfo.getAllLeaguerMap();
    }

    viewDataTmp.buserPermData = SessionUtil.getInstance().getUserPermData();
    //初始化时间  今天
    let date = BusinessUtil.getToDayObject();
    let minTime = BusinessUtil.formatMinTime(date);
    let maxTime = BusinessUtil.formatMaxTime(date);

    let appointmentList: Array<Appointment> = await this.appointmentMgr.findAppointmentListByTime(storeId, minTime.toString(), maxTime.toString());
    if (appointmentList.length > 0) {
      //组装今日预约数据
      let appointDataList = await this.buildTodayAppoint(appointmentList, viewDataTmp);
      viewDataTmp.todayAppoint = appointDataList;

    }
    viewDataTmp.appointLoadingFinish = true;
    callBack(viewDataTmp);
  }

  /**
   * 组装今日预约数据
   */
  private async buildTodayAppoint(appointmentList: Array<Appointment>, viewDataTmp: TodayAppointCompViewData) {
    let appointDataList: Array<AppointData> = new Array<AppointData>();
    for (let index in appointmentList) {
      let appoint = appointmentList[index];
      let appointData = new AppointData();
      AppUtils.copy(appointData, appoint);
      let leaguer: Leaguer = viewDataTmp.leaguerMap.get(appoint.leaguerId);
      if (leaguer) {
        appointData.name = leaguer.name;
        appointData.phone = leaguer.phone;
        appointData.headImg = leaguer.headImg;
      }
      appointDataList.push(appointData);
    }
    return appointDataList;
  }

  /**
   * 修改预约状态
   */
  public updateAppointmentState(appointmentId: string, state: number): Promise<boolean> {
    let updateStatusData = new AppointmentUpdateStatusApiForm();
    updateStatusData.status = state;
    return new Promise(resolve => {
      this.appointmentMgr.updateAppointmentState(appointmentId,updateStatusData).then(
        (success) => {
          resolve(success);
        }
      );
    });
  };


}

export class TodayAppointCompViewData {

  //页面数据
  todayAppoint: Array<AppointData> = new Array<AppointData>();
  appointLoadingFinish: boolean = false;

  //准备数据
  leaguerMap: ZmMap<Leaguer>;

  buserPermData: UserPermData = new UserPermData();//登录用户权限

}


