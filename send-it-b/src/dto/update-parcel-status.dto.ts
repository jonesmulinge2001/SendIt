/* eslint-disable prettier/prettier */
import { IsEnum } from 'class-validator';
import { ParcelStatus } from 'generated/prisma';

export class UpdateParcelStatusDto {
  @IsEnum(ParcelStatus, { message: 'Status must be a valid status' })
  status: ParcelStatus;
}
