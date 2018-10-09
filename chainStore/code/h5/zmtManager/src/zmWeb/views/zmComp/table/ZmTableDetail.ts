import {Component, OnInit, OnDestroy, Input} from "@angular/core";

/**
 * 表格组件 只做简单的样式封装
 * eg: <zm_table_detail [borderNone]="true"><thead></thead><tbody></tbody></zm_table_detail>
 */
@Component({
  selector:'zm_table_detail',
  template: `
      <div>

        <table class="table table-bordered text-center" [class.scrollTable]="borderNone">
          <ng-content select="thead"></ng-content>
          <ng-content select="tbody"></ng-content>
        </table>

      </div>
            `,
  styles:[`
  
  `]
})
export class ZmTableDetail implements OnInit,OnDestroy {

  @Input() borderNone:boolean;

  ngOnInit():void{

  }

  ngOnDestroy(): void {

  }
}



