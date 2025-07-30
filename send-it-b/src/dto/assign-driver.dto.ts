/* eslint-disable prettier/prettier */
import { IsUUID } from 'class-validator';

/* eslint-disable prettier/prettier */
export class AssignDriverDto {
    @IsUUID()
  driverId: string;
}
