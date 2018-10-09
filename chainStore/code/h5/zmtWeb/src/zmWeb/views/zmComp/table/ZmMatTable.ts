
import {Component, OnInit, OnDestroy, Input, TemplateRef} from "@angular/core";


/**
 //不可排序
 <ng-template #tdA let-item="item">{{ item.appointTime  | times}}</ng-template>
 <ng-template #tdB let-item="item"> {{item.leaguerName}}</ng-template>
 <ng-template #tdC let-item="item">{{item.status | appointmentStatusPipe}}</ng-template>
 <ng-template #tdD let-item="item">{{item.origin | originTypePipe}}</ng-template>
 <ng-template #tdE let-item="item">
 <a class="zmCurHand" style="margin-right: 5px;" *ngIf="item.status == 1" (click)="turnToConsume(item.id)">转为开单</a>
 <a class="zmCurHand" style="margin-right: 5px;" *ngIf="item.status == 0 && item.origin ==2 " (click)="receiveAppoint(item.id)">接受</a>
 <a class="zmCurHand" style="margin-right: 5px;" [routerLink]="['/main/appointment/appointmentDetails/'+item.id]">查看</a>
 <a class="zmCurHand" style="margin-right: 5px;" *ngIf="item.status !=3 && item.status !=2" (click)="cancelAppoint(item.id)">取消</a>
 <a class="zmCurHand" style="margin-right: 5px;" (click)="deleteAppt(item.id)">删除</a>
 </ng-template>
 <zm-mat-table  [tdTemplateList]="[tdA,tdB,tdC,tdD,tdE]" [thNameList]="['预约时间','预约会员','接受状态','预约渠道','操作']" [itemList]="viewData.appointmentList"></zm-mat-table>


 //头部可排序
 <ng-template #thA>头像</ng-template>
 <ng-template #thB>会员姓名</ng-template>
 <ng-template #thC>
 <div class="pos-r cur-hand" style="width: 110px;margin: 0 auto;" (click)="groupByAvgPrice()">
 <span class="mg-r-10">客单价</span>
 <span class="c-trigon-up" style="right: 10px" [ngClass]="{'c-trigon-down-css': !viewData.avgPriceAsc}" ></span>
 <span class="c-trigon-down" style="right: 10px" [ngClass]="{'c-trigon-up-css': viewData.avgPriceAsc}" ></span>
 </div>
 </ng-template>
 <ng-template #thD>
 <div class="pos-r cur-hand" style="width: 110px;margin: 0 auto;" (click)="groupByConsumeCount()">
 <span  class="mg-r-10">消费次数</span>
 <span class="c-trigon-up" [ngClass]="{'c-trigon-down-css': !viewData.consumeCountAsc}" ></span>
 <span class="c-trigon-down" [ngClass]="{'c-trigon-up-css': viewData.consumeCountAsc}"></span>
 </div>

 </ng-template>
 <ng-template #thE>
     <div class="pos-r cur-hand"  style="width: 110px;margin: 0 auto;" (click)="groupByConsumeAmount()">
     <span >消费金额</span>
     <span class="c-trigon-up" [ngClass]="{'c-trigon-down-css': !viewData.consumeAmountAsc}" ></span>
     <span class="c-trigon-down" [ngClass]="{'c-trigon-up-css': viewData.consumeAmountAsc}"></span>
     </div>
 </ng-template>

 <ng-template #tdA let-item="item">
 <div class="zmAvatarDiv"><img src={{item.headImg}} alt="" style="width: 60px;height: 60px;border-radius: 50%;" (click)="goLeaguerDetail(item.id)"></div>
 </ng-template>
 <ng-template #tdB let-item="item">{{item.name}}</ng-template>
 <ng-template #tdC let-item="item"><i class="fa fa-yen mg-r-5"></i>{{item.avgPrice | number:'1.2-2'}}</ng-template>
 <ng-template #tdD let-item="item">{{item.consumeCount?item.consumeCount:0}}</ng-template>
 <ng-template #tdE let-item="item"><i class="fa fa-yen mg-r-5"></i>{{item.consumeAmount | number:'1.2-2'}}</ng-template>
 <zm-mat-table  [thTemplateList]="[thA,thB,thC,thD,thE]"
 [tdTemplateList]="[tdA,tdB,tdC,tdD,tdE]"
 [thNameList]="['头像','姓名','客单价','消费次数','消费金额']" [itemList]="viewData.leaguerConsumeList"></zm-mat-table>
 */

@Component({
  selector:'zm-mat-table',
  template: `
      
          <table mat-table [dataSource]="itemList" [ngClass]="{'mat-elevation-z8': elevation }"  class=" zmFullWidth"  *ngIf="thTemplateList==null || thTemplateList.length==0" >
    
            <ng-container [matColumnDef]="nameItem" *ngFor="let nameItem of thNameList; let i = index">
              <th mat-header-cell *matHeaderCellDef style="text-align:center">
                {{nameItem}}
              </th>
              <td mat-cell *matCellDef="let item" style="text-align:center">
                <ng-container *ngTemplateOutlet="tdTemplateList[i];context:{'item':item}"></ng-container>   
              </td>
            </ng-container>
    
            
            <tr mat-header-row *matHeaderRowDef="thNameList"></tr>
            <tr mat-row *matRowDef="let row; columns: thNameList;"></tr>
    
          </table>
          
          <table mat-table [dataSource]="itemList" [ngClass]="{'mat-elevation-z8': elevation }"  class="zmFullWidth" *ngIf="thTemplateList && thTemplateList.length > 0">
    
            <ng-container [matColumnDef]="nameItem" *ngFor="let nameItem of thNameList; let i = index">
              <th mat-header-cell *matHeaderCellDef style="text-align:center">
                 <ng-container *ngTemplateOutlet="thTemplateList[i]"></ng-container>   
              </th>
              <td mat-cell *matCellDef="let item" style="text-align:center">
                <ng-container *ngTemplateOutlet="tdTemplateList[i];context:{'item':item}"></ng-container>   
              </td>
            </ng-container>
    
            
            <tr mat-header-row *matHeaderRowDef="thNameList"></tr>
            <tr mat-row *matRowDef="let row; columns: thNameList;"></tr>
    
          </table>
      
            `,
  styles:[`
   
  `]
})


export class ZmMatTable implements OnInit,OnDestroy {

  @Input() thNameList: Array<string>;
  @Input() tdTemplateList: Array<TemplateRef<any>>;
  @Input() thTemplateList: Array<TemplateRef<any>>;
  @Input() itemList:Array<any>;
  @Input() elevation:boolean=false;

  constructor(){
  }

  ngOnInit():void{

  }




  ngOnDestroy(): void {

  }
}

export class ZmMatColumnItem{
  thName:string;
  colName:string;
}

