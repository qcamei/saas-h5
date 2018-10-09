import {Component, Input, Output, EventEmitter} from "@angular/core";


/**
 * e.g
 <zm-modal-header title="注册" [operation]="true" [edit]="'编辑'" [cancel]="modalCtrl.cancelFunc()"></zm-modal-header>


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
          
           <ion-buttons *ngIf="operation" end>
          <button *ngIf="search" (click)="zmbClick(0)" ion-button >
             <ion-icon [name]="search"></ion-icon>
          </button>
           <button *ngIf="add"  (click)="zmbClick(1)" ion-button >
             <ion-icon style="font-size:26px;" [name]="add"></ion-icon>
          </button>
           <button *ngIf="edit"  (click)="zmbClick(2)" ion-button >
             <span style="font-size:14px;">{{edit}}</span> 
          </button>
        </ion-buttons>
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

  @Input() search:string;//搜索
  @Input() add:string;//加号
  @Input() edit:string;//编辑按钮
  @Input() operation:boolean=false;//默认不显示右边编辑栏
  @Output() zmbBtnClick: EventEmitter<any> = new EventEmitter();
    constructor(){}

  zmbClick(n){
      this.zmbBtnClick.emit(n)
  }
}
