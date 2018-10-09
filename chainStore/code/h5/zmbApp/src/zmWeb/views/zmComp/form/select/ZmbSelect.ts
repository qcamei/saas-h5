import {Component, EventEmitter, Input, Output} from "@angular/core";

/**
 * select
 * <zmb-select [title]="'阴历阳历'" [(zmValue)]="viewData.updateForm.dateType" [selectList]="[{name:'阴历',value:'0'},{name:'阳历',value:'1'}]"></zmb-select>
 */
@Component({
  selector: 'zmb-select',
  template: `

                <div style="position:relative;" w-100 fxLayout="row" fxLayoutAlign="space-between center">
                      <span>{{title}}</span>
                        
                      <ion-select style="padding:0 5px !important;" [cancelText]="cancelText" [okText]="okText" [(ngModel)]="zmValue">
                          <ion-option *ngFor="let item of selectList" [value]="item[value]" (ionSelect)="select($event)">{{item[name]}}</ion-option>
                      </ion-select>
                 
                </div>
                

            `,
  styles: [`
    
    `]
})
export class ZmbSelect {

  @Input() selectList:Array<any>;
  @Input() name:string="name";
  @Input() value:string="value";
  @Input() title:string;
  @Input() cancelText:string="取消";
  @Input() okText:string="确定";
  @Output() zmValueChange = new EventEmitter();
  @Output() onSelect = new EventEmitter();
  private zmValueTmp:any;

  /**
   * zmValue 双向绑定
   */
  @Input()
  get zmValue():any {
    return this.zmValueTmp;
  }
  set zmValue(val:any) {
    this.zmValueTmp = val;
    this.zmValueChange.emit(this.zmValueTmp);
  }

  select(event){
    this.zmValue = event.value;
    this.onSelect.emit();
  }

}
