import {Component, Input, OnInit} from "@angular/core";
//  <zmk-title name="" ></zmk-title>
@Component({
  selector:'zmk-title',
  template: `

  <div style="width:100%;margin-top:5px;border-top:8px solid #F3F3F3;">
     <div style="padding:8px;font-size:12px;color: #999999;border-bottom: 1px solid #F3F3F3;margin-bottom:5px">{{name}}</div>
  </div>
            `
})


export class ZmkTitle implements OnInit{

  @Input() name:string;


  constructor(){ }

  ngOnInit(){

  }

}


