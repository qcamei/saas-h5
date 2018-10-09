export class LeaguerDetailQueryForm {
    constructor(){}
    minTime:string;
    maxTime:string;
    storeId:string;
    leaguerNameOrPhone:string;// 手机或者名称
    leaguerType:number = 0;// 会员类型 对应leaguerTypeEnum
    sortType:number = 0;// 排序类型 对应sortTypeEnum
    sort:number = 0;// 升/降序 对应sortEnum
    pageItemCount:number = 0;
    pageNo:number = 1;
}
