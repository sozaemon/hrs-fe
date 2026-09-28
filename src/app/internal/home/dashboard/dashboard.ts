import { Component } from "@angular/core";
import { NzAvatarModule } from "ng-zorro-antd/avatar";
import { NzBreadCrumbModule } from "ng-zorro-antd/breadcrumb";
import { NzCardModule } from "ng-zorro-antd/card";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzStatisticModule } from "ng-zorro-antd/statistic";

@Component({
  imports: [
    NzCardModule,
    NzBreadCrumbModule,
    NzStatisticModule,
    NzIconModule,
    NzAvatarModule,
  ],
  templateUrl: "./dashboard.html",
  styleUrl: "./dashboard.css",
})
export class Dashboard {

}