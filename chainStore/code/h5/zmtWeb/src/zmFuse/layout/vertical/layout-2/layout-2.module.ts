import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {VerticalLayout2Component} from "./layout-2.component";
import {FuseSharedModule} from "../../../../@fuse/shared.module";
import {FuseSidebarModule} from "../../../../@fuse/components/sidebar/sidebar.module";
import {ContentModule} from "../../components/content/content.module";
import {FooterModule} from "../../components/footer/footer.module";
import {NavbarModule} from "../../components/navbar/navbar.module";
import {QuickPanelModule} from "../../components/quick-panel/quick-panel.module";
import {ToolbarModule} from "../../components/toolbar/toolbar.module";


@NgModule({
    declarations: [
        VerticalLayout2Component
    ],
    imports     : [
        RouterModule,

        FuseSharedModule,
        FuseSidebarModule,

        ContentModule,
        FooterModule,
        NavbarModule,
        QuickPanelModule,
        ToolbarModule
    ],
    exports     : [
        VerticalLayout2Component
    ]
})
export class VerticalLayout2Module
{
}
