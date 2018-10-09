import {Component, Input} from "@angular/core";


/**
 * e.g
 <zm-modal-header title="注册" [cancel]="modalCtrl.cancelFunc()"></zm-modal-header>


 modalCtrl:ModalCtrl;
 constructor(private viewCtrl: ViewController) {
    this.modalCtrl = ModalCtrl.newCtrl(viewCtrl);
    this.service = new RegService();
  }
 */
@Component({
  selector:'zm-modal-header',
  template:
  `
    <ion-header>
        <ion-navbar>
         <ion-buttons >
            <button start ion-button (click)="cancel()">
              <ion-icon name="arrow-back"></ion-icon>
              返回
            </button>
          </ion-buttons>
          <ion-title>
            <strong>{{title}}</strong>
          </ion-title>
        </ion-navbar>
      </ion-header>
   `,
styles:[
  `


  `
]
})
export class ModalHeader{
    @Input() title:string;
    @Input() cancel:any;
    constructor(){}

}
