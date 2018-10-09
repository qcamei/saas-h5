import {Component, OnDestroy, OnInit, ViewEncapsulation, Input, Output, EventEmitter} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfigService } from '../../../../@fuse/services/config.service';
import {MainViewData} from "../../../../zmWeb/views/main/MainViewData";

@Component({
    selector     : 'vertical-layout-1',
    templateUrl  : 'layout-1.component.html',
    styleUrls    : ['layout-1.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class VerticalLayout1Component implements OnInit, OnDestroy
{
    fuseConfig: any;

    // Private
    private _unsubscribeAll: Subject<any>;


    @Input() data:MainViewData;
    //输出 切换店铺回调
    @Output() toggleStoreCallback = new EventEmitter();
    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     */
    constructor(
        private _fuseConfigService: FuseConfigService
    )
    {

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Subscribe to config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config) => {
                this.fuseConfig = config;
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

  /**
   * 切换店铺 页面点击事件
   */
  toogleStore(event){
    this.toggleStoreCallback.emit(event);
  }
}
