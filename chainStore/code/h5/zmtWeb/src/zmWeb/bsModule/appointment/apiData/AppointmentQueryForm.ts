export class AppointmentQueryForm {

  minTime: string = "0";
  maxTime: string = "0";
  storeId: string;

  cuserId: number;
  leaguerId: string;
  leaguerName: string = "";
  origin:string = "-1";
  status: string = "-1";//状态，如果需要查询多个，请用,号分割
  statusSet: Array<number>;

  sort: number = -1;
  buserId: string;

  pageItemCount:number = 10;
  pageNo:number = 1;

  constructor() {
  }

}




