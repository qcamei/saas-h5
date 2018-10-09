
import {Component, OnInit, Input, Output, EventEmitter} from "@angular/core";
import {Store} from "../../bsModule/store/data/Store";

/**
 * e.g
 *
 */
@Component({
  selector:'zm-store-info',
  template: `

            <ion-card>
                  <div style="padding:15px" (click)="onClick()">
                    <h2>{{store.name}}</h2>
                  </div>
            </ion-card>
            `,
  styles:[`
    `]
})


export class ZmStoreInfo implements OnInit {

  @Input() store:Store;
  @Output() zmClick: EventEmitter<Store> = new EventEmitter();

  constructor(){ }

  ngOnInit():void{
  }

  onClick(){
    this.zmClick.emit(this.store);
  }

}



