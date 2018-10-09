import {Component, ElementRef, Input, OnInit, Output, Renderer2, ViewChild, Inject} from "@angular/core";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {AppUtils, ZmMap} from "../../../../comModule/AppUtils";
import {BUser} from "../../../../bsModule/buser/apiData/BUser";
import {ClerkInfo} from "../../../../bsModule/storeClerkInfo/data/ClerkInfo";
import {StoreAdminRole} from "../../../../bsModule/storeClerkInfo/data/storeAdminRole/StoreAdminRole";
import {StoreClerkInfoSynDataHolder} from "../../../../bsModule/storeClerkInfo/StoreClerkInfoSynDataHolder";
import {BUserMgr} from "../../../../bsModule/buser/BUserMgr";
import {RestResp} from "../../../../comModule/RestResp";
import {LeaguerDetail} from "../../../../bsModule/leaguerDetail/data/LeaguerDetail";
import {StoreLeaguerInfoMgr} from "../../../../bsModule/storeLeaguerInfo/StoreLeaguerInfoMgr";
import {LeaguerUpdateInfoApiForm} from "../../../../bsModule/storeLeaguerInfo/apiData/LeaguerUpdateInfoApiForm";
import {AppRouter} from "../../../../comModule/AppRouter";
import {StoreLeaguerInfoViewDataMgr} from "../../StoreLeaguerInfoViewDataMgr";
import {MAT_DIALOG_DATA} from "@angular/material";
import {ClerkData} from "../staffPopup/clerkData";

