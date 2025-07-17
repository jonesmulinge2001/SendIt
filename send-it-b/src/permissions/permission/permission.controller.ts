/* eslint-disable prettier/prettier */
 
 
/* eslint-disable prettier/prettier */
 
 
 
/* eslint-disable prettier/prettier */
import { Permission } from './permission.enum';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { Role } from 'generated/prisma';
import { PermissionService } from './permission.service';
import { CurrentUser, CurrentUserData } from 'src/auth/decorator/currentUser/currentUser.decorator';
import { RequirePermissions } from 'src/auth/decorator/permissions.decorator';
import { JwtAuthGuard } from 'src/guards/jwt/jwtAuth.guard';
import { PermissionGuard } from 'src/guards/permissions.guards';

@Controller('permissions')
@UseGuards(JwtAuthGuard)
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  // ✅ Get permissions for the current logged-in user
  @Get('my-permissions')
  getMyPermissions(@CurrentUser() user: CurrentUserData) {
    const permissions = this.permissionService.getRolePermissions(user.role as Role);
    return {
      role: user.role,
      permissions,
      permissionCount: permissions.length,
    };
  }

  // ✅ Get all permissions for a specific role (Admin only)
  @Get('role/:role')
  @UseGuards(PermissionGuard)
  @RequirePermissions(Permission.MANAGE_USERS)
  getRolePermissions(@Param('role') role: Role) {
    const permissions = this.permissionService.getRolePermissions(role);
    return {
      role,
      permissions,
      permissionCount: permissions.length,
    };
  }

  // ✅ Check if the current user has a specific permission
  @Get('check/:permission')
  checkPermission(
    @Param('permission') permission: Permission,
    @CurrentUser() user: CurrentUserData,
  ) {
    const hasPermission = this.permissionService.hasPermission(
      user.role as Role,
      permission,
    );
    return {
      permission,
      hasPermission,
      role: user.role,
    };
  }

  // ✅ List all available permissions in the system (Admin only)
  @Get('all-permissions')
  @UseGuards(PermissionGuard)
  @RequirePermissions(Permission.MANAGE_USERS)
  getAllPermissions() {
    return {
      permissions: Object.values(Permission),
    };
  }
}


