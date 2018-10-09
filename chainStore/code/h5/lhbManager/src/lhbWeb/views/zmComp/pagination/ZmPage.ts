/**
 * Created by sunbirdjob on 2018/2/23.
 *
 <ng-template #curPageTemplate>
 <div>当前是第{{page}}页内容</div>
 </ng-template>

 <zm_page [totalSize]="80" curPage="2" [curPageTemplate]="curPageTemplate" (pageChange) = "onPageChange($event)"></zm_page>
 */
import {Component, OnInit, OnDestroy, Input, Output, EventEmitter, TemplateRef} from "@angular/core";


@Component({
  selector:'zm_page',
  template: ` 
   <div>
      <ng-container *ngTemplateOutlet="curPageTemplate;"></ng-container>
   </div> 
   <ngb-pagination [collectionSize]="totalSize" [pageSize]="pageSize" [maxSize]="maxSize" rotate="true" [(page)]="curPage" (pageChange)="onPageChange()"></ngb-pagination>            `
})


export class ZmPage implements OnInit,OnDestroy {
  @Input() totalSize:number = 60;
  @Input() curPage:number = 1;
  @Input() curPageTemplate: TemplateRef<any>;

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
