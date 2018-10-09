import {Directive, OnInit, ElementRef, Renderer2} from "@angular/core";

// <div animation-modal></div>

@Directive({
  selector: '[animation-modal]',
})
export class AnimationModalDirective implements OnInit {

  public parentElemet:ElementRef;
  public paymodal:ElementRef;

  constructor(public el: ElementRef,public renderer:Renderer2) {

  }

  ngOnInit() {

    let role = this.el.nativeElement.getAttribute("role");
    this.paymodal = this.el.nativeElement.parentElement.parentElement.parentElement;
    this.parentElemet = this.el.nativeElement.parentElement.parentElement;

    this.renderer.addClass(this.parentElemet, 'modal-animate');


    setTimeout(()=>{
      this.renderer.removeClass(this.parentElemet, 'modal-animate');
      if(role=='pay'){
        this.renderer.addClass(this.parentElemet, 'modal-show-right');
        this.renderer.addClass(this.paymodal, 'modal-pay')
      }else{
        this.renderer.addClass(this.parentElemet, 'modal-show');
      }
    },0)

  }




}
