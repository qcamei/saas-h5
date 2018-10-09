import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatIconModule, MatMenuModule, MatProgressBarModule, MatToolbarModule } from '@angular/material';

import { FuseSharedModule } from '../../../../@fuse/shared.module';
import {ToolbarComponent} from "./toolbar.component";
import {FuseSearchBarModule} from "../../../../@fuse/components/search-bar/search-bar.module";
import {FuseShortcutsModule} from "../../../../@fuse/components/shortcuts/shortcuts.module";


@NgModule({
    declarations: [
        ToolbarComponent
    ],
    imports     : [
        RouterModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatProgressBarModule,
        MatToolbarModule,

        FuseSharedModule,
        FuseSearchBarModule,
        FuseShortcutsModule
    ],
    exports     : [
        ToolbarComponent
    ]
})
export class ToolbarModule
{
}
