import { Component,ElementRef,ViewChild,OnInit,AfterViewInit,Renderer,Input,Output,EventEmitter,OnChanges} from "@angular/core";

@Component({
  selector:'switch-button-comp',
  template:
  ` 
	<div class="switch disFlex align-center" (click)="changeOpts()">
	    <span class="slideBtn" #slideBtn  [class.form-valid-leftbtn]="leftBtn"  [class.form-valid-rightbtn]="rightBtn"></span>
	</div>
   `,
   styles:[
   `
	.switch {
	  width: 4rem;
	  height: 1.75rem;
	  background: #dadfe6;
	  border-radius: 1.75rem;
	  cursor: pointer;
	}
	.slideBtn{
      display: block;
	    height: 1.5rem;
	    width: 1.5rem;
	    border-radius: 50%;
	    box-shadow: 0 0 0.25rem 0 rgba(164, 171, 179, 0.4);
	}
  .form-valid-rightbtn{
    margin-left:38px;
    background-color: #0f88de;
    transition: all 0.3s;
  }
  .form-valid-leftbtn{
    margin-left:0.1rem;
    background-color: #fff;
    transition: all 0.3s;
  }
   `
   ]
})
export class SwitchButton {

	@Input() state:boolean = true;
	@Output() stateChange = new EventEmitter();
	public leftBtn:boolean;
  public rightBtn:boolean;
	// constructor(private renderer: Renderer){
    //
	// }
	@ViewChild("slideBtn") slideBtn: ElementRef;
    changeOpts():void{
    	if(this.state){
    		this.move('left');
    	}else{
    		this.move('right');
    	}
    }
    move(direction:string){
      let $ele = this.slideBtn.nativeElement;
    	if(direction === 'left'){
    	  this.rightBtn = true;
        this.leftBtn = false;
        this.stateChange.emit(false);
    	}else{
        this.rightBtn = false;
        this.leftBtn = true;
        this.stateChange.emit(true);
    	}
    }
    ngOnInit():void{
    	if(this.state){
        this.move('left');
    	}else{
        this.move('right');
      }
    }

    ngOnChanges(){
      if(this.state){
        let $ele = this.slideBtn.nativeElement;
        this.rightBtn = true;
        this.leftBtn = false;
      }else{
        let $ele = this.slideBtn.nativeElement;
        this.rightBtn = false;
        this.leftBtn = true;
      }
    }
}
