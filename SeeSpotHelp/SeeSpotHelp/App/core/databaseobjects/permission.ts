import DataServices from '../dataservices';
import DatabaseObject from './databaseobject';

enum PermissionsEnum {
  MEMBER = 0,
  NONMEMBER = 1,
  ADMIN = 2,
  PENDINGMEMBERSHIP = 3,
  MEMBERSHIPDENIED = 4
}

export default class Permission extends DatabaseObject {
  public userId: string;
  public groupId: string;
  public permission: PermissionsEnum = PermissionsEnum.NONMEMBER;

  constructor(userId: string, groupId: string, permission?: PermissionsEnum) {
    super();
    this.userId = userId;
    this.groupId = groupId;
    this.permission = permission !== undefined  && permission !== null ?
        permission : PermissionsEnum.NONMEMBER;

    this.mappingProperties.push('userId');
    this.mappingProperties.push('groupId');
  }

  createInstance() { return new Permission('', '', PermissionsEnum.NONMEMBER); }

  public static CreateAdminPermission(userId, groupId) {
    return new Permission(userId, groupId, PermissionsEnum.ADMIN);
  }

  public static CreateMemberPermission(userId, groupId) {
    return new Permission(userId, groupId, PermissionsEnum.MEMBER);
  }

  public static CreatePendingPermission(userId, groupId) {
    return new Permission(userId, groupId, PermissionsEnum.PENDINGMEMBERSHIP);
  }

  public static CreateNonMemberPermission(userId?, groupId?) {
    return new Permission(userId, groupId, PermissionsEnum.NONMEMBER);
  }

  setDenied() {
    this.permission = PermissionsEnum.MEMBERSHIPDENIED;
  }

  setPending() {
    this.permission = PermissionsEnum.PENDINGMEMBERSHIP;
  }

  setMember() {
    this.permission = PermissionsEnum.MEMBER;
  }

  leave() {
    this.permission = PermissionsEnum.NONMEMBER;
  }

  inGroup() {
    return this.permission == PermissionsEnum.MEMBER ||
      this.permission == PermissionsEnum.ADMIN;
  }

  notInGroup() {
    return this.permission == PermissionsEnum.MEMBERSHIPDENIED ||
      this.permission == PermissionsEnum.NONMEMBER;
  }

  pending() {
    return this.permission == PermissionsEnum.PENDINGMEMBERSHIP;
  }

  member() {
    return this.permission == PermissionsEnum.MEMBER;
  }

  denied() {
    return this.permission == PermissionsEnum.MEMBERSHIPDENIED;
  }

  admin () {
    return this.permission == PermissionsEnum.ADMIN;
  }

  update() : Promise<any> {
    if (this.permission == PermissionsEnum.NONMEMBER) {
      return this.shallowDelete();
    } else if (this.id) {
      return super.update();
    } else {
      return this.insert();
    }
  }

  // Permissions have to be set up a little differently in firebase as they are accessed via
  // security rules so can't have the dynamic permission id in the path when looking up
  // group or user permissions.
  getPathToMapping(propertyName: string): string {
    var id = propertyName == 'userId' ? this.groupId : this.userId;
    return DatabaseObject.GetPathToMapping(
      this.firebasePath,
      propertyName,
      this[propertyName],
      id);
  }
}
