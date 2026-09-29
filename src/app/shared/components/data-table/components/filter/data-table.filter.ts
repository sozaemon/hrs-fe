import { Component, computed, inject, input, OnInit, output, signal } from "@angular/core";
import { ColumnDefinition, ColumnDefinitions } from "@app/shared/components/data-table/types/data-table.types";
import { FilterRequest, LogicalOperator, ValidValue } from "@app/shared/components/data-table/types/filter-request.types";
import { NzSelectModule } from "ng-zorro-antd/select";
import { NzInputModule } from "ng-zorro-antd/input";
import { FormsModule } from "@angular/forms";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDatePickerModule } from "ng-zorro-antd/date-picker";
import { NzMessageService } from "ng-zorro-antd/message";
import { format } from 'date-fns';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { FilterDefinitions } from "./type/data-table-filter.type";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzTooltipModule } from "ng-zorro-antd/tooltip";


interface CommonOption {
  value: string;
  label: string;
}

type DisplayOption = "single-string" | "single-number" | "single-date" | "double-number" | "double-date";
@Component({
  selector: "data-table-filter",
  templateUrl: "./template/data-table.filter.html",
  styleUrl: "./css/data-table.filter.css",
  imports: [
    FormsModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule,
    NzTagModule,
    NzDatePickerModule,
    NzModalModule,
    NzIconModule,
    NzTooltipModule,
  ]
})
export class DataTableFilterComponent implements OnInit {

  readonly message = inject(NzMessageService);

  readonly filterDefinition = input.required<FilterDefinitions>();

  private readonly _filters = signal<{ [key: string]: FilterRequest }>({});

  public filters = output<FilterRequest[]>();

  public filterAbleColumnDef = signal<CommonOption[]>([]);

  public field = signal<string>("");
  public operator = signal<LogicalOperator | undefined>(undefined);

  public value = signal<ValidValue | undefined>(undefined);
  public timeValue = signal<Date | undefined>(undefined);

  public value2 = signal<ValidValue | undefined>(undefined);
  public timeValue2 = signal<Date | undefined>(undefined);

  public readonly displayFilterModal = signal<boolean>(false);

  public readonly valueOptions = signal<CommonOption[]>([]);
  public readonly valueOptions2 = signal<CommonOption[]>([]);

  public readonly operators = signal<CommonOption[]>([]);

  public readonly filterMode = computed<DisplayOption>(() => {
    const columnDef = this.retrieveSelectedColumnDef();
    if (columnDef == null) {
      return "single-string";
    }
    return this.resolveFilterMode(columnDef.filterOptions?.fieldType);
  })

  private resolveFilterMode(fieldType?: "string" | "number" | "date"): DisplayOption {
    const isBetween = this.operator() === "BETWEEN";

    if (fieldType === "number") {
      return isBetween ? "double-number" : "single-number";
    }
    if (fieldType === "date") {
      return isBetween ? "double-date" : "single-date";
    }
    return "single-string";
  }

  public operatorsModel: { [key: string]: { value: LogicalOperator, label: string } } = {
    "EQ": { value: "EQ", label: "Equal" },
    "NEQ": { value: "NEQ", label: "Not Equal" },
    "LIKE": { value: "LIKE", label: "Like" },
    "NOT": { value: "NOT", label: "Not Equal" },
    "NOTNULL": { value: "NOTNULL", label: "Not Empty" },
    "GT": { value: "GT", label: "Grater Then" },
    "LT": { value: "LT", label: "Less Than" },
    "BETWEEN": { value: "BETWEEN", label: "Between" },
  };

  ngOnInit(): void {
    let filterableColumnDefs: CommonOption[] = this.filterDefinition()
      .filter(f => f.allowFilter && f.filterOptions)
      .map((m) => {
        return {
          value: m.field,
          label: m.header
        }
      });
    this.filterAbleColumnDef.set(filterableColumnDefs);
  }

  public collectedFilters(): FilterRequest[] {
    let result: FilterRequest[] = [];

    for (const [k, v] of Object.entries(this._filters())) {
      if (k) {
        result.push(v);
      }
    }
    return result;
  }

  public addFilter(): void {

    const columnDef: ColumnDefinition<any> | null = this.retrieveSelectedColumnDef();

    if (columnDef != null) {

      const request = this.buildFilter(columnDef);
      if (request == null) {
        return;
      }

      this._filters.update((f) => {
        f[this.field()] = request;
        return f;
      })
    }

    this.displayFilterModal.set(false);

  }

