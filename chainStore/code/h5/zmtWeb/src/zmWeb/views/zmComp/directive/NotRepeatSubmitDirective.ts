import {Directive, OnInit, HostListener, Output, EventEmitter} from "@angular/core";
import {Subject, Subscription} from "rxjs";
import {debounceTime} from "rxjs/operators/debounceTime";
import {AppUtils} from "../../../comModule/AppUtils";

@Directive({
  selector: '[notRepeatSubmit]'
})
export class NotRepeatSubmitDirective implements OnInit {

  @Output() submit = new EventEmitter();

  private clicks = new Subject();//观察者
  private subscription: Subscription;//订阅者
  private delayTime = 800;//延迟时间

  constructor() { }

  //处理最后一次操作
  ngOnInit() {
    this.subscription = this.clicks.pipe(
      debounceTime(this.delayTime)
    ).subscribe(e => this.submit.emit(e));
  }

  ngOnDestroy() {
    if (!AppUtils.isNullObj(this.subscription)) {
      this.subscription.unsubscribe();
    }
  }

  //拦截click事件
  @HostListener('click', ['$event'])
  clickEvent(event) {
    event.preventDefault();
    event.stopPropagation();
    this.clicks.next(event);
  }
}
