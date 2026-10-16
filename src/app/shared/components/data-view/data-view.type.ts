export interface DataViewModel {
  key: number | string;
  label: string;
  value: string | number | Date | (() => string);
}

export type DataViewModels = DataViewModel[];