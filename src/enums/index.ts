export enum RoleEnum {
  user = 1,
  staff = 2,
  admin = 3,
  superAdmin = 99,
}

export const RoleMap = {
  [RoleEnum.user]: '用户',
  [RoleEnum.staff]: '员工',
  [RoleEnum.admin]: '管理员',
  [RoleEnum.superAdmin]: '超级管理员',
}

export enum ApprovalStatusEnum {
  pending = 'PENDING',
  pass = 'PASS',
  reject = 'REJECT',
}
