/**
 * Created by sunbirdjob on 2018/2/23.
 *
 <zm-page [totalSize]="80" [curPage]="2" (pageChange)="onPageChange($event)"></zm-page>
 */
import {Component, OnInit, OnDestroy, Input, Output, EventEmitter} from "@angular/core";


@Component({
  selector:'zm-page',
  template: ` 
    <div *ngIf="totalSize>0">
        <mat-paginator [ngClass]="{'mat-elevation-z8': elevation}" [length]="totalSize" [pageIndex]="curPage-1" [pageSize]="pageSize"  showFirstLastButtons (page) = "onPageChange($event)"></mat-paginator>
    </div>
    
`,
  styles: [`
     
  `]
})
export class ZmPage implements OnInit,OnDestroy {
  @Input() elevation:boolean = false;
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
