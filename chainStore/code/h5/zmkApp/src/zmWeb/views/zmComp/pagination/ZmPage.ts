/**
 * Created by sunbirdjob on 2018/2/23.
 *
 <ng-template #curPageTemplate>
 <div>当前是第{{page}}页内容</div>
 </ng-template>

 <zm-page [totalSize]="80" curPage="2" [curPageTemplate]="curPageTemplate" (pageChange) = "onPageChange($event)"></zm-page>
 */
import {Component, Input, Output, EventEmitter, OnInit, OnChanges} from "@angular/core";
import {Pagination} from "./pagination.component";


/**
 * 分页组件
 * eg: <zm-page [totalSize]="viewData.pageResp.totalCount"  [curPage]="viewData.pageResp.pageNo" (pageChange)="pageChange($event)"></zm-page>
 */

/**
 * @name 自定义分页组件
 * @description
 * @example <zm-page [total]="18" (pageChange)="doSearch($event)"></zm-page>
 * @example <zm-page [total]="total" (pageChange)="doSearch($event)" pageSize="10" color="dark"></zm-page>
 */

@Component({
  selector:'zm-page',
  template: ` 
                
             <ionc-pagination *ngIf="totalSize>pageSize"
                    color="light"
                    (clickBeginning)="btnClick(1)"
                    (clickPrevious)="btnClick(curPage-1)"
                    (clickNext)="btnClick(curPage + 1)"
                    (clickEnd)="btnClick(ceil(totalSize/pageSize))"
                    [pagination]="paginationInfo"></ionc-pagination>

`,
})


export class ZmPage implements OnInit,OnChanges{
  @Input() totalSize:number = 0;
  @Input() curPage:number = 0;

  //通常不用传入
  @Input() pageSize:number = 10;
  @Input() maxSize:number = 10;

  @Input()
  color = 'primary'; // 主题颜色

  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  constructor() {
  }

  paginationInfo:Pagination;

  ngOnInit(){

  }

  ngOnChanges(changes): void {
    if((changes.curPage && changes.curPage.currentValue) || (changes.totalSize && changes.totalSize.currentValue)){
      this.paginationInfo = new Pagination();
      this.paginationInfo.page = this.curPage;
      this.paginationInfo.pageSize = this.pageSize;
      this.paginationInfo.rowCount = this.totalSize;
      this.paginationInfo.pageCount = Math.ceil(this.totalSize/this.pageSize);
    }
  }

  public btnClick(pageNo): void {
    this.pageChange.emit(pageNo);
  }

  ceil(num) {
    return Math.ceil(num);
  }
}
