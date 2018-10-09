export class LeaguerDetailQueryForm {
    constructor(){}
    minTime:string;
    maxTime:string;
    storeId:string;
    leaguerNameOrPhone:string;// 手机或者名称
    leaguerType:number = 0;// 会员类型 对应leaguerTypeEnum
    sortType:number = 0;// 排序类型 对应sortTypeEnum
    sort:number = 0;// 升/降序 对应sortEnum
    memberCardExpiredState:number = 0;//会员卡到期状态 对应ExpiredStateEnum
    pageItemCount:number = 10;
    pageNo:number = 1;
}
