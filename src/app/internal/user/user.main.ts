import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NzContentComponent, NzLayoutComponent } from "ng-zorro-antd/layout";

@Component({
  template: `<nz-layout>
               <nz-content>
                <router-outlet />
                </nz-content>
            </nz-layout>`,
  imports: [NzLayoutComponent, NzContentComponent, RouterOutlet]
})
export class UserMain { }
