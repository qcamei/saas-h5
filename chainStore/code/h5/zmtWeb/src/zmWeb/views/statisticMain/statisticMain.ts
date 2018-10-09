import {Component, OnInit,ChangeDetectionStrategy, ViewChild, ElementRef} from '@angular/core';
import { Router } from '../../../../node_modules/@angular/router';
// 路由 transform <zmt-main-layout [data]="headerData" (toggleStoreCallback)="toggleStore($event)"  [@routeAnimation]="routerStateCode">
// <router-outlet></router-outlet>
// </zmt-main-layout>
@Component({
  template: `
  <!-- 隐藏显示按钮 -->
  <div class="position-fixed" style="right:20px;top:15px;width:30px;background:#B2B2B2;height:30px;z-index:1000;">
    <div #tab>
      <img class="w-100 h-100" src="assets/images/icon/nav-list-on.png">
    </div>
  </div>
 <div class="position-fixed isTabHidden" [class.isTabShow]="isTab" >
      <p (click)="financial()">财务统计</p>
      <p (click)="transaction()">交易流水</p>
      <p (click)="menberStatic()">会员统计</p>
      <p (click)="carInfoStatic()">次卡统计</p>
      <p (click)="productStatic()">产品统计</p>
  </div>
        <router-outlet></router-outlet>
    `,
    host:{
        '(document:click)':'initDropList($event)',
        '[style.width]':"'100%'"
      },
    styles:[`
    .isTabShow p:hover{
      background:#999;
    }
    .isTabShow{
        width:35% !important;
        height:200px !important;
        right:20px;
        top:50px;
        z-index:1000;
        background:#666666;
        padding:8px 3px; 
        color:#fff;
        text-align:center;
        overflow: hidden;
        opacity: 1 !important;
        transition: all 0.5s ease ;
       
    }
    .isTabHidden{
      width:35%;
        height:0;
        overflow: hidden;
        opacity: 0;
    }

    `]
//   styleUrls: ['main.scss'],
  // animations: [routeAnimation],
//   changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatisticMainPage implements OnInit{

    public isTab:boolean=false;
// 财务
    financial(){this.router.navigate(['/statisMain/phoneStatistic/financial'])}
    // 交易
    transaction(){this.router.navigate(['/statisMain/phoneStatistic/transaction'])}
    // 会员
    menberStatic(){this.router.navigate(['/statisMain/phoneStatistic/menberStatic'])}
    // 次卡
    carInfoStatic(){this.router.navigate(['/statisMain/phoneStatistic/carInfoStatic'])}
    // 产品
    productStatic(){this.router.navigate(['/statisMain/phoneStatistic/productStatic'])}

  constructor(private router:Router) {

  }
// 点击支付方式之----控制menu弹窗
@ViewChild('tab') tab:ElementRef;
// 点击支付方式
initDropList(event){
  if(this.tab.nativeElement.contains(event.target)){
    this.isTab = !this.isTab;
  }else{
    this.isTab=false
  }
}
  ngOnInit(): void {}



}

