/**
 * Created by sunbirdjob on 2018/2/23.
 <ng-template #modalBodyTemplate>
    <div>this is body</div>
 </ng-template>

 <ng-template #modalBindTemplate let-open="open">
    <button class="btn btn-lg btn-outline-primary" (click)="open()">Launch modal</button>
 </ng-template>

 <zm_modal  [modalBodyTemplate]="modalBodyTemplate"  [modalBindTemplate]="modalBindTemplate" [title]="'modal title'" (confirmFunc)=" confirmFunc() " (cancelFunc)=" cancelFunc() "></zm_modal>
 */
import {Component, OnInit, OnDestroy, Input, TemplateRef, ViewChild, Output, EventEmitter} from "@angular/core";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";




@Component({
  selector:'zm_modal',
  template: ` 
     
    <ng-template #content>
        <div class="modal-header">
          <h4 class="modal-title">{{title}}</h4>
          <button type="button" class="close" aria-label="Close" (click)="dismiss()">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p><ng-container *ngTemplateOutlet="modalBodyTemplate"></ng-container></p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-dark" (click)="cancel()">取消</button>
          <button type="button" class="btn btn-outline-dark" (click)="confirm()">确定</button>
        </div>
    </ng-template>
       
    <ng-container *ngTemplateOutlet="modalBindTemplate;context:ctx"></ng-container>
            `
})


export class ZmModal implements OnInit,OnDestroy {

  @Input() title:string;
  @Input() modalAgent:ZmModalAgent;
  @Input() modalBodyTemplate: TemplateRef<any>;
  @Input() modalBindTemplate: TemplateRef<any>;
  @Output() confirmFunc:EventEmitter<any> = new EventEmitter();
  @Output() cancelFunc :EventEmitter<any> = new EventEmitter();

  ctx:any;
  private modalRef:NgbModalRef;
  @ViewChild('content') contentTemp:TemplateRef<any>;

  constructor(private modalService: NgbModal) {
    let service = this;
    service.ctx = {};
    service.ctx.open = function(){
      service.openModal();
    };
  }


  openModal() {
    this.modalRef = this.modalService.open(this.contentTemp);
  }

  cancel():void{

    this.cancelFunc.emit();
    this.modalRef.close();

    // let shouldClose:boolean = (!this.modalAgent) || (!this.modalAgent.cancelFunc) ||this.modalAgent.cancelFunc();
    // if(shouldClose ){
    //   this.modalRef.close();
    // }
  }
  confirm():void{

    this.confirmFunc.emit();
    this.modalRef.close();

    // let shouldClose:boolean =  (!this.modalAgent) ||(!this.modalAgent.confirmFunc) ||this.modalAgent.confirmFunc();
    // if(shouldClose ){
    //   this.modalRef.close();
    // }
  }

  dismiss():void{
    this.modalRef.dismiss();
  }

  ngOnInit():void{

  }

  ngOnDestroy(): void {

  }
}

export class ZmModalAgent{
  confirmFunc:ZmBooleanFunc;
  cancelFunc:ZmBooleanFunc;
}



