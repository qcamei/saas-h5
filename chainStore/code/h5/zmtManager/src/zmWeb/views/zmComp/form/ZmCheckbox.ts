import {Component, Input, Output, EventEmitter} from "@angular/core";
/**
 * checkbox复选框 适用表格内复选框
 * <zm-checkbox [(zmValue)]="true" (checkCallback)="" [canEdit]="true"></zm-checkbox>
 */
@Component({
  selector:'zm-checkbox',
  template: `
            <div (click)="check()" class="disFlex align-center" style="justify-content: center;">
                <span class="cur-hand c-child-checkbox disFlex align-center" >
                  <span style="width: 16px;height: 16px;display: inline-block;"><img [src]="canEdit?'assets/images/icon/checkbox.png':'assets/images/icon/checkboxCantEdit.png'" alt="" *ngIf="zmValue" style="display: inherit;"></span>
                  <span style="width: 16px;height: 16px;display: inline-block;margin-left: -16px;"><img [src]="canEdit?'assets/images/icon/checkboxNo.png':'assets/images/icon/checkboxCantEdit.png'" alt="" *ngIf="!zmValue" style="display: inherit;"></span>
                </span>
            </div>
            `,
  styleUrls: ['./input.scss']
})

export class ZmCheckbox{

  @Output() zmValueChange = new EventEmitter();
  @Output() checkCallback = new EventEmitter();
  @Input() canEdit:boolean = true;

  private valueTmp:any;

  @Input()
  get zmValue() {
    return this.valueTmp;
  }

  set zmValue(val) {
    this.valueTmp = val;
    this.zmValueChange.emit(this.valueTmp);
  }

  check():void{
    if(!this.canEdit){
      return;
    }
    this.zmValue = !this.zmValue;
    this.checkCallback.emit(this.zmValue);
  }

}
