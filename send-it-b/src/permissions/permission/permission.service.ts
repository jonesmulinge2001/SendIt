/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Role } from 'generated/prisma'; 
import { Permission } from './permission.enum';

@Injectable()
export class PermissionService {
  private readonly rolePermissions: Record<Role, Permission[]> = {
    ADMIN: [
      Permission.ACCESS_ADMIN_DASHBOARD,
      Permission.MANAGE_USERS,
      Permission.VIEW_USERS,
      Permission.CREATE_PARCEL,
      Permission.UPDATE_PARCEL_STATUS,
      Permission.VIEW_PARCELS,
      Permission.VIEW_ANALYTICS,
      Permission.SEND_NOTIFICATIONS,
      Permission.MANAGE_PROFILE,
      Permission.MANAGE_EMAILS
    ],
    USER: [
      Permission.VIEW_PARCELS,
      Permission.MANAGE_PROFILE,
    ],
  };

  getRolePermissions(role: Role): Permission[] {
    return this.rolePermissions[role] || [];
  }

  hasPermission(role: Role, permission: Permission): boolean {
    return this.getRolePermissions(role).includes(permission);
  }
}
