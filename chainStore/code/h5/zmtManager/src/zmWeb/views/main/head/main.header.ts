import {Component, Input, OnInit, ViewChild, ElementRef, Output, EventEmitter} from '@angular/core';
import {SessionUtil} from "../../../comModule/SessionUtil";
import {AppUtils} from "../../../comModule/AppUtils";
import {MainViewData} from "../main.page";
import {SimpleStore, StoreData, UserPermData} from "../../../comModule/UserData";
import {AppRouter} from "../../../comModule/AppRouter";
import {MUserMgr} from "../../../bsModule/muser/MUserMgr";
import {MUser} from "../../../bsModule/muser/apiData/MUser";
import {Router} from "@angular/router";

@Component({
  selector: 'zmt-main-header',
  styleUrls: ['main.header.scss'],
  template: `
    <div class="header text-right disFlex align-center pos-r">
        <div class="user disFlex align-center cur-hand pos-r" #user>
            <div class="avatar dib">
                <img src="assets/images/sign_logo.png"  alt="" />
            </div>
            <span class="mg-l-10 fz-16">{{viewData.userName}}</span >
            <div class="user-dropList pos-a" *ngIf="showUserDropList">
                <!--<a routerLink="/main/userCenter/userDetail">个人中心</a>-->
                <!--<a routerLink="/main/userCenter/changePassword">修改密码</a>-->
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
  //输出 切换店铺回调
  @Output() toggleStoreCallback = new EventEmitter();

  showUserDropList:boolean = false;
  showShopDropList:boolean = false;

  @ViewChild('user') user:ElementRef;

  public viewData:MainHeaderCompViewData = new MainHeaderCompViewData();
  private service:MainHeaderCompService;


  constructor(private muserMgr:MUserMgr,
              private router:Router) {
    this.service = new MainHeaderCompService(this.muserMgr);
  }

  ngOnInit() {
    this.service.initViewData((viewData:MainHeaderCompViewData) =>{
      this.viewData = viewData;
    });
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

  /**
   * 切换店铺 页面点击事件
   */
  toogleStore(simpleStore:SimpleStore){
    let storeData = StoreData.newInstance();
    storeData.setStoreId(simpleStore.id);
    storeData.setStoreName(simpleStore.name);
    storeData.setSimpleStoreList(SessionUtil.getInstance().getSimpleStoreList());
    SessionUtil.getInstance().setStoreData(storeData);
    this.viewData.storeName = simpleStore.name;
    this.toggleStoreCallback.emit(simpleStore);
  }

}


export class MainHeaderCompService{

  constructor(private muserMgr:MUserMgr){}

  public async initViewData(callback:(viewData:MainHeaderCompViewData) =>void){
    let viewDataTmp = new MainHeaderCompViewData();

    let userName = SessionUtil.getInstance().getUserName();
    viewDataTmp.userName = userName;
    //let userId = SessionUtil.getInstance().getUserId();
    // if(!AppUtils.isNullOrWhiteSpace(userId)){
    //   let muser:MUser = await this.muserMgr.getMUser(userId);
    //   viewDataTmp.userName = muser.name;
    // }
    callback(viewDataTmp);
  }

}

export class MainHeaderCompViewData{
  public userName:string = "";
  public imgUrl:string= "";
  public userRole:string = "";

  //店铺
  public storeName:string= "管理平台";
  public storeList:Array<SimpleStore>= new Array<SimpleStore>();

  public userPermData:UserPermData = new UserPermData();

  public static fromComp(mainViewData:MainViewData):MainHeaderCompViewData{
    let mainHeaderCompViewData = new MainHeaderCompViewData();
    AppUtils.copyField(mainHeaderCompViewData,mainViewData);
    return mainHeaderCompViewData;
  }
}