@Component({
  selector: 'buser-popup',
  template:
      `
      <div animation-modal>
      <div mat-dialog-title>
         负责人
      </div>
      <mat-dialog-content>
              <div fxLayout="row wrap"  fxLayoutGap="20px" >
                    <zm-search-box [label]=" ''" [placeholder]="'请输入员工姓名'" [(zmValue)]="viewData.queryParam" (callBack)="findServiceClerk()"></zm-search-box>  
              </div>
              <div  fxLayout="row wrap" fxLayoutAlign="space-between center"  class="zmFullWidth">
                             
                              <div fxFlex="1 1 48%" fxFlexAlign="start">
                                  <!--  <table class="scrollTable table table-bordered zmFullWidth">
                                        <thead>
                                          <th style="width:30%;">序号</th>
                                          <th style="width:30%;">员工姓名</th>
                                          <th style="width:40%;">岗位</th>
                                        </thead>
                                        <tbody style="height:370px;overflow-x:hidden;overflow-y:auto;">
                                                <tr *ngFor="let item of viewData.clerkList;let i=index;" (click)="chooseClerk(i)"  (mouseover)="itemArtive(i)"  [class.itemActiveClass]="itemActiveIndex===i?'itemActive':''">
                                                  <td  style="width:30%;">
                                                    <span *ngIf="itemActiveIndex!==i">{{i+1}}</span>
                                                    <img src="assets/images/selectItem.png" *ngIf="itemActiveIndex===i">
                                                  </td>
                                                  <td style="width:30%;">{{item.name}}</td>
                                                  <td style="width:40%;">{{item.roleSetName}}</td>
                                                </tr>
                                        </tbody>
                                   </table>-->
                                   <ng-template #theadTemplate>
                                   <th style="width: 40%">员工姓名</th>
                                   <th style="width: 40%">岗位</th>
                                </ng-template>
                               
                                <ng-template #tbodyTemplate let-item="item">
                                   <td style="width:40%">{{item.name}}</td>
                                   <td style="width:40%" >{{item.roleSetName}}</td>
                                </ng-template>
                               
                                <zm-table-select-single [itemList]="viewData.clerkList" (onSelected) = "chooseClerk($event)"  [tbodyTemplate]="tbodyTemplate"  [theadTemplate]="theadTemplate" >
                                </zm-table-select-single>
                              </div>

                              <div fxFlex="1 1 auto" style="text-align: center"><img src="assets/images/direction.png" alt=""/></div>
                              <div fxFlex="1 1 48%"  fxFlexAlign="start">
                              <zm-table>
                                    <thead>
                                      <th style="width:10%;">序号</th>
                                      <th style="width:15%;">员工姓名</th>
                                      <th style="width: 30%">岗位</th>
                                      <th style="width:20%;">操作</th>
                                    </thead>
                                    <tbody style="height:320px;overflow-x:hidden;overflow-y:auto;">
                                      <tr *ngFor="let item of viewData.choosedClerkList;let i=index;">
                                          <td style="width:10%;">{{i+1}}</td>
                                          <td style="width:15%;">{{item.name}}</td>
                                          <td style="width: 30%">{{item.roleSetName}}</td>
                                          <td style="width:20%;">
                                          <a (click)="delChoosedClerk(i)"style="color:#03a9f4;"class="zmCurHand">删除</a>
                                          </td>
                                        </tr>
                                        <div *ngIf="viewData.choosedClerkList.length == 0" style="margin: 140px 0;"><p class="font-c2 text-center mg-b-0">请在左边选择负责人添加</p></div>
                                    </tbody>
                                  </zm-table>


                                  <!--  <ng-template #theadTemplate2>
                                  <th style="width: 20%">员工姓名</th>
                                  <th style="width: 40%">岗位</th>
                                  <th style="width:20%;">操作</th>
                               </ng-template>
                              
                               <ng-template #tbodyTemplate2 let-item="item">
                                  <td style="width:20%">{{item.name}}</td>
                                  <td style="width:40%">{{item.roleSetName}}</td>
                                  <td style="width:20%" class="zmCurHand">删除</td>
                               </ng-template>
                              
                               <zm-table-select-single [itemList]="viewData.choosedClerkList"   [tbodyTemplate]="tbodyTemplate2"  [theadTemplate]="theadTemplate2" >
                               </zm-table-select-single>-->

                              </div>
              </div>
          
      
      </mat-dialog-content>
      <mat-dialog-actions>
        <div  fxLayout="row wrap" fxLayoutAlign="end" fxLayoutGap="20px" class="zmFullWidth">

        <zm-btn-md  [stroked] = "true"(click)="closeModal()" name="取消"></zm-btn-md>
        <zm-btn-md (click)="confirm()" name="确定"></zm-btn-md>
             
        </div>
      </mat-dialog-actions>
  </div>








  `,
  styles: [`
  
  `],
})

export class BuserPopup implements OnInit {
  @Input() data: LeaguerDetail;
  @Output() action: any;
  private service: BuserPopupService;
  public viewData: BuserPopupViewData = new BuserPopupViewData();
  public itembg: number;
  private activeModal: any;
public itemActiveIndex:number;
  constructor(@Inject(MAT_DIALOG_DATA) private dataInput:any,
              private storeClerkInfoSynDataHolder: StoreClerkInfoSynDataHolder,
              private storeLeaguerInfoMgr: StoreLeaguerInfoMgr,
              private storeLeaguerInfoViewDataMgr:StoreLeaguerInfoViewDataMgr,
              private buserMgr: BUserMgr,) {
    this.activeModal = dataInput.modalCtrl;
    this.service = new BuserPopupService(this.storeClerkInfoSynDataHolder,
      this.buserMgr, this.storeLeaguerInfoMgr,this.storeLeaguerInfoViewDataMgr);

  }

  ngOnInit() {
    this.service.initViewData(this.data, (viewDataP:BuserPopupViewData)=> {
      this.handleViewData(viewDataP);
    });
  }

  /**
   * 处理回调
   * @param viewDataP
   */
  public handleViewData(viewDataP:BuserPopupViewData){
    this.viewData = viewDataP;
  }

  /**
   * 取消
   */
  closeModal() {
    this.viewData.choosedClerkList.splice(0, this.viewData.choosedClerkList.length);
    this.activeModal.close();
  }

