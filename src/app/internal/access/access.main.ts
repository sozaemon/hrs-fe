import { Component } from "@angular/core";
import { NzLayoutComponent, NzLayoutModule } from "ng-zorro-antd/layout";
import { RouterOutlet } from "@angular/router";
import { NzCardModule } from "ng-zorro-antd/card";
import { NzButtonModule } from "ng-zorro-antd/button";

@Component({
  imports: [NzCardModule, NzButtonModule, NzLayoutComponent, NzLayoutModule, RouterOutlet],
  templateUrl: "./template/access.html",
  styleUrl: "./css/access.css",
})
export class AccessMain {

}
