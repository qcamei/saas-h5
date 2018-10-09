import {Injectable} from "@angular/core";
import {UserDetailViewData} from "./userDetail/userDetail";
import {Subject, BehaviorSubject} from "rxjs";
import {ChangePasswordViewData} from "./changePassword/ChangePasswordViewData";
import {ChangePwdVCodeViewData} from "./changePassword/comp/ChangePwdVCode";

@Injectable()
export class UserCenterViewDataMgr{

  private userDetailVD:Subject<UserDetailViewData> = new BehaviorSubject<UserDetailViewData>(null);
  private changePasswordVD:Subject<ChangePasswordViewData> = new BehaviorSubject<ChangePasswordViewData>(null);

  //userDetail
  public setUserDetailViewData(userDetailViewData:UserDetailViewData):void{
    this.userDetailVD.next(userDetailViewData);
  }

  public subscribeUserDetailVD(func:(userDetailViewData:UserDetailViewData) => void){
    this.userDetailVD.subscribe(func);
  }

  //changePassword
  public setChangePasswordViewData(changePasswordViewData:ChangePasswordViewData):void{
    this.changePasswordVD.next(changePasswordViewData);
  }

  public subscribeChangePasswordVD(func:(userDetailViewData:ChangePasswordViewData) => void){
    this.changePasswordVD.subscribe(func);
  }

  private changePwdVCodeVDS: Subject<ChangePwdVCodeViewData> = new BehaviorSubject<ChangePwdVCodeViewData>(null);//观察者对象

  public subscribeChangePwdVCodeVD(func: (viewData: ChangePwdVCodeViewData) => void) {
    this.changePwdVCodeVDS.subscribe(func);
  }

  public setChangePwdVCodeViewData(changePwdVCodeViewData: ChangePwdVCodeViewData): void {
    this.changePwdVCodeVDS.next(changePwdVCodeViewData);
  }

}
