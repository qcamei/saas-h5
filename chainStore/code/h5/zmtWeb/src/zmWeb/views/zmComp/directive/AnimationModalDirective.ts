

import {Component, OnInit, OnDestroy, Input, ViewEncapsulation,ElementRef, Renderer2} from "@angular/core";

/**
 * 
 *  * <zmAnimation [toRight]="true"></zmAnimation>
 *  
 */
@Component({
  selector:'zmAnimation',
  template: `
    <div>
        <ng-content>

        </ng-content>    
    </div>
            `,
  styles:[`
  /* 动画样式 */


   /*样式类*/ 
  .fromTop{
    animation:fromTop 0.8s;
    animation-timing-function:cubic-bezier(.29,0,.90,1.91);
  }
  .fromLeft{
    animation:fromLeft 0.8s;
    animation-timing-function:cubic-bezier(.29,0,.90,1.91);
  }
  .fromBottom{
    animation:fromBottom 0.8s;
    animation-timing-function:cubic-bezier(.29,0,.90,1.91);
  }
  .fromRight{
    animation:fromRight 0.8s;
    animation-timing-function:cubic-bezier(.29,0,.90,1.91);
  }

  /* 动画帧*/

  /* 上 */
  @keyframes fromTop
  {
    from {transform: translateY(-100px); opacity: 0; }
    to {transform: translateY(0px); opacity: 1;}
  }
  /* 左 */
  @keyframes fromRight
  {
    from {transform: translateX(400px); opacity: 0; }
    to {transform: translateX(0px); opacity: 1;}
  }  
  /* 下 */
  @keyframes fromBottom
  {
    from {transform: translateY(100px); opacity: 0; }
    to {transform: translateY(0px); opacity: 1;}
  }
  /* 右 */
  @keyframes fromLeft
  {
    from {transform: translateX(-400px); opacity: 0; }
    to {transform: translateX(0px); opacity: 1;}
  }  

/* 动画样式结束 */
  
  `],
  encapsulation: ViewEncapsulation.None,
})
export class AnimationModalDirective implements OnInit,OnDestroy {
  public firstElementChild:ElementRef;
  @Input() toRight:boolean=false;
  @Input() toLeft:boolean=false;
  @Input() toTop:boolean=false;
  @Input() toBottom:boolean=false;


  constructor(public el: ElementRef,public renderer:Renderer2) {

  }
  ngOnInit():void{

      this.firstElementChild = this.el.nativeElement.firstElementChild;//必须查找当前下一个子节点

      if(this.toRight){
        this.renderer.addClass(this.firstElementChild, 'fromRight');
      }else if(this.toLeft){
        this.renderer.addClass(this.firstElementChild, 'fromLeft');
      }else if(this.toTop){
        this.renderer.addClass(this.firstElementChild, 'fromTop');
      }else if(this.toBottom){
        this.renderer.addClass(this.firstElementChild, 'fromBottom');
      }
  }

  ngOnDestroy(): void {

  }
}




