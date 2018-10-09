export class WorkFlowDataQueryForm {
  storeId: string;
  buserId:string = "0";

  pageItemCount: number = 10;
  pageNo: number = 1;

  workFlowTypeId:number = 0;
  status:string = "";
  minTime: string = "0";
  maxTime: string = "0";
  leaguerNameOrPhone:string = "";//编号、姓名、手机号

  constructor() {
  }

  public setWorkFlowTypeId(workFlowTypeIdP:number){
    this.workFlowTypeId = workFlowTypeIdP;
  }

  public setLeaguerNameOrPhone(leaguerNameOrPhoneP:string){
    this.leaguerNameOrPhone = leaguerNameOrPhoneP;
  }

}
