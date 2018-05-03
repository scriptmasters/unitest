import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { GroupsComponent } from "./groups.component";

const routes: Routes = [
  {
    path: "",
    component: GroupsComponent,
    data: {
      breadcrumb: "Групи"
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupsRoutingModule {}
