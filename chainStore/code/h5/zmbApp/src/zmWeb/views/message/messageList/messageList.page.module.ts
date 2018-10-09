import {ZmInputModule} from "../../zmComp/form/zmInput.module";
import {ZmBsCompModule} from "../../zmBSComp/zmBSComp.module";
import {ZmCompModule} from "../../zmComp/zmComp.module";
import {IonicPageModule} from "ionic-angular";
import {NgModule} from "@angular/core";
import {MessageListPage} from "./messageList.page";

@NgModule({
  declarations: [
    MessageListPage,
  ],

  imports: [
    IonicPageModule.forChild(MessageListPage),
    ZmCompModule,
    ZmInputModule,
    ZmBsCompModule,
  ],
  providers:[

  ]


})
export class MessageListPageModule {}
