import {Directive, OnInit, ElementRef} from "@angular/core";

//<div secondDisapper>2s后消失</div>
@Directive({
  selector: '[secondDisapper]'
})
export class SecondDisapperDirective implements OnInit {

  constructor(el: ElementRef) {
    setTimeout(()=>{
      el.nativeElement.style.display = 'none';
    },2000)
  }

  ngOnInit() {

  }

}
