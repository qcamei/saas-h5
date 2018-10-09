
import {DataSynType, DataSynCtrl, DataSynItem, DataSynVer} from "../../comModule/dataSyn/DataSynCtrl";
import {AppUtils} from "../../comModule/AppUtils";
import {Appointment} from "./data/Appointment";
import {AppointmentMgr} from "./AppointmentMgr";


export class AppointmentSynDataHolder {

  private constructorT: {new(): Appointment;};


  constructor(private appointmentMgr: AppointmentMgr) {
  }

  private synType: DataSynType = DataSynType.Appointment;

  public getData(targetId:string):Promise<Appointment> {

    let dataHolder = this;
    return new Promise<Appointment>(resolve => {

      let target: Appointment = DataSynCtrl.Instance.get(Appointment, this.synType, targetId);
      if (target == null) {
        this.appointmentMgr.getAppointment(targetId).then(
          function (appointment) {
            if (appointment != null) {
              DataSynCtrl.Instance.put(dataHolder.newDataSynItem(appointment));
            }
            resolve(appointment);
          }
        );
      }else{
        resolve(target);
      }

    });
  }

  private newDataSynItem(appointment: Appointment): DataSynItem {

    let dataSynItem: DataSynItem = new DataSynItem();
    let dataSynVer: DataSynVer = new DataSynVer();
    dataSynVer.synType = this.synType;
    dataSynVer.id = appointment.id;
    dataSynVer.ver = appointment.ver;

    dataSynItem.synVer = dataSynVer;
    dataSynItem.data = AppUtils.toJson(appointment);
    dataSynItem.obj = appointment;

    return dataSynItem;
  }


}
