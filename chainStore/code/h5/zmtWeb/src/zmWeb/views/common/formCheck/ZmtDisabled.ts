import {Directive, ElementRef, Input} from "@angular/core";


@Directive({
  selector: '[zmtEnabled]'
})
export class ZmtEnabled{

  constructor(private el: ElementRef){
  }

  @Input('zmtEnabled') set enabled( disabledP: boolean ) {
    this.enabledEL(disabledP);
  }
  private enabledEL(flag:boolean) {
    console.info("enabled:"+flag);


    if(flag){

      this.el.nativeElement.disabled = "";
    }else{
      this.el.nativeElement.disabled = "disabled";
    }
  }
}
