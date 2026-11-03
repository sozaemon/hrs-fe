import { HttpErrorResponse } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { of, throwError } from "rxjs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { UserService } from "../../service/user.service";
import { User } from "../../type/user.type";
import { UserForm } from "./user-form";

describe("UserForm", () => {
  let fixture: ComponentFixture<UserForm>;
  let component: UserForm;

  const userService = {
    roleList: vi.fn(),
    getUserRoles: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    assignUserRole: vi.fn(),
  };

  const notification = {
    info: vi.fn(),
    error: vi.fn(),
    success: vi.fn(),
    warning: vi.fn(),
  };

  const newUser: User = {
    userName: "jdoe",
    fullName: "John Doe",
    email: "jdoe@example.com",
    plainPassword: "secret",
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    userService.roleList.mockReturnValue(of({
      data: { data: [], page: 1, size: 0, total: 0 },
      message: "ok",
      responseTime: new Date(),
    }));

    await TestBed.configureTestingModule({
      imports: [UserForm],
      providers: [
        { provide: NzNotificationService, useValue: notification },
      ],
    })
      .overrideProvider(UserService, { useValue: userService })
      .compileComponents();

    fixture = TestBed.createComponent(UserForm);
    component = fixture.componentInstance;
    fixture.componentRef.setInput("mode", "create");
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it("handles a create failure without assigning roles", () => {
    const results: string[] = [];
    component.outputFlag.subscribe((r) => results.push(r));

    userService.create.mockReturnValue(throwError(() => new HttpErrorResponse({
      status: 500,
      error: { message: "create failed" },
    })));

    component.onSubmit(newUser);

    expect(userService.create).toHaveBeenCalledTimes(1);
    expect(userService.assignUserRole).not.toHaveBeenCalled();
    expect(notification.error).toHaveBeenCalledWith("Error", "create failed");
    expect(notification.info).not.toHaveBeenCalled();
    expect(results).toEqual(["fail"]);
    expect(component.isLoading()).toBe(false);
  });
});
