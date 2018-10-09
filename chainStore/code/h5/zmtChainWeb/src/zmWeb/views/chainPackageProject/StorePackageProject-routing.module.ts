import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import {PackageListComp} from "./packageProject/packageList/packageList";
import {AddPackageComp} from "./packageProject/addPackage/addPackage";
import {PackageDetailComp} from "./packageProject/packageDetail/packageDetail";
import {EditPackageComp} from "./packageProject/editPackage/editPackage";
import {PackageTypeListComp} from "./packageType/packageTypeList";
import {PackageListResolve} from "../../comModule/guard/listResolve/PackageListResolve";

const routes:Routes = [
  {
    path:"packageList",
    resolve:{todos:PackageListResolve},
    component:PackageListComp
  },
  {
    path:"addPackage",
    component:AddPackageComp
  },
  {
    path:"editPackage/:id",
    component:EditPackageComp
  },
  {
    path:"packageDetail/:id",
    component:PackageDetailComp
  },
  {
    path:"packageType",
    component:PackageTypeListComp
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
export class ChainPackageProjectRoutingModule { }
