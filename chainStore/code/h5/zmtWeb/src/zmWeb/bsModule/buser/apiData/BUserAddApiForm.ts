export class BUserAddApiForm {
  name: string;
  phone: string;
  password: string;
  headImg: string;
  gender: number;
  age: number;
  roleSet :Array<number>;
  verifyCode:string;//验证码
  areaCode:string;

  checked:boolean = true;

  constructor(){}
}
