import {Component,Input} from "@angular/core";

/**
 * 表格组件 只做简单的样式封装
 * eg: <zm-table [borderNone]="true"><thead></thead><tbody></tbody></zm-table>
 */
@Component({
  selector:'zm-card',
  template: `    
    <mat-expansion-panel style="margin-bottom: 20px;" [expanded]="expanded" [disabled]="!withCollapse" >
        <mat-expansion-panel-header  *ngIf="showHeader">

              <label style="color:#2a2a2a;" class="fz-18" *ngIf="header">
                <span *ngIf="!textBold">{{header}}</span>
                <span *ngIf="textBold" style="font-size:18px;font-weight:bold;">{{header}}</span>
              </label>

        </mat-expansion-panel-header>
        <ng-content></ng-content>
    </mat-expansion-panel>
            `,
  styles:[`
  
  `]
})
export class ZmCard {
  @Input() textBold:boolean=false;//文字label是否加粗
  @Input() header:string;
  @Input() withCollapse:boolean = true;
  @Input() expanded:boolean = true;
  @Input() showHeader:boolean = true;

}



