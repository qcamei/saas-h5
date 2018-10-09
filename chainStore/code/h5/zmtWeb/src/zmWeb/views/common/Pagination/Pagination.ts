// import {Component,Input,Output,EventEmitter} from "@angular/core";
// @Component({
//   selector:'pagination-comp',
//   template:
//   `
// 	<div class="disFlex hor-center align-center mg-t-40" *ngIf="recordCount>0">
//       <ngb-pagination [collectionSize]="recordCount" [maxSize]="5" [rotate]="true" [page]="page" (click)="getCurrentPage($event)"></ngb-pagination>
//       <span class="mg-l-20">共{{recordCount}}条</span>
//   </div>
//   `,
//   styles:
//     [`
//     .disFlex {
//       display: -webkit-box;
//       display: -ms-flexbox;
//       display: -webkit-flex;
//       display: -moz-box;
//       display: flex;
//     }
//     .hor-center{
//       -webkit-box-pack: center;
//       -ms-flex-pack: center;
//       -webkit-justify-content: center;
//       -moz-box-pack: center;
//       justify-content: center;
//     }
//     .align-center{
//       -webkit-box-align: center;
//       -ms-flex-align: center;
//       -webkit-align-items: center;
//       -moz-box-align: center;
//       align-items: center;
//     }
//     .mg-t-40{
//       margin-top:40px;
//     }
//     .mg-l-20{
//       margin-left:20px;
//     }
//   `]
// })
// export class Pagination {
//   @Input() recordCount:number;
//   @Input() page:number = 1;
//   @Output() pageChange = new EventEmitter();
//   @Output() callback = new EventEmitter();
//   getCurrentPage(e):void{
//     if(e.target.innerText.trim() === '»'&& (this.recordCount/10) > this.page){
//       this.page++;
//       this.pageChange.emit(this.page);
//       this.callback.emit(this.page);
//     }else if(e.target.innerText.trim() === '«'&& this.page > 1){
//       this.page--;
//       this.pageChange.emit(this.page);
//       this.callback.emit(this.page);
//     }else if(e.target.innerText.indexOf('current')>-1 && (parseInt(e.target.innerText) != this.page)){
//       this.page = parseInt(e.target.innerText);
//       this.pageChange.emit(this.page);
//       this.callback.emit(this.page);
//     }
//   }
//
// }
