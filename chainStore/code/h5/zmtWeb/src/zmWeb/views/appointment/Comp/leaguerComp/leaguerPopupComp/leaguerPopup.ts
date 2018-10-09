import {Component,Inject} from "@angular/core";
import {Leaguer} from "../../../../../bsModule/storeLeaguerInfo/data/Leaguer";

import {AppRouter} from "../../../../../comModule/AppRouter";
import {AppUtils, ZmMap} from "../../../../../comModule/AppUtils";
import {LeaguerCompViewData} from "../leaguerComp";
import {LeaguerDetail} from "../../../../../bsModule/leaguerDetail/data/LeaguerDetail";
import {LeaguerDetailSynDataHolder} from "../../../../../bsModule/leaguerDetail/LeaguerDetailSynDataHolder";
import {MAT_DIALOG_DATA} from '@angular/material';
import {AddLeaguerFromPageFlag} from "../../../../../comModule/enum/AddLeaguerFromPageFlag";


/**
 * 选择会员模态框
 */
@Component({
  selector:'select-leaguer',
  template:`
  <div>
      <h2 mat-dialog-title>
         选择会员
      </h2>
      <mat-dialog-content fusePerfectScrollbar>
             <div  fxLayout="row wrap" fxLayoutAlign="space-between center" class="zmFullWidth">
                <div fxLayout="row wrap"  fxLayoutGap="20px" class="fullwidth">
                  <div  fxFlexAlign="center"  >
                     <zm-search-box [label]=" '会员查询'" [placeholder]="'请输入会员姓名/手机号'" [(zmValue)]="viewData.queryParam" (callBack)="queryLeaguer()"></zm-search-box>
                  </div>
                </div>
                <div fxFlexAlign="center" ><zm-btn-new [name]="'新增会员'" (zmbtnClick)="addLeaguerEv()"></zm-btn-new></div>
              </div>
            
           <ng-template #theadTemplate>
               <th style="width:30%">姓名</th>
             <th style="width:50%">手机号</th>
           </ng-template>
           
           <ng-template #tbodyTemplate let-item="item">
              <td style="width:30%">{{item.name}}</td>
              <td style="width:50%">{{item.phone}}</td>
           </ng-template> 
  
           <zm-table-select-single [itemList]="data.leaguerListShow" (onSelected) = "selectLeaguer($event)"  [tbodyTemplate]="tbodyTemplate"  [theadTemplate]="theadTemplate" >
           </zm-table-select-single>
      
      </mat-dialog-content>
     
    </div>

  `,
  styles:[`
  .mat-dialog-content {
    overflow-y: hidden !important;
  }
`]
})

export class LeaguerPopup{

  private service: LeaguerPopupService;
  public viewData: LeaguerPopupViewData = new LeaguerPopupViewData();
  public itemActiveIndex:number = -1;

  activeModal:any;
  data:LeaguerPopupViewData;
  callBack:(leaguer)=>Leaguer;

  constructor(
              private leaguerDetailSynDataHolder:LeaguerDetailSynDataHolder,
              @Inject(MAT_DIALOG_DATA) public dataInput:any) {
      this.service = new LeaguerPopupService();
      this.activeModal = dataInput.modalCtrl;
      this.data = dataInput.modalData;
      this.callBack = dataInput.callBack ;
  }

  closeModal(){
    this.activeModal.close();
  }

  addLeaguerEv(){
    AppRouter.goAddLeaguer(AddLeaguerFromPageFlag.FROM_CONSUME);
    this.closeModal();
  }

  /**
   * 查询会员 页面点击事件
   */
  public queryLeaguer(){
    let queryParam = AppUtils.trimBlank(this.viewData.queryParam);
    this.service.queryLeaguer(this.data,queryParam);
  }

  /**
   * 选择会员点击事件
   * @param leaguerId
   */
  public async selectLeaguer(item){
    this.closeModal();
    let selectLeaguer:LeaguerDetail = await this.leaguerDetailSynDataHolder.getData(item.id);
    //输出选中的会员
    this.callBack(selectLeaguer);
  }

  /*
   * 鼠标hover事件
   */
   itemActiveHover(index):void{
      this.itemActiveIndex = index;
   }

}

export class LeaguerPopupService{
  constructor(){}

  /**
   * 过滤会员
   * @param viewData
   * @param queryParam
   */
  public queryLeaguer(data,queryParam){
    if(!AppUtils.isNullOrWhiteSpace(queryParam)){
      let leaguers = data.leaguerMap.values();
      data.leaguerListShow = this.filterLeaguer(leaguers,queryParam);
    }else{
      data.leaguerListShow = data.leaguerData;
    }
  }

  /**根据查询条件过滤会员列表*/
  private filterLeaguer(leaguers:Array<Leaguer>,queryParam:string){
    let leaguerList:Array<Leaguer> = new Array<Leaguer>();
    leaguerList = leaguers.filter((item) =>{
      if((item.name.indexOf(queryParam) > -1) || (item.phone.indexOf(queryParam) > -1)){
        return true;
      }else{
        return false;
      }
    });
    return leaguerList;
  }
}

export class LeaguerPopupViewData{
  public leaguerMap:ZmMap<Leaguer>;
  public leaguerData:Array<Leaguer>;//传入数据

  //查询参数
  public queryParam = "";
  //页面显示数据
  public leaguerListShow:Array<Leaguer> = new Array<Leaguer>();

  public static fromParentComp(viewData:LeaguerCompViewData){
    let selectedCompViewData = new LeaguerPopupViewData();
    selectedCompViewData.leaguerMap = viewData.leaguerMap;
    selectedCompViewData.leaguerData = viewData.leaguerList;
    selectedCompViewData.leaguerListShow = viewData.leaguerList;
    return selectedCompViewData;
  }

}
