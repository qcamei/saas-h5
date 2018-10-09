import {Component, OnInit, OnDestroy, Input} from "@angular/core";

/**
 * 表格组件 只做简单的样式封装
 * eg:
 <zm-card-box [withCollapse]="true" [expanded]="contentExpanded">
 <header>
 <div fxLayout="row" fxLayoutAlign="start" fxLayoutGap="20px">

 </div>
 </header>
 <content>

 </content>
 </zm-card-box>
 */
@Component({
  selector:'zm-card-box',
  template: `
      
    <mat-expansion-panel [expanded]="expanded" [disabled]="!withCollapse" style="margin-bottom: 15px;">
        <mat-expansion-panel-header >
              <ng-content select="header"></ng-content>
        </mat-expansion-panel-header>
        <ng-content select="content"></ng-content>
    </mat-expansion-panel>
            `,
  styles:[`
  
  `]
})
export class ZmCardBox {

  @Input() header:string;
  @Input() withCollapse:boolean = true;
  @Input() expanded:boolean = true;

}



