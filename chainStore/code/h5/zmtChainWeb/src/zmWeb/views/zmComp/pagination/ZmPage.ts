/**
 * Created by sunbirdjob on 2018/2/23.
 *
 <zm_page [totalSize]="80" [curPage]="2" (pageChange)="onPageChange($event)"></zm_page>
 */
import {Component, OnInit, OnDestroy, Input, Output, EventEmitter} from "@angular/core";


@Component({
  selector:'zm_page',
  template: ` 
    <mat-paginator [ngClass]="{'mat-elevation-z8': elevation}" [length]="totalSize" [pageIndex]="curPage-1" [pageSize]="pageSize"  showFirstLastButtons (page) = "onPageChange($event)"></mat-paginator>
    <!--<div class="disFlex hor-center align-center mg-t-40" *ngIf="totalSize&&totalSize!=0">-->
      <!--<ngb-pagination [collectionSize]="totalSize" [pageSize]="pageSize" [maxSize]="maxSize" rotate="true" [(page)]="curPage" (pageChange)="onPageChange()"></ngb-pagination>            -->
      <!--<span class="mg-l-20">共{{totalSize}}条</span>-->
    <!--</div>-->
`,
  styles: [`

  `]
})
export class ZmPage implements OnInit,OnDestroy {
  @Input() elevation:boolean = true;
  @Input() totalSize:number = 10;
  @Input() curPage:number = 1;


//通常不用传入
  @Input() pageSize:number = 10;
  @Input() maxSize:number = 10;

  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  constructor() {
  }

  public onPageChange(event): void {
    this.pageChange.emit(event.pageIndex + 1);
  }

  ngOnInit():void{

  }

  ngOnDestroy(): void {

  }

}
