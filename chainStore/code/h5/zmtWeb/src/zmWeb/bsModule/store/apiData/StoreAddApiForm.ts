
export class StoreAddApiForm {
  bossId: string;
  name: string;
  namePass: boolean;
  area: string;
  address: string;
  tel: string;
  telPass: boolean;
  descript: string;
  recommender: string = '';
  recomPhone: string = '';
  company: string = '';
  companyArea: string = '';
  companyAddress: string = '';
  licenseImg: string = '';
  wechatRecommendImg: string = '';
  // 宣传图片 列表
  disseminateImgs: Array<string> = new Array();

}
