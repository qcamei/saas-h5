import { NgModule } from '@angular/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule, MatIconModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';

import { FuseModule } from '../../@fuse/fuse.module';
import { FuseSharedModule } from '../../@fuse/shared.module';

import { LayoutModule } from '../layout/layout.module';
import {ZmLayoutComp} from "./zmLayout.comp";
import {FuseSidebarModule} from "../../@fuse/components/sidebar/sidebar.module";
import {FuseThemeOptionsModule} from "../../@fuse/components/theme-options/theme-options.module";
import {FuseConfig} from "../../@fuse/types/fuse-config";


export const fuseConfig: FuseConfig = {
    layout          : {
        style         : 'vertical-layout-1',
        width         : 'fullwidth',
        navbar        : {
            hidden    : false,
            position  : 'left',
            folded    : false,
            background: 'mat-fuse-dark-700-bg'
        },
        toolbar       : {
            hidden    : false,
            position  : 'below-static',
            background: 'mat-white-500-bg'
        },
        footer        : {
            hidden    : true,
            position  : 'below-static',
            background: 'mat-fuse-dark-900-bg'
        }
    },
    customScrollbars: true
};


@NgModule({
    declarations: [
        ZmLayoutComp,
    ],
    imports     : [

        TranslateModule.forRoot(),

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        // App modules
        LayoutModule,
    ],
    exports:[
        ZmLayoutComp
    ]
})
export class ZmLayoutModule
{
}

