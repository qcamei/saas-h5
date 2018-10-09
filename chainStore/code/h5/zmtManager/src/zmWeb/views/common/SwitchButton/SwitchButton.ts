import { Component,ElementRef,ViewChild,Renderer,Input,Output,EventEmitter} from "@angular/core";

@Component({
  selector:'switch-button-comp',
  template:
  ` 
	<div class="switch disFlex align-center" (click)="changeOpts()" [class.form-valid-rightbtn]="rightBtn">
	    <span class="slideBtn" #slideBtn  [class.form-valid-leftbtn]="leftBtn"  ></span>
	</div>
   `,
   styles:[
   `
	 .disFlex {
    display: -webkit-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: -moz-box;
    display: flex;
  }
  .align-center {
    -webkit-box-align: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    -moz-box-align: center;
    align-items: center;
  }

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
      margin-left:38px;
      background-color: #fff;
     transition: all 0.3s;
	}
  .form-valid-rightbtn{
    background-color: #4678fa;
    transition: all 0.3s;
    -ms-transition: all 0.3s;
    -webkit-transition: all 0.3s;
    
  }
  .form-valid-leftbtn{
    margin-left:0.1rem;
    background-color: #fff;
    transition: all 0.3s;
    -ms-transition: all 0.3s;
    -webkit-transition: all 0.3s
  }
   `
   ]
})
export class SwitchButton {
	@Input() state:boolean = true;
	@Output() stateChange = new EventEmitter();
	public leftBtn:boolean;
  public rightBtn:boolean;

	constructor(private renderer: Renderer){

	}
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
        let $ele = this.slideBtn.nativeElement;
        this.rightBtn = true;
        this.leftBtn = false;
      }else{
        let $ele = this.slideBtn.nativeElement;
        this.rightBtn = false;
        this.leftBtn = true;
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
