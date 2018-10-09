import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { LibraryListPage } from './libraryList/libraryList';


const routes:Routes = [
  {
    path:"libraryList",
    component:LibraryListPage
  },


]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
  ]
})
export class ProductionLibraryRoutingModule { }
