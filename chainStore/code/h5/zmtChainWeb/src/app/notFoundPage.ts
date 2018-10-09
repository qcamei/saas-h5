import {Component, OnInit, OnDestroy} from "@angular/core";

@Component({
  selector: 'not-found',
  template: '<h2>Page not found</h2>',
})
export class NotFoundPage implements OnInit,OnDestroy{

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {

  }
}
