/**
 * Created by Orange on 2018/6/27.
 */
import {Component, OnInit, OnDestroy, Input} from "@angular/core"

@Component({
  selector: 'zm-info-list-picture',
  template: `
            
        <div class="imgeItem">
                    <div class="imagetitle">{{imgeTitle}}</div>
                    <div class="imageP"><img class="imagevalue" [src]="path"></div>
                    <div class="lineView"></div>
        </div>
              
              `,
  styles: [`

    .imgeItem{
    top: 100px;
    width: 100%;
    height: 100px;
    background-color: white;
    color:#414141;
    font-size: 16px;
    
    }
    
    .imgeItem .imagetitle{
    width: 100px;
    height: 60px;
    padding-top: 40px;
    padding-left: 20px;
    float: left;
    /*left: 15px;*/
    }
    
    .imgeItem .imagevalue{
    width: 100%;
    height: 100%;
   
    /*border-radius:10px 10px 10px 10px;*/
    /*left: 120px;*/
    }
    .imgeItem .imageP{
       float: right;
        margin-top: 10px;
        margin-right: 20px;
        height:80px;
        width:80px;
        overflow:hidden;
        border-radius:50%;
    }
    
    .imgeItem .lineView{
    width: 95%;
    height: 1px;
    float: right;
    margin-top: 9px;
    background-color: #f3f3f3;
    }

`]
})

export class InfoPictureTemplate implements OnInit,OnDestroy {

  @Input() imgeTitle: string = "头像";
  @Input() path: string = "assets/icon/people_circle.svg";

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {

  }


}
