export class StoreClerk {
    constructor(){}
    id:string;
    storeId:number;
    roleIdIndex:number;
    roleMap:any;//ZmMap<StoreAdminRole>
    applyClerkInfoMap:any;//ZmMap<ApplyClerkInfo>
    clerkInfoMap:any;//ZmMap<ClerkInfo>
    monthPayDays:number;
    createdTime:number;
    lastUpdateTime:number;
    ver:number;
}
