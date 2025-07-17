/* eslint-disable prettier/prettier */
import { IsEnum } from 'class-validator';

export class UpdateUserRoleDto {
  @IsEnum(['ADMIN', 'USER'], {
    message: 'Role must be ADMIN, USER',
  })
  role: 'ADMIN' | 'USER';
}
