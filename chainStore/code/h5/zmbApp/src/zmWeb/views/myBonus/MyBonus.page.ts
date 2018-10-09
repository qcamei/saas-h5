import {Component, ChangeDetectorRef, ChangeDetectionStrategy} from "@angular/core";
import {IonicPage} from "ionic-angular";
import {MyBonusViewDataMgr} from "./MyBonusViewDataMgr";
import {BonusRecordQueryForm} from "../../bsModule/bonusRecord/apiData/BonusRecordQueryForm";
import {BonusRecordMgr} from "../../bsModule/bonusRecord/BonusRecordMgr";
import {PageResp} from "../../comModule/asynDao/apiData/PageResp";
import {BonusRecord} from "../../bsModule/bonusRecord/data/BonusRecord";
import {BonusRecordGroup} from "../../bsModule/bonusRecord/data/BonusRecordGroup";
import {AppUtils} from "../../comModule/AppUtils";
import {SessionUtil} from "../../comModule/session/SessionUtil";

/**
 * 我的提成
 */
@IonicPage({
  name:"myBonus",
  segment:"myBonus"
})
@Component({
  template:`
            <zm-page-header [title]="'我的提成'"></zm-page-header>
            <zm-page-content>
                <div style="width:100%;" fxLayout="column" fxLayoutAlign="start">
                
                    <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="20px" class="border-div">
                     
                      <div w-100 style="padding:0 10px;">
                        <zm-date-years [small]="true" [label]="'选择年份'"  [placeholder]="'年份选择'" (currentValueChange)="switchYear($event)" [(currentValue)]="viewData.curYear" ></zm-date-years>
                     </div>
                    </div>
                    <zm-no-data *ngIf="viewData.bonusGroupList.length==0"  text="没有数据" ></zm-no-data>
                    <div *ngFor="let groupItem of viewData.bonusGroupList;let i=index;" fxLayout="column" fxLayoutAlign="start" >
                          <div (click)="dropList(groupItem)"  fxLayout="row" fxLayoutAlign="space-between center" style="padding:10px;border-bottom:1px solid #f4f4f4;">
                              <div w-100 fxLayout="row" fxLayoutAlign=" center" fxLayoutGap="10px">
                              
                                  <span>{{groupItem.dateStr}}</span>
                                  <div fxLayout="row" fxLayoutAlign="space-between start" fxLayoutGap="5px">
                                    <span>业绩:</span>
                                    <span>￥{{groupItem.amountCost}}</span>
                                  </div>
                                  <div fxLayout="row" fxLayoutAlign="space-between start" fxLayoutGap="5px">
                                    <span>提成</span>
                                    <span>￥{{groupItem.bonusCost}}</span>
                                  </div>
                              </div>  
                               
                               <ion-icon  *ngIf="groupItem['show']" name="arrow-down"></ion-icon><!--向下-->
                               <ion-icon  *ngIf="!groupItem['show']" name="arrow-forward"></ion-icon><!--向右-->
                          </div>
                      <div fxLayout="column" *ngIf="groupItem['show']">
                          <div fxLayout="row" >
                            <p style="padding:5px 0;" no-margin text-center fxFlex="1 1 35%">订单号</p>
                            <p style="padding:5px 0;" no-margin text-center fxFlex="1 1 30%">名称</p>
                            <p style="padding:5px 0;" no-margin text-center fxFlex="1 1 23%">业绩</p>
                            <p style="padding:5px 0;" no-margin text-center fxFlex="1 1 17">提成</p>
                            <!--<table>-->
                              <!--<tr>-->
                                <!--<th>订单号</th>-->
                                <!--<th>名称</th>-->
                                <!--<th>业绩</th>-->
                                <!--<th>提成</th>-->
                              <!--</tr>-->
                              <!--<tbody>-->
                                <!--<tr *ngFor="let recordItem of getRecordListByGroup(groupItem)">-->
                                  <!--<td>{{recordItem.orderNumber}}</td>-->
                                  <!--<td>{{recordItem.buyName}}</td>-->
                                  <!--<td>{{recordItem.amount}}</td>-->
                                  <!--<td>{{recordItem.cost}}</td>-->
                                <!--</tr>-->
                              <!--</tbody>-->
                             <!--</table>-->
                          </div>
                          <div *ngIf="getRecordListByGroup(groupItem).length==0" style="padding:10px;" text-center>暂无业绩</div>
                          <div *ngFor="let recordItem of getRecordListByGroup(groupItem)" fxLayout="row" fxLayoutAlign="start center" style="color:#666;padding:5px 5px;border-bottom:1px solid #f4f4f4;">
                            <span text-center fxFlex="1 1 30%">{{recordItem.orderNumber}}</span>
                            <span text-center fxFlex="1 1 30%" overflow-hidden-1>{{recordItem.buyName}}</span>
                            <span text-center fxFlex="1 1 23%">{{recordItem.amount}}</span>
                            <span text-center fxFlex="1 1 17%">{{recordItem.cost}}</span>
                          
                          </div>
                          
                          </div>
                      <div border-gray></div>
                      
                    </div>

                </div>
                    
            </zm-page-content>
`,
  styles:[`
      .border-div{
        border-top:8px solid #f4f4f4;
        border-bottom:8px solid #f4f4f4;
      }
    `
  ],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class MyBonusPage{
a="2";
  public viewData:MyBonusViewData;
  private service:MyBonusService;

  constructor(private cdRef:ChangeDetectorRef){
    this.service = new MyBonusService();
    let initViewData = new MyBonusViewData();
    MyBonusViewDataMgr.getInstance().onDataChange(initViewData, (viewDataP => {
      if (viewDataP) {
        this.viewData = viewDataP;
        this.cdRef.markForCheck();
      }
    }));
  }

  ionViewDidLoad() {
    let viewDataTmp = new MyBonusViewData();
    this.service.buildViewData(viewDataTmp);
  }

  dropList(groupItem:BonusRecordGroup){
    groupItem['show'] = !groupItem['show'];
  }

  /**
   * 获取对应月份的提成列表
   * @param groupItem
   * @returns {BonusRecord[]}
   */
  getRecordListByGroup(groupItem:BonusRecordGroup):Array<BonusRecord>{
    let month = new Date(groupItem.dateStr);
    let firstDay = month.setFullYear(month.getFullYear(),month.getMonth(),1);
    let lastDay = month.setFullYear(month.getFullYear(),month.getMonth()+1,1);
    let minTime = AppUtils.getMinTimeInday(new Date(firstDay));
    let maxTime = AppUtils.getMinTimeInday(new Date(lastDay));
    return this.viewData.bonusRecordList.filter((recordItem:BonusRecord)=>{
      if((recordItem.orderTime>=minTime) && (recordItem.orderTime<maxTime)){
        return true;
      }
    });
  }

  /**
   * 切换年份
   */
  switchYear(yearStr:string){
    let curDate = new Date(yearStr);
    let firstTime = curDate.setFullYear(curDate.getFullYear(),0,1);
    let lastTime = curDate.setFullYear(curDate.getFullYear(),11,31);
    this.viewData.queryForm.minTime = AppUtils.getMinTimeInday(new Date(firstTime)).toString();
    this.viewData.queryForm.maxTime = AppUtils.getMaxTimeInday(new Date(lastTime)).toString();
    this.service.buildViewData(this.viewData);
  }

}

class MyBonusService{

  public async buildViewData(viewDataTmp:MyBonusViewData) {
    viewDataTmp.queryForm.storeId = SessionUtil.getInstance().getStoreId()
    viewDataTmp.queryForm.buserName = SessionUtil.getInstance().getUserName();
    let bonusGroupPageResp:PageResp = await BonusRecordMgr.getInstance().findBonusRecordGroupPageInfo(viewDataTmp.queryForm);
    if(!AppUtils.isNullObj(bonusGroupPageResp)){
      viewDataTmp.bonusGroupList = bonusGroupPageResp.list;
    }
    let bonusRecordPageResp:PageResp = await BonusRecordMgr.getInstance().findBonusRecordPageInfo(viewDataTmp.queryForm);
    if(!AppUtils.isNullObj(bonusRecordPageResp)){
      viewDataTmp.bonusRecordList = bonusRecordPageResp.list;
    }
    MyBonusViewDataMgr.getInstance().setData(viewDataTmp);
  }

}

export class MyBonusViewData{
  public queryForm:BonusRecordQueryForm = new BonusRecordQueryForm();

  public bonusGroupList:Array<BonusRecordGroup> = new Array<BonusRecordGroup>();
  public bonusRecordList:Array<BonusRecord> = new Array<BonusRecord>();

  public yearArr:Array<string> = new Array<string>();//年份列表
  public curYear:string;

  constructor(){
    let curDate = new Date();
    let firstTime = curDate.setFullYear(curDate.getFullYear(),0,1);
    let lastTime = curDate.setFullYear(curDate.getFullYear(),11,31);
    this.queryForm.minTime = AppUtils.getMinTimeInday(new Date(firstTime)).toString();
    this.queryForm.maxTime = AppUtils.getMaxTimeInday(new Date(lastTime)).toString();

    let fullYear = new Date().getFullYear();
    for(let i=0;i<5;i++){
      let year = fullYear - i;
      this.yearArr.push(year.toString());
    }
    this.curYear=this.yearArr[0];
  }
}
