import {AppointProduct} from "../data/AppointProduct";

export class AppointmentAddApiForm {
  storeId: string;
  leaguerId: string;
  appointTime: number;
  appointProducts:Array<AppointProduct>;
  creatorId: string;
  creatorName: string;

  constructor() {
  }
}

