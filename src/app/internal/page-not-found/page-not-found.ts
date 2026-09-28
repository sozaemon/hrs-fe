import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzIconModule } from "ng-zorro-antd/icon";

@Component({
  imports: [NzButtonModule, NzIconModule],
  templateUrl: "./page-not-found.html",
  styleUrl: "./page-not-found.css"
})
export class Page404 {
  private readonly router = inject(Router);

  returnToHome(): void {
    this.router.navigateByUrl("/home")
  }
}