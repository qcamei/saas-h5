
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
                  <div  detail-push (click)="onClick()">
                    <h2 style="padding:20px 10px">{{store.name}}66</h2>
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



