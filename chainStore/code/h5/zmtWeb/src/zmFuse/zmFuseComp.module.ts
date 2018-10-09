import { NgModule } from '@angular/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import {
  MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatToolbarModule,
  MatChipsModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatButtonToggleModule, MatTableModule,
  MatDialogModule, MatDialog, MatExpansionModule, MatPaginatorModule, MatPaginatorIntl, MatCheckboxModule,
  MatTabsModule, MatRadioModule, MatAutocompleteModule, MatListModule, MatSlideToggleModule, MatTooltipModule, MatProgressSpinnerModule
} from '@angular/material';
import 'hammerjs';
import {FuseSharedModule} from "../@fuse/shared.module";
import {FlexLayoutModule} from "@angular/flex-layout";
import {ZmMatPaginatorIntl} from "../zmWeb/views/zmComp/pagination/ZmMatPaginatorIntl";



@NgModule({
    declarations: [
    ],
    imports     : [
      // Fuse modules
      FuseSharedModule,
      FlexLayoutModule,
      // Material moment date module
      MatMomentDateModule,

      // Material
      MatIconModule,
      MatFormFieldModule,
      MatInputModule,
      MatToolbarModule,
      MatButtonModule,
      MatChipsModule,
      MatSelectModule,
      MatDatepickerModule,
      MatNativeDateModule,
      MatButtonToggleModule,
      MatTableModule,
      MatDialogModule,
      MatExpansionModule,
      MatPaginatorModule,
      MatCheckboxModule,
      MatTabsModule,
      MatRadioModule,
      MatAutocompleteModule,
      MatListModule,
      MatSlideToggleModule,

      MatProgressSpinnerModule
    ],
    exports:[
      // Fuse modules
      FuseSharedModule,
      FlexLayoutModule,
      // Material moment date module
      MatMomentDateModule,

      // Material
      MatIconModule,
      MatFormFieldModule,
      MatInputModule,
      MatToolbarModule,
      MatButtonModule,
      MatChipsModule,
      MatSelectModule,
      MatDatepickerModule,
      MatNativeDateModule,
      MatButtonToggleModule,
      MatTableModule,
      MatDialogModule,
      MatExpansionModule,
      MatPaginatorModule,
      MatCheckboxModule,
      MatTabsModule,
      MatRadioModule,
      MatRadioModule,
      MatAutocompleteModule,
      MatListModule,
      MatSlideToggleModule,
      MatTooltipModule,

      MatProgressSpinnerModule
    ],
    providers: [{ provide: MatPaginatorIntl, useClass: ZmMatPaginatorIntl}],
})
export class ZmFuseCompModule
{
  constructor(  matDialog: MatDialog){
    // ZmModalMgr.getInstance().init(matDialog);
  }

}

