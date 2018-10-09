export class LeaguerAddApiForm {
name:string;
namePass:boolean;
sex:number;
phone:number;
phonePass:boolean;
buserIds:Array<string>;
telephone:string;
age:number;
birthday:number;
lunarDay:number;
aliasName:string;
wechatNumber:string;
recommender:string;
origin:string;
headImg:string;
address:string;
company:string;
job:string;
idCard:string;
dateType:number;
originId:number=0;//来源ID
labelIds:Array<number>;//标签
//会员扩展属性 <LeaguerExpandAttribute.id, value>
expandAttrMap:any;
  constructor(){}
}

