export class LeaguerRecordUpdateForm {
    constructor(){}
    title:string;
    titlePass:boolean;
    content:string;
    imgPaths:Array<string>;
    prdIds:Array<string>;// 关联的项目列表
    orderId:string;//关联订单
    orderContent:string;//订单内容
}
