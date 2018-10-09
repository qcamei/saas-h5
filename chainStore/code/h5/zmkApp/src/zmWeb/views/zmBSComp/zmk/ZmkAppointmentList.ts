import {Component, Input, OnInit} from "@angular/core";
// <zmk-appointment-list dateTime="" appoinTime="" productList=""></zmk-appointment-list>
@Component({
  selector:'zmk-appointment-list',
  template: `
          <ion-card class="fade-in-right-item">
              
                <ion-row> 
                    <div w-100 style="padding:5px 10px;border:1px solid #F3F3F3;">
                        <span theme-color>{{dateTime}}</span>
                    </div>
                </ion-row>
                 <ion-row> 
                    <div w-100>
                        <div style="padding:5px 10px;" w-100 fxLayout="row" fxLayoutAlign="start center">
                            
                                <span style="width:25%;">预约时间：</span>
                                <div style="width:75%;" overflow-hidden-1>
                                    <span text-color-3 mr-1>{{appoinTime}}</span>
                                </div>          
                        </div>
                        
                         <div style="padding:5px 10px;" w-100 fxLayout="row" fxLayoutAlign="start center">
                                <span style="width:25%;">预约项目：</span>
                                <div style="width:75%;" overflow-hidden-1>
                                    <span text-color-3 mr-1>{{productList}}</span>
                                   
                                </div>
                         </div>
                    </div>
                 </ion-row>
          </ion-card>
            
          
          
          
            `,
  styles:[`
        [text-color-3]{
            color:#333333;
        }
        [text-color-9]{
            color:#999999;
        }
    `]
})


export class ZmkAppointmentList implements OnInit{



//   @Input() createTime:string;
  @Input() dateTime:string;
  @Input() appoinTime:string;
  @Input() productList:string;
//   @Input() itemList:Array<any>;
//   @Input() channel:string;

  constructor(){ }

  ngOnInit(){


  }

}


