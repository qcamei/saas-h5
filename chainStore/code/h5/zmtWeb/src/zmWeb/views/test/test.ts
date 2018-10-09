 import {Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy} from "@angular/core";
 import {MatIconRegistry} from "@angular/material";
 import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector:'user-detail',
  template: `
    
 
   <!-- <mat-icon [svgIcon]="name">{{name}}</mat-icon>-->
    <h1>6555</h1>
  `,
  changeDetection:ChangeDetectionStrategy.OnPush

})
export class TestPage implements OnInit,OnDestroy {

  name:string = "icon-project";


  constructor(  private iconRegistry: MatIconRegistry,
                private sanitizer: DomSanitizer) {

    let url = "assets/images/sideBarSvg/icon-project.svg";
    this.iconRegistry.addSvgIcon(name,this.sanitizer.bypassSecurityTrustResourceUrl(url));
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }


}
