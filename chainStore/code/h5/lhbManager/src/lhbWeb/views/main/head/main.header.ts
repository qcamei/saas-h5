import {Component, Input, OnInit, ViewChild, ElementRef, Output, EventEmitter} from '@angular/core';
import {SessionUtil} from "../../../comModule/SessionUtil";
import {AppUtils} from "../../../comModule/AppUtils";
import {MainViewData} from "../main.page";
import {AppRouter} from "../../../comModule/AppRouter";

@Component({
  selector: 'zmt-main-header',
  styleUrls: ['main.header.scss'],
  template: `
    <div class="header text-right disFlex align-center pos-r">
        <div class="user disFlex align-center cur-hand pos-r" #user>
            <div class="avatar dib">
                <img src="{{data.imgUrl}}" alt="" />
            </div>
            <span class="mg-l-10 fz-16">{{data.userName}}</span >
            <div class="user-dropList pos-a" *ngIf="showUserDropList">
                <a routerLink="/main/userCenter/userDetail">个人中心</a>
                <a routerLink="/main/userCenter/changePassword">修改密码</a>
                <a (click)="logOut()">退出</a>
            </div>
        </div>       
    </div>
    `,
  host: {
    '(document:click)': 'initDropList($event)',
  },
})
export class MainHeaderComp implements OnInit {

  @Input() data:MainHeaderCompViewData;

  showUserDropList:boolean = false;
  @ViewChild('user') user:ElementRef;

  public viewData:MainHeaderCompViewData = new MainHeaderCompViewData();
  private service:MainHeaderCompService;


  constructor() {
  }

  ngOnInit() {
  }

  initDropList(event) {
    if(this.user.nativeElement.contains(event.target)){
      this.showUserDropList = !this.showUserDropList;
    }else{
      this.showUserDropList = false;
    }
  }

  /**
   * 退出登录
   */
  public logOut(){
    //清空持久化数据
    SessionUtil.getInstance().clearData();
    AppRouter.goLogin();

  }

}


export class MainHeaderCompService{

  constructor(){}

}

export class MainHeaderCompViewData{
  public userName:string = "";
  public imgUrl:string= "";

  public static fromComp(mainViewData:MainViewData):MainHeaderCompViewData{
    let mainHeaderCompViewData = new MainHeaderCompViewData();
    AppUtils.copyField(mainHeaderCompViewData,mainViewData);
    return mainHeaderCompViewData;
  }
}
