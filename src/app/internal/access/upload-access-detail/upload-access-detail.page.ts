import { Component, computed, DestroyRef, inject, OnInit, signal, ViewChild } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ActivatedRoute } from "@angular/router";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzCardModule } from "ng-zorro-antd/card";
import { NzModalModule } from "ng-zorro-antd/modal";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { DataTable } from "@app/shared/components/data-table/data-table";
import { ColumnAction, DataTableQuery, RowAction } from "@app/shared/components/data-table/types/data-table.types";
import { FilterRequest } from "@app/shared/components/data-table/types/filter-request.types";
import { PaginationRequest, SortDirection } from "@app/shared/components/data-table/types/pagination-request";
import { DynamicFormBuilder } from "@app/shared/components/form-builder/form-builder.component";
import { FormConfig } from "@app/shared/components/form-builder/types/types";
import { resolveHttpErrorMessage } from "@app/shared/utility/error-utility";
import { UploadAccessDetailService } from "./service/upload-access-detail.service";
import { columnDefinition } from "./types/column-definition";
import { UpdateUploadAccessDetailRequest, UploadAccessDetail } from "./types/upload-access-detail.type";

@Component({
  templateUrl: "./template/upload-access-detail.html",
  providers: [UploadAccessDetailService],
  imports: [NzCardModule, NzButtonModule, NzModalModule, DataTable, DynamicFormBuilder],
})
export class UploadAccessDetailPage implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly uploadAccessDetailService = inject(UploadAccessDetailService);
  private readonly notification = inject(NzNotificationService);
  private readonly destroyRef = inject(DestroyRef);

  readonly headerId = signal<number | undefined>(undefined);
  readonly uploadedData = signal<UploadAccessDetail[]>([]);
  readonly page = signal<number>(1);
  readonly pageSize = signal<number>(10);
  readonly totalSize = signal<number>(0);
  readonly sortBy = signal<string | undefined>(undefined);
  readonly sortDirection = signal<SortDirection>("ASC");

  readonly isLoading = signal<boolean>(false);
  readonly isProcessing = signal<boolean>(false);

  readonly columns = columnDefinition;
  readonly actions: ColumnAction[] = [
    { name: "edit", icon: "edit", label: "Fix", class: "bg-orange-500" }
  ];

  readonly selectedRecord = signal<UploadAccessDetail | undefined>(undefined);
  readonly displayForm = signal<boolean>(false);

  readonly formConfig = computed<FormConfig>(() => {
    const record = this.selectedRecord();

    return {
      columns: 1,
      fields: [
        {
          key: "name",
          type: "text",
          label: "Name",
          placeholder: "Access name",
          value: record?.name,
          validation: { required: true },
          order: 1,
        },
        {
          key: "path",
          type: "text",
          label: "Path",
          placeholder: "Access path",
          value: record?.path,
          validation: { required: true },
          order: 2,
        },
        {
          key: "method",
          type: "select",
          label: "Method",
          placeholder: "Select access method",
          value: record?.method,
          validation: { required: true },
          order: 3,
          options: ["GET", "POST", "PUT", "PATCH", "DELETE"].map((method) => ({
            label: method,
            value: method,
          })),
        },
        {
          key: "description",
          type: "text",
          label: "Description",
          placeholder: "Access description",
          value: record?.description,
          order: 4,
        },
        {
          key: "roles",
          type: "text",
          label: "Roles",
          placeholder: "Comma separated role codes",
          value: record?.roles,
          validation: { required: true },
          order: 5,
        },
      ],
    };
  });

  @ViewChild(DynamicFormBuilder) private formBuilder?: DynamicFormBuilder;

  ngOnInit(): void {
    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((queryParamMap) => {
        const headerId = Number(queryParamMap.get("headerId"));

        if (!Number.isInteger(headerId) || headerId <= 0) {
          this.headerId.set(undefined);
          this.uploadedData.set([]);
          this.totalSize.set(0);
          // this.notification.error("Error", "A valid headerId query parameter is required.");
          return;
        }

        this.headerId.set(headerId);
        this.page.set(1);
        this.loadData();
      });
  }

  public resolveActions(): ColumnAction[]{
    return this.actions
  }

  handleQueryChange(query: DataTableQuery<UploadAccessDetail>): void {
    this.page.set(query.pageIndex);
    this.pageSize.set(query.pageSize);
    this.sortBy.set(query.sort?.field);
    this.sortDirection.set(query.sort?.order ?? "ASC");

    this.loadData(query.filters || []);
  }

  resolveRowAction(action: RowAction<UploadAccessDetail>): void {
    if (action.name !== "edit") {
      return;
    }

    if (action.row.uploadStatus !== "NOTVALID") {
      this.notification.info("Info", "Only records that failed validation can be updated.");
      return;
    }

    this.selectedRecord.set(action.row);
    this.displayForm.set(true);
  }

  closeForm(): void {
    this.displayForm.set(false);
  }

  submitForm(): void {
    this.formBuilder?.submit();
  }

  onSubmit(value: Record<string, unknown>): void {
    const record = this.selectedRecord();
    const headerId = this.headerId();

    if (!record || headerId === undefined) {
      return;
    }

    const request: UpdateUploadAccessDetailRequest = {
      id: record.id,
      name: String(value["name"] ?? ""),
      path: String(value["path"] ?? ""),
      method: String(value["method"] ?? ""),
      description: value["description"] ? String(value["description"]) : undefined,
      roles: String(value["roles"] ?? ""),
    };

    this.uploadAccessDetailService.update(request).subscribe({
      next: () => {
        this.notification.success("Success", "Upload record updated.");
        this.displayForm.set(false);
        this.loadData();
      },
      error: (e) => this.notification.error("Error", resolveHttpErrorMessage(e)),
    });
  }

  processValidRecords(): void {
    const headerId = this.headerId();

    if (headerId === undefined || this.isProcessing()) {
      return;
    }

    this.isProcessing.set(true);

    this.uploadAccessDetailService.process(headerId).subscribe({
      next: () => {
        this.isProcessing.set(false);
        this.notification.success("Success", "Valid upload records processed.");
        this.loadData();
      },
      error: (e) => {
        this.isProcessing.set(false);
        this.notification.error("Error", resolveHttpErrorMessage(e));
      },
    });
  }

  private loadData(filter: FilterRequest[] = []): void {
    const headerId = this.headerId();

    filter = [...filter, {
      label: "HederId",
      fieldName: "uploadHeaderId",
      value: headerId,
      operator: "EQ",
      joinOperator: "AND"
    }]

    const request: PaginationRequest = {
      page: this.page(),
      pageSize: this.pageSize(),
      filter: filter,
      sortBy: this.sortBy(),
      sortDirection: this.sortDirection(),
    };

    this.isLoading.set(true);

    this.uploadAccessDetailService.list(request).subscribe({
      next: (r) => {
        this.uploadedData.set(r.data.data || []);
        this.page.set(r.data.page || 1);
        this.totalSize.set(r.data.total || 0);
        this.pageSize.set(r.data.size || 10);

        this.isLoading.set(false);
      },
      error: (e) => {
        this.notification.error("Error", resolveHttpErrorMessage(e));
        this.isLoading.set(false);
      },
    });
  }
}
