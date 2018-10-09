import {Component, OnInit, OnDestroy, Input, ViewEncapsulation} from "@angular/core";

/**
 * 表格组件 只做简单的样式封装
 * eg: <zm-table [borderNone]="true"><thead></thead><tbody></tbody></zm-table>
 */
@Component({
  selector:'zm_table',
  template: `
      <div>

        <table class="zmTable zmFullWidth">
          <ng-content select="thead"></ng-content>
          <ng-content select="tbody"></ng-content>
        </table>
        
      </div>
            `,
  styleUrls:['./table.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ZmTable implements OnInit,OnDestroy {

  @Input() borderNone:boolean;

  ngOnInit():void{

  }

  ngOnDestroy(): void {

  }
}



