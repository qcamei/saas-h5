export class MUserAddApiForm {
  name: string;
  account: string;
  password: string;
  headImg: string;
  gender: number;
  age: number;
  roleSet :Array<number>;
  verifyCode:string;//验证码

  checked:boolean = true;

  constructor(){}
}
