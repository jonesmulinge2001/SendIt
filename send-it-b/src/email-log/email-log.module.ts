/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { EmailLogService } from './email-log.service';
import { EmailLogController } from './email-log.controller';
import { PermissionModule } from 'src/permissions/permission/permission.module';

@Module({
  imports: [PermissionModule],
  providers: [EmailLogService],
  controllers: [EmailLogController]
})
export class EmailLogModule {}
