import {Component, EventEmitter, Input, Output} from "@angular/core";

@Component({
  selector: "zm-drop-down-menu",
  template: `
    <button mat-raised-button [matMenuTriggerFor]="zmMenu">{{menuName}}</button>
    <mat-menu #zmMenu="matMenu" [overlapTrigger]="false">
      <button mat-menu-item (click)="changePayType(i)" *ngFor="let menuItem of menuItems; let i = index">
        {{menuItem}}
      </button>
    </mat-menu>
  `,
  styles: []
})
export class ZmDropDownMenu {
  @Input()
  menuName: string;
  @Input()
  menuItems: Array<string>;

  @Output() onMenuClick: EventEmitter<any> = new EventEmitter();

  constructor() {

  }


  changePayType(index) {
    this.onMenuClick.emit(index)
  }
}
