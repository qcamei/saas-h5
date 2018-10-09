import {Directive, OnInit, ElementRef} from "@angular/core";

// <div blinkSecond [attr.data-new]="true">新建闪动</div>

@Directive({
  selector: '[blinkSecond]'
})
export class BlinkSecondDirective implements OnInit {

  constructor(private el: ElementRef) {

  }

  ngOnInit() {
    let timer = setInterval(()=>{
      this.blink()
    },400)
    setTimeout(()=>{
      clearInterval(timer)
    },3000);

  }

  private blink(){
    let bgc = this.el.nativeElement.style.color;
    if(this.el.nativeElement.dataset["new"]=="true"){
      if(bgc==='rgb(33, 37, 41)'){
        this.el.nativeElement.style.color = '#4678fa'
      }else{
        this.el.nativeElement.style.color = '#212529'
      }
    }

  }

}
