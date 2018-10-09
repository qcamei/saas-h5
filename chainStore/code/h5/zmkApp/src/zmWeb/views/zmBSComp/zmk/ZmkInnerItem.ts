import {Component, Input, OnInit} from "@angular/core";

@Component({
  selector:'zmk-inner-item',
  template: `

        <ion-item zmk-item-sm style="background:#FBFBFB;"  *ngIf="itemList.length == 1">
                <div *ngFor="let item of itemList; let i = index" fxLayout = "row" fxLayoutAlign="start center" fxLayoutGap="10px">
                    <div item-start style="width:70px;height:56px;">
                           <img style="width: 100%;height: 100%" :src="{{item.pgImg|zmImgPath}}">
                           <span *ngIf="item.promotionFlag==1" style="background:red;color:#ffffff;border-radius:10px;padding:0 5px;position:absolute;left:-1px;top:-1px;font-size:10px;">促销</span>
                    </div>
                        
                        <div fxLayout="column" w-100>
                            <div  fxLayout="column">
                                 <span item-title>{{item.pgName}}</span>
                                 <div *ngIf="item.pgTypeName">
                                   <span theme-color theme-border mr-1>{{item.pgTypeName}}</span>
                                 </div>
                            </div>   
                       </div>  
                </div>
         </ion-item>
         
         <div  *ngIf="itemList.length > 1" style="padding:0 10px;">
                <div fxLayout = "row" fxLayoutAlign="start center" fxLayoutGap="10px">
                    <div style="width:25%;" *ngFor="let item of itemList; let i = index" fxLayout = "column" fxLayoutAlign="start center" fxLayoutGap="2px">
                         <div style="width:70px;height:70px;">
                           <img style="width:100%;height:100%;" :src="{{item.pgImg|zmImgPath}}">
                           <span *ngIf="item.promotionFlag==1" style="background:red;color:#ffffff;border-radius:10px;padding:0 5px;position:absolute;left:-1px;top:-1px;font-size:10px;">促销</span>
                         </div> 
                     
                           <span overflow-hidden-1 w-100>{{item.pgName}}</span>
                    </div>
                </div>
         </div>
          

            `,
  styles:[`
    `]
})


export class ZmkInnerItem implements OnInit{

  @Input() itemList:Array<any>;

 ngOnInit(){
   if(this.itemList.length>4){
     this.itemList = this.itemList.slice(0,4);
   }
 }

}


