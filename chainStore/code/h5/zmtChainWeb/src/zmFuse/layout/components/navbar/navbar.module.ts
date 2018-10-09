import { NgModule } from '@angular/core';
import { MatButtonModule, MatIconModule } from '@angular/material';

import { FuseSharedModule } from '../../../../@fuse/shared.module';
import {NavbarComponent} from "./navbar.component";
import {FuseNavigationModule} from "../../../../@fuse/components/navigation/navigation.module";


@NgModule({
    declarations: [
        NavbarComponent
    ],
    imports     : [
        MatButtonModule,
        MatIconModule,

        FuseSharedModule,
        FuseNavigationModule
    ],
    exports     : [
        NavbarComponent
    ]
})
export class NavbarModule
{
}
