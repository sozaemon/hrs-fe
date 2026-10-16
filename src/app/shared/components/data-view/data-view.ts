import { Component, input } from "@angular/core";
import { NgStyle } from "@angular/common";
import { DataViewModels } from "./data-view.type";
import { NzCardModule } from 'ng-zorro-antd/card';

@Component({
  selector: "data-view",
  templateUrl: "./data-view.html",
  imports: [NzCardModule, NgStyle]
})
export class DataView {
  public readonly viewModels = input<DataViewModels>([]);
  public readonly columnSize = input<number>(1);

  getStyle() {
    return {
      display: "grid",
      "grid-template-columns": `repeat(${this.columnSize()}, 1fr)`,
      'justify-items': 'left',
      margin: "5px"
    }
  }
}

//  public getStyles() {
//   return {
//     display: 'grid',
//     'grid-template-columns': `repeat(${this.columns}, 1fr)`,
//     'justify-items': 'center',
//   };
// }