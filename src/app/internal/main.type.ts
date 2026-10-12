import { Type } from "@angular/core";

export interface AppTab {
  name: string;
  component: Type<unknown>;
  active: boolean;
  key: string;
  url: string;
}