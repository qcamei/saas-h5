import { Component,Input,} from "@angular/core";

@Component({
  selector:'zm-page-header',
  template:
  `
    <ion-header>
      <ion-navbar>
        <ion-title>
          <strong>{{title}}</strong>
        </ion-title>
      </ion-navbar>
    </ion-header>
   `,
styles:[`

`]
})
export class PageHeader{
    @Input() title:string;
    constructor(){}

}
