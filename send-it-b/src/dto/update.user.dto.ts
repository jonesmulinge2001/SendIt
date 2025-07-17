/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { RegisterUserDto } from './register.user.dto';
import { PartialType } from '@nestjs/mapped-types';
export class UpdateUserDto extends PartialType(RegisterUserDto) {}
