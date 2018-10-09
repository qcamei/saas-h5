export class BossPayInfoAddApiForm {
    constructor(){}
    storeId:number;

    wxpayModel:number; // WxpayModelEnum

    wxpayAppId:string;
    wxpayMchId:string;
    wxpayKey:string;
    wxpayCertPath:string;

    wxpaySubMchId:string; // 微信支付分配的子商户号

    alipayAppId:string;
    alipayPrivateKey:string;
    alipayDevPublicKey:string;
    alipayZfbPublicKey:string;
}
