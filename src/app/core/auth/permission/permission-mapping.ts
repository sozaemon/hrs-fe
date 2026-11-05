export interface PermissionMapping {
  code: string;
  name: string;
  url: string;
}

export const permissions: PermissionMapping[] = [
  {
    code: "SR",
    name: "user.user-management",
    url: "user/user-management"
  },
  {
    code: "AC1",
    name: "access.access",
    url: "access/access"
  },
  {
    code: "AC2",
    name: "access.role-access",
    url: "access/role-access"
  },
  {
    code: "AC3",
    name: "access.upload-access",
    url: "access/upload-role-access"
  },
  {
    code: "AC4",
    name: "access.upload-access.detail",
    url: "access/upload-access-detail"
  },
  {
    code: "AC5",
    name: "access.role",
    url: "access/role"
  },
  {
    code: "SH1",
    name: "shift.shift",
    url: "shift/shift"
  },
  {
    code: "SH2",
    name: "shift.tolerance",
    url: "shift/shift-tolerance",
  },
  {
    code: "SH3",
    name: "shift.type",
    url: "shift/shift-type",
  }
]