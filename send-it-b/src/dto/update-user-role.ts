/* eslint-disable prettier/prettier */
import { IsEnum } from 'class-validator';
import { Role } from './enums/role.enum';

export class UpdateUserRoleDto {
  @IsEnum(Role, {
    message: 'Role must be ADMIN, USER, or DRIVER',
  })
  role: Role;
}
