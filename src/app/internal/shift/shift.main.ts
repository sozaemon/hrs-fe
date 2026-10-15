import { Component } from "@angular/core";
import { NzLayoutComponent, NzContentComponent } from "ng-zorro-antd/layout";
import { RouterOutlet } from "@angular/router";

@Component({
  template: `<nz-layout>
               <nz-content>
                <router-outlet />
                </nz-content>
            </nz-layout>`,
  imports: [NzLayoutComponent, NzContentComponent, RouterOutlet]
})
export class ShiftMain { }