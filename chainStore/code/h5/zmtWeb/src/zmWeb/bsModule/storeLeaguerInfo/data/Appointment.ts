import {OperationNote} from "./OperationNote";

export class Appointment {
  id:string;
  storeId:string;
  name:string;
  sex:number;
  phone:string;
  age:number;

  appointTime:string;// 预约时间
  status:number;// 状态 0:未确认医美师 1:等待医美师确认 2:已接受预约 3:已拒绝预约 4:已成功 5:已失效 6:已取消
  leaguerType:number;// 0:普通消费者 1:是会员
  leaguerId:string;// 会员ID
  beauticianId:string;// 医美师ID
  beauticianName:string;
  productId:string;// 项目ID
  referrer:string;// 推荐人 介绍人

  origin:number;// 来源 0:未知 1:B端员工 2:B端医美师 3:C端用户
  cuserId:string;// C端用户ID

  creatorId:string;// 创建者ID
  creatorName:string;// 创建者名称

  operationNotes:Array<OperationNote>;//操作记录

  createdTime:string;
  lastUpdateTime:string;
  ver:number;
}
