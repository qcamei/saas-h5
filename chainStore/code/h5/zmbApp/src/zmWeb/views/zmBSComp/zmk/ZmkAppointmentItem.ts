import {Component, Input, OnInit} from "@angular/core";
// <zmk-appointment-item createTime="createTime" time="time"state="state"buserName="buserName" itemList="itemList" ></zmk-appointment-item>
@Component({
  selector: 'zmk-appointment-item',
  template: `
            
            <div style="border-top:5px solid #F3F3F3;">
                 <ion-row> 
                       <div item-title w-100 style="padding:5px 10px; border-bottom:1px solid #F7F7F7">创建时间：{{createTime | zmDatePipe}}</div>
                  </ion-row>

                 <ion-row> 
                    <div style="padding:5px 10px;" w-100 fxLayout="row" fxLayoutAlign="space-between center" >
                          <span item-title>预约时间:{{time | zmDatePipe}}</span>
                          <span item-title>{{state | appointmentStatusPipe}}</span>
                    </div>
                 </ion-row>
          
                  <div *ngFor="let item of productList">
                    <ion-row> 
                    <ion-col>
                    <ion-item zmk-item-sm style="background:#FBFBFB;">
                        <div  fxLayout = "row" fxLayoutAlign="start center" fxLayoutGap="10px">
                        
                        <div item-start style="width:70px;height:56px;" >
                           <img style="width: 100%;height: 100%" :src="{{item.img|zmImgPath}}">
                        </div>
                                <div fxLayout="column" w-100>
                                    <div  fxLayout="column">
                                        <span item-title>{{item.name}}</span>
                                        <div>
                                          <span theme-color theme-border mr-1>{{item.typeName}}</span>
                                        </div>
                                    </div>   
                                  
                                    <div  fxLayout="row" fxLayoutAlign="space-between center" >
                                            <div><span item-subtitle>￥{{item.price}}</span></div>
                                            <span item-subtitle>x{{item.count}}</span>
                                    </div>
                              </div>  
                        </div>
                     </ion-item>
                    </ion-col>  
                 </ion-row>   
                  <ion-row> 
                       <div style="padding:5px 10px;" w-100 fxLayout="row" fxLayoutAlign="space-between center" >
                            <span>服务人员</span>
                            <span>{{item.staffName?item.staffName:'未指定'}}</span>
                       </div>
                  </ion-row>
                  </div>
                  
                  <!--预约渠道o-->
                  <ion-row> 
                    <div item-title style="padding:5px 10px; border-top:1px solid #F7F7F7">预约渠道：{{channel | appointOriginTypePipe}}</div>
                  </ion-row>
          
             </div>
          
          
          
            `,
  styles: [`
    `]
})


export class ZmkAppointmentItem implements OnInit {

  @Input() createTime: string;
  @Input() time: string;
  @Input() state: string;
  @Input() channel: string;
  @Input() productList: Array<any>;

  constructor() {
  }

  ngOnInit() {

  }

}


