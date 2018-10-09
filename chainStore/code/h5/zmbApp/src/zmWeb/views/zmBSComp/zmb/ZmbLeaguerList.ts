import {Component, Input, OnInit, Output, EventEmitter} from "@angular/core";

/**
 * <zmb-leaguer-list (click)="goDetailPage(item.id)" headImg="{{item.headImg}}" name="{{item.name}}" phone="{{item.phone}}" sortType="{{getSortType(item)}}" sortTypeAttr="{{viewData.sortTypeAttr}}"></zmb-leaguer-list>
 */
@Component({
  selector:'zmb-leaguer-list',
  template: `
          <ion-card class="fade-in-right-item">
                 <ion-row> 
                    <div style="padding:10px" fxLayout="row wrap" w-100 fxLayoutAlign="space-between center" fxLayoutGap="20px">
                        <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="20px">
                          <div zmk-img-circle><img w-100 h-100 src="{{headImg | zmImgPath}}"></div>
                          <div fxLayout="column" fxLayoutAlign="space-between center" fxLayoutGap="10px">
                              <span>{{name}}</span>
                              <span style="color:#999;">{{phone}}</span>
                          </div>          
                        </div>
                        
                         <div fxLayout="column" fxLayoutAlign="space-between center" fxLayoutGap="10px">
                            <span  style="color:#999;">{{sortTypeAttr}}</span>
                            <span  style="color:#999;">{{sortType}}</span>
                         </div>
                    </div>
                 </ion-row>
          </ion-card>
            `,
  styles:[`
        [text-color-3]{
            color:#333333;
        }
    `]
})
export class ZmbLeaguerList implements OnInit{

  @Input() headImg:string;
  @Input() name:string;
  @Input() phone:string;
  @Input() sortType:string;
  @Input() sortTypeAttr:string;

  ngOnInit(){

  }

}


