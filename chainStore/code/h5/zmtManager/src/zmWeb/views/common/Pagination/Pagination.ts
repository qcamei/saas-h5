import {Component,Input,Output,EventEmitter} from "@angular/core";
@Component({
  selector:'pagination-comp',
  template:
    `
    <div class="disFlex hor-center align-center mg-t-40" *ngIf="recordCount">
      <ngb-pagination [collectionSize]="recordCount" [maxSize]="5" [rotate]="true" [page]="page" (click)="getCurrentPage($event)"></ngb-pagination>
      <span class="mg-l-20">共{{recordCount}}条</span>
    </div>
  `,
  styles:
    [`

    `]
})
export class Pagination {
  @Input() recordCount:number;
  @Input() page:number = 1;
  @Output() pageChange = new EventEmitter();
  @Output() callback = new EventEmitter();
  getCurrentPage(e):void{
    if(e.target.innerText.trim() === '»'&& (this.recordCount/10) > this.page){
      this.page++;
    }else if(e.target.innerText.trim() === '«'&& this.page > 1){
      this.page--;
    }else if(e.target.innerText.indexOf('current')>-1){
      this.page = parseInt(e.target.innerText);
    }
    this.pageChange.emit(this.page);
    this.callback.emit(this.page);
  }

}
