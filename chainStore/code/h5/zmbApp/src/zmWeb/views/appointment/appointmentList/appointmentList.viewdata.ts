import {AppointmentQueryForm} from "../../../bsModule/appointment/apiData/AppointmentQueryForm";
import {Appointment} from "../../../bsModule/appointment/data/Appointment";
import {ProductInfo} from "../../../bsModule/StoreProductInfo/data/ProductInfo";
import {ProductType} from "../../../bsModule/StoreProductInfo/data/ProductType";
import {ZmMap} from "../../../comModule/AppUtils";
import {AppointmentStatusEnum} from "../../../bsModule/appointment/data/AppointmentStatusEnum";
import {BUser} from "../../../bsModule/buser/data/BUser";
import {PickerDataItem} from "../../zmBSComp/zmb/picker/zmbPicker/PickerData";

export class AppointmentListViewdata {

  public productMap: ZmMap<ProductInfo> = new ZmMap<ProductInfo>();
  public productTypeMap: ZmMap<ProductType> = new ZmMap<ProductType>();

  public buserList:Array<BUser> = new Array<BUser>();

  public queryForm:AppointmentQueryForm = new AppointmentQueryForm();

  //过滤参数
  minTime: number = 0;
  maxTime: number = 0;

  public loadingFinish:boolean = false;
  public status:number = -1;
  public appointListShow: Array<AppointmentVD> = new Array<AppointmentVD>();
  public appointTabList = [{name: '全部', value: -1}, {name: '已接受', value: 1}, {name: '未接受', value: 0},
    {name: '已取消',value: 2}];
  public selectedAppointTab: any = this.appointTabList[0];

  public cancelReasonList: Array<PickerDataItem> = new Array<PickerDataItem>(); //取消预约原因列表

  public currentSelectedAppointId:string = ''; //当前选中的预约id

  public isFromHomePage:boolean = false; //是否是从home页面我的预约进入的

  constructor(){

  }

  getBuserNameWithIds(ids:Array<string>):string{
    if (ids.length == 0) {
      return '-';
    }
    let buserNameList:Array<string> = new Array<string>();
    for (let buserId of ids){
      let  buserName = this.getBuserWithId(buserId);
      if (buserName.length > 0) {
        buserNameList.push(buserName);
      }
    }
    return buserNameList.join(',');
  }

  getBuserWithId(buserId:string):string{
    for (let buser of this.buserList) {
      if (buserId == buser.id){
        return buser.name;
      }
    }
    return '';
  }


}

export class AppointmentVD {
  public appointment:Appointment = new Appointment();
  public leaguerName:string = '';
  public statusName:string = '';
  appointProducts: Array<AppointPrdData> = new Array<AppointPrdData>();

  public static formAppoint(appointment:Appointment){
    let appointmentVD:AppointmentVD = new AppointmentVD();
    appointmentVD.appointment = appointment;
    appointmentVD.leaguerName = appointment.name;
    appointmentVD.statusName = appointmentVD.getAppointmentStatusName(appointment.status);
    //初始化一下
    appointmentVD.appointProducts = new Array<AppointPrdData>();
    return appointmentVD;
  }

  getAppointmentStatusName(status:number):string{
    let statusName = '-';
    switch (status){
      case AppointmentStatusEnum.CANCEL:
        statusName = '已取消';
        break;
      case AppointmentStatusEnum.NEW:
        statusName = '未接受';
        break;
      case AppointmentStatusEnum.RECEIVE:
        statusName = '已接受';
        break;
      case AppointmentStatusEnum.SUCCESS:
        statusName = '已完成';
        break;
      default:
        break;
    }
    return statusName;
  }

}

export class AppointPrdData {
  prdId: string;
  prdName: string;
  prdImg: string;
  prdTypeName: string;
  count:number;
  buserName:string; //多个服务人员 用，隔开
}