  private buildFilter(columnDef: ColumnDefinition<any>): FilterRequest | null {

    if (!this.operator()) {
      this.message.warning("please select operator");
      return null;
    }

    let request: FilterRequest = {
      label: columnDef.header,
      fieldName: this.field(),
      operator: this.operator() as LogicalOperator,
      joinOperator: "AND"
    }

    switch (this.filterMode()) {
      case "single-string":
      case "single-number":
        if (this.operator() === "NOTNULL") {
          break;
        }
        if (this.value() == null || this.value() === "") {
          this.message.warning("please input value");
          return null;
        }
        request["value"] = this.value();
        break;
      case "double-number":
        if (this.value() == null || this.value2() == null || this.value() === "" || this.value2() === "") {
          this.message.warning("please input values");
          return null;
        }
        request["values"] = [this.value() as ValidValue, this.value2() as ValidValue];
        break;
      case "single-date":
        if (this.operator() === "NOTNULL") {
          break;
        }
        if (!this.timeValue()) {
          this.message.warning("please select date");
          return null;
        }
        request["timeValue"] = format(this.timeValue() as Date, "yyyy-MM-dd HH:mm");
        break;
      case "double-date":
        if (!this.timeValue() || !this.timeValue2()) {
          this.message.warning("please select dates");
          return null;
        }
        request["timeValues"] = [
          format(this.timeValue() as Date, "yyyy-MM-dd HH:mm"),
          format(this.timeValue2() as Date, "yyyy-MM-dd HH:mm")
        ]
        break;
    }

    return request;
  }

  public removeFilter(filter: FilterRequest): void {
    this._filters.update((f) => {
      delete f[filter.fieldName];
      return f;
    })
  }

  public clearFilter(): void {
    this._filters.set({});
  }

  public onFieldModelChange(): void {
    const columnDef: ColumnDefinition<any> | null = this.retrieveSelectedColumnDef();

    if (columnDef != null) {
      const valueOptions = columnDef.filterOptions?.filterValueOptions ?? [];

      if (valueOptions.length > 0) {
        const valueOpt = valueOptions.map((m) => {
          return {
            value: m,
            label: m
          };
        });
        this.valueOptions.set(valueOpt);
      } else {
        this.valueOptions.set([]);
      }
    }

    this.value.set(undefined);
    this.value2.set(undefined);
    this.timeValue.set(undefined);
    this.timeValue2.set(undefined);

    this.operator.set(undefined);

    this.updatedOperators();
  }

  private retrieveSelectedColumnDef(): ColumnDefinition<any> | null {
    const selectedColumnDef: ColumnDefinitions<any> = this.filterDefinition().filter((f) => f.field == this.field());

    if (selectedColumnDef.length > 0) {
      return selectedColumnDef[0];
    }
    return null;
  }

  private updatedOperators(): void {

    const columnDef: ColumnDefinition<any> | null = this.retrieveSelectedColumnDef();

    let result: CommonOption[] = [];
    if (columnDef != null) {

      if (columnDef.filterOptions) {

        if (columnDef.filterOptions.filterValueOptions?.length) {
          result = [
            this.operatorsModel["EQ"],
            this.operatorsModel["NEQ"],
          ];
        } else {
          switch (columnDef.filterOptions?.fieldType) {
            case "string":
              result = [
                this.operatorsModel["EQ"],
                this.operatorsModel["NEQ"],
                this.operatorsModel["LIKE"],
                this.operatorsModel["NOT"],
                this.operatorsModel["NOTNULL"],
              ];
              break;
            case "date":
            case "number":
              result = [
                this.operatorsModel["EQ"],
                this.operatorsModel["NEQ"],
                this.operatorsModel["GT"],
                this.operatorsModel["LT"],
                this.operatorsModel["NOT"],
                this.operatorsModel["NOTNULL"],
                this.operatorsModel["BETWEEN"],
              ];
              break;
          }
        }

      }
    }
    this.operators.set(result);
  }

  public applyFilter(): void {
    const filters = this.collectedFilters();
    this.filters.emit(filters);
  }

  public resolveFilterTag(filter: FilterRequest): string {

    let selectedValue: ValidValue = "";

    if (filter.value) {
      selectedValue = filter.value;
    }
    if (filter.values && filter.values.length > 1) {
      selectedValue = `${filter.values[0]} - ${filter.values[1]}`;
    }
    if (filter.timeValue) {
      selectedValue = filter.timeValue;
    }
    if (filter.timeValues && filter.timeValues.length > 1) {
      selectedValue = `${filter.timeValues[0]} - ${filter.timeValues[1]}`;
    }
    return `${filter.label} ${this.operatorsModel[filter.operator].label} ${selectedValue}`;
  }

  public displayFilter(): void {
    this.displayFilterModal.set(true);
  }

  public closeFilterModal(): void {
    this.displayFilterModal.set(false);
  }
}
