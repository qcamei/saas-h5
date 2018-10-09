import {Component, Input} from "@angular/core";
import {MatTooltipDefaultOptions} from "@angular/material";

/**
 * 表格组件 只做简单的样式封装
 * eg: <zm-table [borderNone]="true"><thead></thead><tbody></tbody></zm-table>
 */
@Component({
  selector: 'zm-card',
  template: `
    <mat-expansion-panel style="margin-bottom: 20px;" [expanded]="expanded" [disabled]="!withCollapse">
      <mat-expansion-panel-header *ngIf="showHeader">
        <div fxLayout="row" fxFlexAlign="start center">
          <label style="color:#2a2a2a;" class="fz-18" *ngIf="header">{{header}}</label>
          <img *ngIf="matTooltipText" matTooltip="{{matTooltipText}}"  [matTooltipPosition]="'after'" src="assets/images/icon/question_gray.png"
               style="margin-left: 5px;width: 18px;height: 18px;display: inline-block"/>
        </div>

      </mat-expansion-panel-header>
      <ng-content></ng-content>
    </mat-expansion-panel>
  `,
  styles: [`

  `]
})
export class ZmCard {
  @Input() header: string;
  @Input() withCollapse: boolean = true;
  @Input() expanded: boolean = true;
  @Input() showHeader: boolean = true;
  @Input() matTooltipText: string;

}



