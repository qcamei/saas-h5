import {Component, Input, Output, EventEmitter, OnInit} from "@angular/core";
/**
 * Created by sunbirdjob on 2018/3/8.
 * 列表复选框
 * <zm_list_checkbox [(zmValue)]="viewData.prdInfoListShow[i]"></zm_list_checkbox>

 */

@Component({
  selector: 'zm_list_checkbox',
  template: `
             <div class="disFlex">
                <div class="dib disFlex align-center " (click)="cheed()">
                   <span class="cur-hand" style="width: 16px;height: 16px; line-height: 16px; display: inline-block;" *ngIf="cheStyle" ><img src="assets/images/icon/checkbox.png" alt="" style="display: inherit; vertical-align:top;"></span>
                   <span class="cur-hand" style="width: 16px;height: 16px; line-height: 16px; display: inline-block;" *ngIf="!cheStyle"><img src="assets/images/icon/checkboxNo.png" alt="" style="display: inherit; vertical-align:top;"></span>
                   <ng-content select="content"></ng-content>
                </div>
            </div>
            `,
  styles: [
    `
  
     .disFlex {
        display: -webkit-box;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: -moz-box;
        display: flex;
      }
      .align-center {
        -webkit-box-align: center;
        -ms-flex-align: center;
        -webkit-align-items: center;
        -moz-box-align: center;
        align-items: center;
        justify-content: center;
      }
      .cur-hand{
        cursor: pointer;
      }
      
      .dib{
        display: inline-block;
      }

    `]
})

export class ZmListCheckbox implements OnInit {

  public cheStyle: boolean = false;
  private itemTmp: any;
  @Output() zmValueChange = new EventEmitter();

  @Input()
  get zmValue() {
    return this.itemTmp;
  }

  set zmValue(val) {
    this.itemTmp = val;
    this.zmValueChange.emit(this.itemTmp);
  }


  ngOnInit() {
    if (this.itemTmp && this.itemTmp.checked) {
      this.cheStyle = !this.cheStyle;
    } else {
      this.cheStyle = this.cheStyle;
    }
  }

  cheed(): void {
    this.itemTmp.checked = !this.itemTmp.checked;
    this.cheStyle = !this.cheStyle;
    this.zmValueChange.emit(this.itemTmp);
  }
}
