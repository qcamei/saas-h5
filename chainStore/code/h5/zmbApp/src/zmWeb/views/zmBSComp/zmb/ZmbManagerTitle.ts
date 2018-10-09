import {Component, Input, OnInit} from "@angular/core";
//  <zmbManager-title name="" ></zmbManager-title>
@Component({
    selector:'zmbManager-title',
    template: `

  <div style="width:100%;padding:8px 10px;">
     <div style="padding:0 8px;border-left:3px solid #4678FA; font-size:14px;">{{name}}</div>
  </div>
            `
})


export class ZmbManagerTitle implements OnInit{

    @Input() name:string;


    constructor(){ }

    ngOnInit(){

    }

}


