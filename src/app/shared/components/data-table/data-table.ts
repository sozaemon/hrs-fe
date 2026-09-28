import { Component, input, OnInit, output, signal } from "@angular/core";
import {
  NzTableModule,
  NzTableQueryParams,
  NzTableSortOrder,
} from "ng-zorro-antd/table";
import { RecordType } from "./types/pagination-response";
import { FilterRequest } from "./types/filter-request.types"
import { ColumnAction, ColumnDefinition, ColumnDefinitions, DataTableFilter, DataTableQuery, DataTableSort, RowAction } from "./types/data-table.types";
import { DataTableFilterComponent } from "@app/shared/components/data-table/components/filter/data-table.filter"
import { NzSpaceCompactComponent } from "ng-zorro-antd/space";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzButtonModule } from "ng-zorro-antd/button";

@Component({
  imports: [
    NzTableModule,
    DataTableFilterComponent,
    NzSpaceCompactComponent,
    NzButtonModule,
    NzIconModule],
  selector: "data-table",
  templateUrl: "./template/data-table.html",
  styleUrl: "./css/data-table.css"
})
export class DataTable<T extends Record<string, RecordType>> implements OnInit {

  public readonly columnDefinition = input.required<ColumnDefinitions<T>>();
  public readonly data = input.required<T[]>();
  public readonly totalRecords = input.required<number>();
  public readonly pageSize = input<number>(10);
  public readonly page = input<number>(1);
  public readonly loading = input<boolean>(false);
  public readonly showPagination = input<boolean>(true);
  public readonly allowRowSelect = input<boolean>(false);
  public readonly rowKey = input<number | string>("id");
  public readonly useRowsCheckbox = input<boolean>(false);
  public readonly actions = input<ColumnAction[]>([]);

  public readonly clDefinition = signal<ColumnDefinitions<any>>([]);


  public currentPage = output<number>();
  public selectedRow = output<T[]>();
  public sort = output<DataTableSort<T> | null>();
  public filter = output<DataTableFilter[]>();
  public queryChange = output<DataTableQuery<T>>();
  public doAction = output<RowAction<T>>()

  private readonly _selectedRows = signal<T[]>([]);

  private readonly appliedFilter = signal<FilterRequest[]>([]);

  ngOnInit(): void {
    this.clDefinition.set(this.columnDefinition() as ColumnDefinitions<any>);
  }

  anyDataIsChecked(): boolean {
    return this._selectedRows().length > 0;
  }

  allDataIsChecked(): boolean {
    const rows = this.data();
    return rows.length > 0 && rows.every((row) => this.rowContainSelectedRow(row));
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const activeSort = params.sort
      .find((sort) => sort.value !== null);

    let sort: DataTableSort<T> | undefined = undefined;

    if (activeSort != null) {
      const sortOrder: "ASC" | "DESC" = activeSort.value as Exclude<NzTableSortOrder, null> === "ascend" ? "ASC" : "DESC";
      sort = {
        field: activeSort.key as keyof T & string,
        order: sortOrder
      }
    }

    this.queryChange.emit({
      pageIndex: params.pageIndex,
      pageSize: params.pageSize,
      sort,
      filters: this.appliedFilter(),
    });
  }

  onSearch(searchValue: Record<string, unknown>): void {
    const keys = Object.keys(searchValue) as string[];

    for (const key in keys) {
      const columnDefs: ColumnDefinition<T>[] = this.columnDefinition().filter((f) => f.field === key)
      if (columnDefs.length <= 0) {
        continue;
      }
      // determine filter type base on key yang column def configuration

    }
  }
  onAllRowsChecked(checked: boolean): void {
    const selectedRows = checked
      ? [...this._selectedRows(), ...this.data().filter((row) => !this.rowContainSelectedRow(row))]
      : this._selectedRows().filter((row) => !this.data().some((currentRow) => this.sameRow(row, currentRow)));

    this._selectedRows.set(selectedRows);
    this.updateSelectedRows();
  }

  onRowClick(row: T): void {
    if (this.rowSelectionEnabled()) {
      const dataIndex = this._selectedRows().findIndex((selectedRow) => this.sameRow(selectedRow, row));

      if (dataIndex > -1) {
        this._selectedRows.set(this._selectedRows().filter((selectedRow) => !this.sameRow(selectedRow, row)));
      } else {
        this._selectedRows.set([...this._selectedRows(), row]);
      }
      this.updateSelectedRows();
    }
  }

  rowContainSelectedRow(row: T): boolean {
    return this._selectedRows().some((selectedRow) => this.sameRow(selectedRow, row));
  }

  rowSelectionEnabled(): boolean {
    return this.allowRowSelect() || this.useRowsCheckbox();
  }

  renderCell(row: T, column: ColumnDefinition<T>): RecordType {
    return column.columnFn ? column.columnFn(row) : row[column.field];
  }

  readFilterData(filter: FilterRequest[]): void {

    this.appliedFilter.set(filter);

    this.queryChange.emit({
      pageIndex: 1,
      pageSize: 10,
      sort: undefined,
      filters: filter
    })

  }

  private sameRow(left: T, right: T): boolean {
    return left[this.rowKey()] === right[this.rowKey()];
  }

  private updateSelectedRows() {
    this.selectedRow.emit(this._selectedRows());
  }

  public callAction(action: ColumnAction, row: T): void {
    const rowAction: RowAction<T> = {
      name: action.name,
      row: row,
    }
    this.doAction.emit(rowAction);
  }
}