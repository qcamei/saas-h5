/**
 * Created by sunbirdjob on 2018/2/23.
 *
 <zm_page [totalSize]="80" [curPage]="2" (pageChange)="onPageChange($event)"></zm_page>
 */
import {Component, OnInit, OnDestroy, Input, Output, EventEmitter} from "@angular/core";


@Component({
  selector:'zm_page',
  template: ` 
    <div class="disFlex hor-center align-center mg-t-40" *ngIf="totalSize&&totalSize!=0">
      <ngb-pagination [collectionSize]="totalSize" [pageSize]="pageSize" [maxSize]="maxSize" rotate="true" [(page)]="curPage" (pageChange)="onPageChange()"></ngb-pagination>            
      <span class="mg-l-20">共{{totalSize}}条</span>
    </div>
`,
  styles: [`
  
  .align-center{
    -webkit-box-align: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    -moz-box-align: center;
    align-items: center;
  }
  .hor-center {
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    -webkit-justify-content: center;
    -moz-box-pack: center;
    justify-content: center;
  }
  .disFlex {
    display: -webkit-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: -moz-box;
    display: flex;
  }
 
  .mg-l-20{
    margin-left:20px;
  }
  .mg-t-40{
    margin-top:40px;
  }
  
  .c-arrow-down img{
    transform-origin:50% 50%;
    transform: rotate(180deg);
    transition: all 0.5s;
    -ms-transform-origin:50% 50%;    /* IE 9 */
    -moz-transform: rotate(180deg);   /* Firefox */
    -webkit-transform:all 0.5s; /* Safari 和 Chrome */
  }

  `]
})
export class ZmPage implements OnInit,OnDestroy {
  @Input() totalSize:number = 10;
  @Input() curPage:number = 1;

  //通常不用传入
  @Input() pageSize:number = 10;
  @Input() maxSize:number = 10;

  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  constructor() {
  }

  public onPageChange(): void {
    this.pageChange.emit(this.curPage);
  }

  ngOnInit():void{

  }

  ngOnDestroy(): void {

  }

}
