export class SmsAPIForm {
  phoneNumbers: string;// 目标号码 多个号码请用,分割 最多支持200个号码
  content: string;// 短信验证码、应用下载链接等
  smsType: number;// 短信类型 如：验证码、邀请通知、预约通知等 SmsTypeEnum
  originType: number;// 来源 storeMs/customerMs等 OriginTypeEnum
  signName: string;// 智美通
  dictMap:any;// 短信验证码、应用下载链接等   如：{"code":"2546"} {"name":"lisi","url":"kjkk"}
}
