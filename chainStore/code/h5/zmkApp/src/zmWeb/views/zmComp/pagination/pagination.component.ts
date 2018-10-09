
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ionc-pagination',
  template: `
      <div fxLayout="row" fxLayoutAlign="center center">
       <button ion-button (click)="clickBeginning.next()" icon-only [color]="color" [disabled]="pagination.page === 1">
          <ion-icon name="rewind"></ion-icon>
        </button>
    
        <button ion-button (click)="clickPrevious.next()" icon-only [color]="color" [disabled]="pagination.page === 1">
          <ion-icon name="arrow-dropleft"></ion-icon>
        </button>
      <span>{{currentPageItemsMin }}-{{ currentPageItemsMax }} of {{ maxItems }}</span>
        <button ion-button (click)="clickNext.next()" icon-only [color]="color" [disabled]="pagination.page === pagination.pageCount">
          <ion-icon name="arrow-dropright"></ion-icon>
        </button>
        <button ion-button (click)="clickEnd.next()" icon-only [color]="color" [disabled]="pagination.page === pagination.pageCount">
          <ion-icon name="fastforward"></ion-icon>
        </button>
      </div>
       

`,
  styles: [`
    [pagination-center-text] {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class PaginationComponent {
  @Input() pagination: Pagination;
  @Input() color: string;
  @Output() clickBeginning = new EventEmitter();
  @Output() clickPrevious = new EventEmitter();
  @Output() clickNext = new EventEmitter();
  @Output() clickEnd = new EventEmitter();

  get currentPageItemsMin() {
    return Math.max(1, (this.pagination.page - 1) * this.pagination.pageSize);
  }

  get currentPageItemsMax() {
    return Math.min((this.pagination.page) * this.pagination.pageSize, this.maxItems);
  }

  get maxItems() {
    return this.pagination.rowCount;
  }

  constructor() {}

}

export class Pagination {
  page: number;
  pageSize: number;
  rowCount: number;
  pageCount: number;
}

