import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzLayoutComponent, NzLayoutModule } from 'ng-zorro-antd/layout';

@Component({
  imports: [NzCardModule, NzButtonModule, NzLayoutComponent, NzLayoutModule, RouterOutlet],
  templateUrl: './template/home.html',
  styleUrl: './css/home.css',
})
export class Home {

}
