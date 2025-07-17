/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpException, HttpStatus, NotFoundException, Param, Patch, UseGuards } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { RequirePermissions } from 'src/auth/decorator/permissions.decorator';
import { UpdateUserRoleDto } from 'src/dto/update-user-role';
import { PermissionGuard } from 'src/guards/permissions.guards';
import { ApiResponse } from 'src/interfaces/apiresponse';
import { SafeUser, User } from 'src/interfaces/user.interface';
import { Permission } from 'src/permissions/permission/permission.enum';
import { UserService } from './users.service';

@Controller('admin/user')
export class UserController {
    
    constructor(private readonly userService: UserService) {}

      /**
   * @ Get() all users
   * @ returns user[]
   */
  @Get()
  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @RequirePermissions(Permission.MANAGE_USERS)
  async getAllUsers(): Promise< ApiResponse<SafeUser[]>> {
    try {
        const users = await this.userService.getAllUsers();
        return { 
            success: true,
            message: `${users.length} Users retrieved successfully`,
            data: users,
        };
    } catch (error) {
        throw new HttpException (
            {
                success: false,
                message: 'Error retrieving users',
                data: [],
            },
            HttpStatus.CONFLICT,
        );
    }
  }

  @Get('users-count')
async getUserStats() {
  const data = await this.userService.getUserStats();
  return {
    success: true,
    message: 'User stats fetched',
    data,
  };
}

  /**
   * @ Get() user by id
   * @ returns user
   */
  @Get(':id')
  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @RequirePermissions(Permission.MANAGE_USERS)
  async getUserById(@Param('id') id: string): Promise<ApiResponse<SafeUser>> {
    try{
        const user = await this.userService.getUserById(id);
        if(!user) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
        return {
            success: true,
            message: `User with id ${id} retrieved successfully`,
            data: user,
        }
    } catch (error) {
        throw new HttpException (
            {
                success: false,
                message: 'Error retrieving user',
                data: [],
            },
            HttpStatus.CONFLICT,
        )
    }
  }

  /**
   * @ Patch () user role
   * 
   */
  @Patch(':id/role')
  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @RequirePermissions(Permission.MANAGE_USERS)
  async updateUserRole(@Param('id') id: string, @Body() dto: UpdateUserRoleDto): Promise<ApiResponse<SafeUser>> {
    try {
        const user = await this.userService.updateUserRole(id, dto);
        if(!user) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
        return {
            success: true,
            message: `User with id ${id} updated successfully`,
            data: user,
        }
    } catch (error) {
        throw new HttpException (
            {
                success: false,
                message: 'Error updating user role',
                data: [],
            },
            HttpStatus.CONFLICT,
        )
    }
  }

  /**
   * @ Delete () user
   * @ param id
   */
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @RequirePermissions(Permission.MANAGE_USERS)
  async deleteUser(@Param('id') id: string): Promise<ApiResponse<SafeUser>> {
    try {
        await this.userService.deleteUser(id);
        return {
            success: true,
            message: `User with id ${id} deleted successfully`,
            data: null
        }
    } catch (error) {
        throw new HttpException (
            {
                success: false,
                message: 'Error deleting user',
            },
            HttpStatus.CONFLICT,
        )
    }
  }




}
