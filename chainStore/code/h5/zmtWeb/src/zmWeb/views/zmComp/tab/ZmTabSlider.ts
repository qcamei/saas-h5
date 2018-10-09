import {Component, OnInit, OnDestroy, Input, Output, EventEmitter} from "@angular/core";

/**
 * <zm-tabs-slider [imgList]="viewData.vipLevelList" (onSelect)="selectVipLevel($event)"></zm-tabs-slider>
 */
@Component({
  selector:'zm-tabs-slider',
  template: `

      <div *ngIf="imgListTmp&&imgListTmp.length == 1" class="mt-40" fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="20px">
        <div *ngFor="let item of imgListTmp[0]" [class.pitch-on]="item.isSelected" (click)="select(item)" style="width:289px;height:413px;cursor:pointer;position:relative;border:1px solid #ccc;border-radius:18px;overflow:hidden;"> 
            <img class="w-100-p h-100-p" [src]="item.target.defualtImg | imgPrePath"> 
            <img *ngIf="item.isSelected" style="position:absolute;right:0;bottom:0" src="assets/images/icon/pitch_on.png"> 
        </div> 
      </div>

      <mat-tab-group *ngIf="imgListTmp&&imgListTmp.length > 1" headerPosition="below" class="myTabSlider mb-20">

        <mat-tab *ngFor="let imgArr of imgListTmp"> 
          <div class="mt-40" fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="40px">
            <div *ngFor="let item of imgArr" [class.pitch-on]="item.isSelected" (click)="select(item)" style="width:289px;height:413px;cursor:pointer;position:relative;border:1px solid #ccc;border-radius:18px;overflow:hidden;"> 
                <img class="w-100-p h-100-p" [src]="item.target.defualtImg | imgPrePath"> 
               <!-- <img *ngIf="item.isSelected" style="position:absolute;right:8%;bottom:10%;" src="assets/images/icon/pitch_on.png"> -->
                <img *ngIf="item.isSelected" style="position:absolute;right:0;bottom:0;" src="assets/images/icon/pitch_on.png"> 
            </div> 
         </div>
        </mat-tab>
        
        
    </mat-tab-group>



            `,
  styles:[`
  .pitch-on{
    top:-30px;
    left:0;
 }

  `]
})


export class ZmTabSlider implements OnInit,OnDestroy {

  @Input() imgList:Array<any>;
  @Output() onSelect:EventEmitter<any> = new EventEmitter<any>();
  public imgListTmp:Array<any>;

  ngOnInit():void{
    if(this.imgList && this.imgList.length>0){
      this.imgListTmp = new Array<any>();
      if(this.imgList.length <=4){
        this.imgListTmp.push(this.imgList);
      }else if(this.imgList.length <=8){
        this.imgListTmp.push(this.imgList.slice(0,4));
        this.imgListTmp.push(this.imgList.slice(4,this.imgList.length));
      }else if(this.imgList.length <=12){
        this.imgListTmp.push(this.imgList.slice(0,4));
        this.imgListTmp.push(this.imgList.slice(4,8));
        this.imgListTmp.push(this.imgList.slice(8,this.imgList.length));
      }else if(this.imgList.length <=16){
        this.imgListTmp.push(this.imgList.slice(0,4));
        this.imgListTmp.push(this.imgList.slice(4,8));
        this.imgListTmp.push(this.imgList.slice(8,12));
        this.imgListTmp.push(this.imgList.slice(12,this.imgList.length));
      }
    }
  }

  ngOnDestroy(): void {

  }

  select(item){
    this.onSelect.emit(item);
  }
}