  confirm(): void {
    let updateForm = this.viewData.updateForm;
    updateForm = AppUtils.copyField(updateForm,this.viewData.leaguer);
    updateForm.buserIds = this.getChooseClerks();
    this.service.updateLeaguerInfo(updateForm,(restResp:RestResp) =>{
      if(restResp.code == 200){
        AppUtils.showSuccess("提示","修改成功");
        //修改viewData会员的buserIds
        this.data.buserIds = updateForm.buserIds;
        AppRouter.goFindLeaguer();
        this.action();
        this.closeModal();
      }else{
        AppUtils.showError("提示",restResp.tips);
        }
    })
  }

  /**
   * 获取服务人员
   * @returns {string[]}
   */
  private getChooseClerks():Array<string> {
    let buserIds = new Array<string>();
    let choosedClerkList = this.viewData.choosedClerkList;
    if (choosedClerkList && choosedClerkList.length > 0) {
      let idArr = [];
      for (let i = 0; i < choosedClerkList.length; i++) {
        idArr.push(choosedClerkList[i].id);
      }
      buserIds = idArr;
    }
    return buserIds;
  }

  /**
   * 选择服务人员
   * @param index
   */
  chooseClerk(item) {
    // let clerk = this.viewData.clerkList[index];
    // this.itemActiveIndex=index;
    let choosedClerkListTmp = this.viewData.choosedClerkList;
    if (!AppUtils.arrayContains(choosedClerkListTmp, item)) {
      choosedClerkListTmp.push(item);
    } else {
      AppUtils.showWarn("提示", "已选择该服务人员");
    }
  }

  /**
   * 删除选中的服务人员
   * @param index
   */
  delChoosedClerk(index) {
    this.viewData.choosedClerkList.splice(index, 1);
  }

  /**
   * 服务人员hover
   * @param index
   */
  itemArtive(index) {
    this.itemActiveIndex=index;
  }

  /**
   * 页面点击事件 查询员工
   */
  findServiceClerk() {
    if (!AppUtils.isNullObj(this.viewData.queryParam)) {
      this.viewData.queryParam = AppUtils.trimBlank(this.viewData.queryParam);//去掉空格
      this.viewData.clerkList = this.viewData.clerkDataList.filter((item) => {
        if (item.name && item.name.indexOf(this.viewData.queryParam) > -1) {
          return true;
        } else {
          return false;
        }
      })
    }
  }

}

export class BuserPopupService {
  constructor(private storeClerkInfoSynDataHolder: StoreClerkInfoSynDataHolder, private buserMgr: BUserMgr, private storeLeaguerInfoMgr: StoreLeaguerInfoMgr,
              private storeLeaguerInfoViewDataMgr:StoreLeaguerInfoViewDataMgr,) {
  }

  /**
   * @param callback
   */
  public async initViewData(leaguer:LeaguerDetail, callback: (viewDataP: BuserPopupViewData) => void) {
    let viewDataTmp = new BuserPopupViewData();
    viewDataTmp.leaguer = leaguer;
    //请求storeClerkInfo
    let storeId = SessionUtil.getInstance().getStoreId();
    let clerkInfoId = SessionUtil.getInstance().getIdByStoreId(storeId);
    let storeClerkInfo = await this.storeClerkInfoSynDataHolder.getData(clerkInfoId);
    viewDataTmp.clerkMap = storeClerkInfo.getValidClerkMap();
    viewDataTmp.roleMap = storeClerkInfo.getRoleMap();

    //请求所有员工信息
    let clerkMap = viewDataTmp.clerkMap;
    let clerkIdArray = clerkMap.keys();
    let buserList = await this.buserMgr.findByMultitId(clerkIdArray);

    //构建clerkDataList
    viewDataTmp.clerkDataList = this.getClerkDataList(buserList, clerkMap, viewDataTmp.roleMap);
    viewDataTmp.clerkList = viewDataTmp.clerkDataList;

    //设置跟进人员名称
    let buserIds = leaguer.buserIds;
    if (buserIds) {
      viewDataTmp.choosedClerkList = this.getChoosedBusers(buserIds, viewDataTmp.clerkList);
    }
    callback(viewDataTmp);
  }


