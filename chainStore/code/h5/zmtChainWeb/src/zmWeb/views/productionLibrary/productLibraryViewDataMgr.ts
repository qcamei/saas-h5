

import {Injectable} from "@angular/core";
import {Subject, BehaviorSubject, Subscription} from "rxjs";
import {LibraryListViewData} from "./libraryList/libraryListViewData";


@Injectable()
export class ProductLibraryViewDataMgr {


  private libraryListVDS: Subject<LibraryListViewData> = new BehaviorSubject<LibraryListViewData>(null);//观察者对象

  public setLibraryListViewData(libraryListViewData: LibraryListViewData): void {
    this.libraryListVDS.next(libraryListViewData);
  }

  public subscribeLibraryListViewData(func: (viewData: LibraryListViewData) => void): Subscription { //接受者
    return this.libraryListVDS.subscribe(func);
  }
}

