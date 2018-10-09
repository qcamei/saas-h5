import {Output, Component, EventEmitter, OnInit, OnDestroy, Input, TemplateRef} from "@angular/core";

@Component({
  selector:'zm_table',
  template: `
    <!--<div class="coner">-->
      <!--【fixed-thead表头-->
      <!--<div class="scroll-thead">-->
        <!--<table class="form-table fixed-thead" cellpadding="0" cellspacing="0">-->
          <!--<tr>-->
            <!--<th style="width: 25%;" *ngFor="let item of tableThead; let i = index" >{{tableThead[i]}}</th>-->
          <!--</tr>-->
        <!--</table>-->
      <!--</div>-->
      <!--fixed-thead表头】-->
      <!--【scroll-tbody表身-->
      <!--<div class="scroll-box">-->
        <!--<table class="form-table" cellpadding="0" cellspacing="0">-->
          <!--<tr>-->
            <!--<td style="width: 25%;">111111</td>-->
            <!--<td style="width: 25%;">张三张三张三张三</td>-->
            <!--<td style="width: 25%;">男男男男男</td>-->
            <!--<td style="width: 25%;">181818</td>-->
          <!--</tr>-->
        <!--</table>-->
      <!--</div>-->
    <!--</div>-->
    
    <!-- Tab panes -->
    <div class="scroll-thead">
      <table class="form-table fixed-thead" cellpadding="0" cellspacing="0">table
       <ng-content select="content"></ng-content>
      </table>
    </div>
  `,
  styles:[`
    .form-table {
      width: 100%;
      margin: 0 auto;
      text-align: center;
      table-layout: fixed;
    }
    .form-table  th {
      /*border-left: none;
        border-top: none;*/
      border-right: 1px #ccc solid;
      /*border-bottom: 1px #ccc solid;*/
      background: #F3F3F3;
    }
    .form-table  td {
      border-left: none;
      border-top: none;
      border-bottom: 1px #ccc solid;
      border-right: 1px #ccc solid;
    }
    .scroll-thead{
      padding-right: 5px;
      box-sizing: border-box; 
      padding-right: 6px;
      background: #F3F3F3;
      border: 1px solid #ccc;
    }
    .fixed-thead {
      padding-right:5px;
     
    }
    .fixed-thead tr {
      width: 100%;
      height: 50px;
      line-height: 50px;
      /*display: block;*/
    }
    .fixed-thead tr th {
      /*float: left;
        width: 25%;*/
      height: 50px;
      font-size: 16px;
      text-align: center;
    }
    .form-table th:last-child {
      border-right: 0;
    }
    .scroll-box{
      width: 100%;
      height: 180px;
      overflow: auto;
      overflow-x:hidden;
      border: 1px solid #ccc;
      border-top: none;
    }
    .scroll-box tr {
      width: 100%;
      height: 40px;
      line-height: 20px;
    }
    .scroll-box tr td {
      /*width: 25%;*/
      padding: 5px;
    }
    .scroll-box tr:nth-child(odd) td {
      background-color: #ECE9D8;
    }

    /*重置元素设定的宽度和高度决定了元素的边框盒。*/
    *,.box-sizing {
      -moz-box-sizing: border-box;
      -o-box-sizing: border-box;
      -webkit-box-sizing: border-box;
      -ms-box-sizing: border-box;
      box-sizing: border-box;
    }
  `]
})
export class ZmTable implements OnInit,OnDestroy {


  // @Input() tableThead = [];
  // @Input() tableContentTemplate: TemplateRef<any>;
  // @Input() tableBody: string;
  // @Output() zmbtnClick: EventEmitter<any> = new EventEmitter();

  constructor(){
  }
  ngOnInit():void{

  }
  ngOnDestroy(): void {

  }
  // btnDate_Click(){
  //
  //   // this.zmbtnClick.emit();
  // }

}
