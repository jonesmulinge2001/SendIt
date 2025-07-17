/* eslint-disable prettier/prettier */
import { Role } from 'generated/prisma';

export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
}
