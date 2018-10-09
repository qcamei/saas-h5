import {Component, OnInit, OnDestroy, Input} from "@angular/core";

/**
 * 表格组件 只做简单的样式封装
 * eg: <zm_table [borderNone]="true"><thead></thead><tbody></tbody></zm_table>
 */
@Component({
  selector:'zm_table',
  template: `
      <div>

        <table class="table table-hover table-bordered text-center" [class.scrollTable]="borderNone">
          <ng-content select="thead"></ng-content>
          <ng-content select="tbody"></ng-content>
        </table>

      </div>
            `,
  styles:[`
  
  `]
})
export class ZmTable implements OnInit,OnDestroy {

  @Input() borderNone:boolean;

  ngOnInit():void{

  }

  ngOnDestroy(): void {

  }
}



