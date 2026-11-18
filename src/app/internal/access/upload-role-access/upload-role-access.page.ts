import { Component, inject, OnInit, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzCardModule } from "ng-zorro-antd/card";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NzUploadFile, NzUploadModule } from "ng-zorro-antd/upload";
import { DataTable } from "@app/shared/components/data-table/data-table";
import { ColumnAction, DataTableQuery, RowAction } from "@app/shared/components/data-table/types/data-table.types";
import { FilterRequest } from "@app/shared/components/data-table/types/filter-request.types";
import { PaginationRequest, SortDirection } from "@app/shared/components/data-table/types/pagination-request";
import { resolveHttpErrorMessage } from "@app/shared/utility/error-utility";
import { UploadRoleAccessService } from "./service/upload-role-access.service";
import { columnDefinition } from "./types/column-definition";
import { UploadedRoleAccess } from "./types/upload-role-access.type";
import { NzModalModule } from "ng-zorro-antd/modal";

@Component({
  templateUrl: "./template/upload-role-access.html",
  providers: [UploadRoleAccessService],
  imports: [NzCardModule, NzButtonModule, NzInputModule, NzUploadModule, FormsModule, DataTable, NzModalModule],
})
export class UploadRoleAccessPage implements OnInit {

  private readonly uploadRoleAccessService = inject(UploadRoleAccessService);
  private readonly notification = inject(NzNotificationService);
  private readonly router = inject(Router);

  readonly uploadedData = signal<UploadedRoleAccess[]>([]);
  readonly page = signal<number>(1);
  readonly pageSize = signal<number>(10);
  readonly totalSize = signal<number>(0);
  readonly sortBy = signal<string | undefined>(undefined);
  readonly sortDirection = signal<SortDirection>("ASC");

  readonly isLoading = signal<boolean>(false);
  readonly isDownloading = signal<boolean>(false);
  readonly isUploading = signal<boolean>(false);

  readonly description = signal<string>("");

  readonly uploadedRoleAccessColumns = columnDefinition;
  readonly acceptedFileTypes = ".xlsx,.xls";
  readonly displayUploadForm = signal<boolean>(false)

  readonly fileList = signal<NzUploadFile[]>([]);

  readonly actions: ColumnAction[] = [
    { name: "detail", icon: "eye", label: "Detail", class: "bg-green-500" }
  ];

  ngOnInit(): void {
    this.loadData();
  }

  resolveColumnAction(): ColumnAction[] {
    return this.actions;
  }

  downloadTemplate(): void {
    if (this.isDownloading()) {
      return;
    }

    this.isDownloading.set(true);

    this.uploadRoleAccessService.downloadTemplate().subscribe({
      next: (response) => {
        this.isDownloading.set(false);
        this.saveTemplate(response.body, response.headers.get("Content-Disposition"));
      },
      error: (e) => {
        this.isDownloading.set(false);
        this.notification.error("Error", resolveHttpErrorMessage(e));
      }
    });
  }

  displayUploadFormToggle(): void {
    this.resetUploadForm();
    this.displayUploadForm.set(!this.displayUploadForm());
  }

  resetUploadForm(): void {
    this.fileList.set([]);
    this.description.set("");
  }

  closeUploadForm(): void {
    this.displayUploadForm.set(false);
  }

  readonly beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList.set([file]);
    // const rawFile = file.originFileObj ?? (file as unknown as File);
    // this.uploadTemplate(rawFile, this.description());
    return false;
  };

  doUploadFile(): void {
    if (this.fileList().length === 0) {
      this.notification.warning("Warning", "Please select a file to upload.");
      return;
    }

    const rawFile = this.fileList()[0]?.originFileObj ?? (this.fileList()[0] as unknown as File);

    this.uploadTemplate(rawFile, this.description());
  }

  handleQueryChange(query: DataTableQuery<UploadedRoleAccess>): void {
    this.page.set(query.pageIndex);
    this.pageSize.set(query.pageSize);
    this.sortBy.set(query.sort?.field);
    this.sortDirection.set(query.sort?.order ?? "ASC");

    this.loadData(query.filters || []);
  }

  resolveRowAction(action: RowAction<UploadedRoleAccess>): void {
    if (action.name !== "detail") {
      return;
    }

    void this.router.navigate(["/app/access/upload-access-detail"], {
      queryParams: { headerId: action.row.id },
    });
  }

  private uploadTemplate(file: File, description?: string): void {
    if (this.isUploading()) {
      return;
    }

    this.isUploading.set(true);

    this.uploadRoleAccessService.uploadTemplate(file, description).subscribe({
      next: () => {
        this.isUploading.set(false);
        this.notification.success("Success", "Role access template uploaded successfully.");
        this.description.set("");
        this.page.set(1);
        this.loadData();

        this.resetUploadForm();
        this.closeUploadForm();
      },
      error: (e) => {
        this.isUploading.set(false);
        this.notification.error("Error", resolveHttpErrorMessage(e));
      }
    });
  }

  private loadData(filter: FilterRequest[] = []): void {
    const request: PaginationRequest = {
      page: this.page(),
      pageSize: this.pageSize(),
      filter: filter,
      sortBy: this.sortBy(),
      sortDirection: this.sortDirection(),
    };

    this.isLoading.set(true);

    this.uploadRoleAccessService.paginateList(request)
      .subscribe({
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
        }
      });
  }

  private saveTemplate(blob: Blob | null, contentDisposition: string | null): void {
    if (!blob) {
      this.notification.error("Error", "Template file is empty.");
      return;
    }

    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = this.resolveFileName(contentDisposition);
    anchor.click();
    URL.revokeObjectURL(objectUrl);
  }

  private resolveFileName(contentDisposition: string | null): string {
    const match = contentDisposition?.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i);
    return match?.[1] ? decodeURIComponent(match[1]) : "role-access-template.xlsx";
  }
}
