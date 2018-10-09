import {Component, EventEmitter, Input, Output} from "@angular/core";

@Component({
  selector:'zm-img-circle',
  template: `<div class="disFlex hor-center" ><img src="{{imgSrc}}" alt="" style="width: 100px;height: 100px;border-radius: 50%;"></div>`,
  styles:[` 
    .disFlex {
      display: -webkit-box;
      display: -ms-flexbox;
      display: -webkit-flex;
      display: -moz-box;
      display: flex;
    }
    .hor-center {
      -webkit-box-pack: center;
      -ms-flex-pack: center;
      -webkit-justify-content: center;
      -moz-box-pack: center;
      justify-content: center;
    }
  `]
  })

export class ZmImgCircle{
  @Input() imgSrc: string;
  @Output() zmimgCircle = new EventEmitter();

}