  /**
   * 组装服务人员
   * @param buserIds
   * @param clerkList
   * @returns {ClerkData[]}
   */
  private getChoosedBusers(buserIds: Array<string>, clerkList: Array<ClerkData>): Array<ClerkData> {
    let choosedClerkList = new Array<ClerkData>();
    for (let i = 0; i < buserIds.length; i++) {
      for (let m = 0; m < clerkList.length; m++) {
        if (clerkList[m].id == buserIds[i]) {
          let clerk = clerkList[m];
          if (!AppUtils.arrayContains(choosedClerkList, clerk)) {
            choosedClerkList.push(clerk);
          }
        }
      }
    }
    return choosedClerkList;
  }

  /**
   * 组装clerkDataList
   * @param buserList
   * @param clerkMap
   * @param roleMap
   * @returns {ClerkData[]}
   */
  private getClerkDataList(buserList: Array<BUser>, clerkMap: ZmMap<ClerkInfo>, roleMap: ZmMap<StoreAdminRole>): Array<ClerkData> {
    let clerkDataList = new Array<ClerkData>();
    for (let i = 0; i < buserList.length; i++) {
      let buser = buserList[i];
      let clerk = clerkMap.get(buser.id);
      let clerkData = new ClerkData();
      clerkData.id = buser.id;
      clerkData.name = buser.name;
      if (clerk.roleSet) {
        //员工对应所有职位
        let roleNameArr = new Array();
        for (let i = 0; i < clerk.roleSet.length; i++) {
          if (roleMap.get(clerk.roleSet[i]) && roleMap.get(clerk.roleSet[i]).name) {
            roleNameArr.push(roleMap.get(clerk.roleSet[i]).name);
          }
        }
        clerkData.roleSetName = roleNameArr.join("、");
      }
      clerkDataList.push(clerkData);
    }
    return clerkDataList;
  }

  /**
   * 修改会员信息
   * @param updateForm
   * @param callbackP
   */
  public updateLeaguerInfo(updateForm, callbackP: (restResp: RestResp) => void) {
    let storeId = SessionUtil.getInstance().getStoreId();
    this.storeLeaguerInfoMgr.updateLeaguerInfo(storeId, updateForm).then((restResp: RestResp) => {
      callbackP(restResp);
    })
  }

}


export class BuserPopupViewData {

  public leaguer: LeaguerDetail = new LeaguerDetail();//当前会员
  public updateForm = new LeaguerUpdateInfoApiForm();
  public clerkMap: ZmMap<ClerkInfo>;

  public roleMap: ZmMap<StoreAdminRole>;
  //对应店铺所有员工
  public clerkDataList: Array<ClerkData> = new Array<ClerkData>();
  //对应页面过滤后的列表实体
  public clerkList: Array<ClerkData> = new Array();

  //选中的服务人员列表
  public choosedClerkList: Array<ClerkData> = new Array();

  //查询参数
  public queryParam: string = "";

  constructor(){
    this.updateForm.id = "";
    this.updateForm.name = "";
    this.updateForm.sex = 0;
    this.updateForm.phone = "";
    this.updateForm.buserIds=[];
    this.updateForm.birthday = 0;
    this.updateForm.idCard = "";
    this.updateForm.aliasName = "";
    this.updateForm.wechatNumber = "";
    this.updateForm.recommender = "";
    this.updateForm.origin = "";
    this.updateForm.headImg = "";
    this.updateForm.address = "";
    this.updateForm.company = "";
    this.updateForm.job = "";
    this.updateForm.dateType = 0;
  }
}


