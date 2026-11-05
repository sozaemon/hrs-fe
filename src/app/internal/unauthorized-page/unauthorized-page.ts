import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzCardModule } from "ng-zorro-antd/card";

@Component({
  templateUrl: "./unauthorized-page.html",
  imports: [NzCardModule, NzButtonModule]
})
export class Page401 {
  private readonly router = inject(Router);

  returnToHome(): void {
    this.router.navigateByUrl("/app/home")
  }
}