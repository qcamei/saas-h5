import {Component, OnInit, OnDestroy, ChangeDetectionStrategy} from "@angular/core";

/**
 * 首页
 */
@Component({
  templateUrl: 'home.html',
  styleUrls: ['home.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class HomePage implements OnInit,OnDestroy {

  private service: HomeService;
  public viewData: HomeViewData = new HomeViewData();


  constructor(){
    this.service = new HomeService();
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {

  }




}

export class HomeViewData {

}

export class HomeService {
  constructor() {
  }

}

