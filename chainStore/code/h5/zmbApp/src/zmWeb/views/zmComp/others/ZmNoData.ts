import { Component,} from "@angular/core";


// <zm-no-data [show]="true"  text="没有数据" ></zm-no-data>
@Component({
  selector:'zm-no-data',
  template:
    `
        <div class="dataDiv" fxLayout="column" fxLayoutAlign="center center">
            <img src="assets/img/noData.png" height="120px" width="120px"/>
            <span>没有数据</span>
        </div>
   `,
  styles:[`
        .dataDiv {
          position: fixed;
          -ms-position: fixed;
          -webkit-position: fixed;
          -o-position: fixed;
          -moz-position: fixed;
          text-align: center;
          width:100%;
          height:75%;
        }
        
`]
})
export class ZmNoData{

  constructor(){
  }

}
