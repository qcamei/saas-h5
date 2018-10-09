import {Component, OnInit, OnDestroy, Input, ViewEncapsulation} from "@angular/core";

/**
 * 表格组件 只做简单的样式封装
 * eg: <zm-table-detail [borderNone]="true"><thead></thead><tbody></tbody></zm-table-detail>
 */
@Component({
  selector:'zm-table-detail',
  template: `
        <div>
              <table class="zmTableDetail zmFullWidth">
                <ng-content select="thead"></ng-content>
                <ng-content select="tbody"></ng-content>
              </table>
        </div>

            `,
  styleUrls:['ZmTableDetail.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ZmTableDetail implements OnInit,OnDestroy {

  @Input() borderNone:boolean;

  ngOnInit():void{

  }

  ngOnDestroy(): void {

  }
}



