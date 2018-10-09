
import {Component, OnInit, OnDestroy, Input, TemplateRef, Output, EventEmitter} from "@angular/core";
import {SelectionModel} from "@angular/cdk/collections";


/**
 <ng-template #tdA let-item="item">
 <div style="width:120px; height:92px; margin: 0 auto;">
 <img *ngIf="item.defaultImg=='' " src="assets/images/pore.png" style="width: 100%; height:100%;"/>
 <img *ngIf="item.defaultImg!='' " :src="{{item.defaultImg|imgPrePath}}" style="width: 100%; height:100%;"/>
 </div>
 </ng-template>
 <ng-template #tdB let-item="item">{{item.number}}</ng-template>
 <ng-template #tdC let-item="item">{{item.name}}</ng-template>
 <ng-template #tdD let-item="item">{{item.typeId | productTypePipe:viewData.productTypeMap}}</ng-template>
 <ng-template #tdE let-item="item"><i class="fa fa-yen mr-1"></i>{{item.price |number:'1.2-2'}}</ng-template>
 <ng-template #tdF let-item="item"><i class="fa fa-yen mr-1"></i>{{item.cost |number:'1.2-2'}}</ng-template>
 <ng-template #tdG let-item="item">{{item.state | productStatePipe}}</ng-template>
 <ng-template #tdH let-item="item">
 <a class="zmCurHand" style="margin-right: 5px;"  *ngIf=" item.state == 1" (click)="changeState(item.productId,2)">{{item.state |productStatePipe2}}</a>
 <a class="zmCurHand" style="margin-right: 5px;"  *ngIf=" item.state == 2" (click)="changeState(item.productId,1)">{{item.state |productStatePipe2}}</a>
 <a class="zmCurHand" style="margin-right: 5px;"  (click)="goProductInfoDetail(item.id)">查看</a>
 <a class="zmCurHand" style="margin-right: 5px;"   *ngIf=" item.state == 2" (click)="goEditProductInfo(item.id)">编辑</a>
 <a class="zmCurHand" style="margin-right: 5px;"  *ngIf=" item.state == 2" (click)="removeProduct(item)">删除</a>
 </ng-template>

 <zm-mat-table-checkbox  [tdTemplateList]="[tdA,tdB,tdC,tdD,tdE,tdF,tdG,tdH]" [thNameList]="['图片','项目编号','项目名称','项目分类','售价','成本','状态','操作']" [itemList]="viewData.productList"></zm-mat-table-checkbox>

 */
@Component({
  selector:'zm-mat-table-checkbox',
  template: `
      
          <table  mat-table [dataSource]="itemList" [ngClass]="{'mat-elevation-z8': elevation }" class="zmFullWidth" >
          
            <ng-container  matColumnDef="select">
              <th mat-header-cell *matHeaderCellDef>
                <mat-checkbox (change)="$event ? allToggle() : null"
                              [checked]="selection.hasValue() && isAllSelected()"
                              [indeterminate]="selection.hasValue() && !isAllSelected()">
                </mat-checkbox>
              </th>
              <td mat-cell *matCellDef="let row">
                <mat-checkbox (click)="$event.stopPropagation()"
                              (change)="$event ? itemToggle(row) : null"
                              [checked]="selection.isSelected(row)">
                </mat-checkbox>
              </td>
            </ng-container>
    
            <ng-container [matColumnDef]="nameItem" *ngFor="let nameItem of thNameList; let i = index">
              <th mat-header-cell *matHeaderCellDef style="text-align:center">{{nameItem}}</th>
              <td mat-cell *matCellDef="let item" style="text-align:center">
                <ng-container *ngTemplateOutlet="tdTemplateList[i];context:{'item':item}"></ng-container>   
              </td>
            </ng-container>
    
            
            <tr mat-header-row *matHeaderRowDef="totalNameList"></tr>
            <tr mat-row *matRowDef="let row; columns: totalNameList;"></tr>
    
          </table>
      
            `,
  styles:[`
   
  `]
})


export class ZmMatTableCheckbox implements OnInit,OnDestroy {
  @Input() thNameList: Array<string>;
  @Input() tdTemplateList: Array<TemplateRef<any>>;
  @Input() checkAttr:string="checked";
  @Output() onSelected: EventEmitter<any> = new EventEmitter();
  @Output() elevation: boolean = false;




  private _itemList:Array<any>;
  @Input()
  get itemList(): Array<any> {
    return this._itemList;
  }

  set itemList(value: Array<any>) {
    this._itemList = value;
    this.initSelected();
  }

  totalNameList:Array<string> = new Array<string>();

  constructor(){

  }

  ngOnInit():void{
    this.totalNameList.push("select");
    this.totalNameList = this.totalNameList.concat(this.thNameList);

  }

  ngOnDestroy(): void {

  }
  selection = new SelectionModel<any>(true, []);

  initSelected(){
    this.selection = new SelectionModel<any>(true, []);
    this._itemList.forEach(item => {
      if(item[this.checkAttr]){
          this.selection.select(item);
      }
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this._itemList.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  allToggle() {
    let ref = this;
    if(this.isAllSelected()){
      this.selection.clear();
      this._itemList.forEach(item => {
        item[this.checkAttr] = false;
      });
    }else{
      this._itemList.forEach(item => {
        item[this.checkAttr] = true;
        this.selection.select(item)
      });
    }
    this.onSelected.emit(null);
  }

  itemToggle(item) {
    this.selection.toggle(item);
    item[this.checkAttr] = this.selection.isSelected(item);
    this.onSelected.emit(null);
  }
}

