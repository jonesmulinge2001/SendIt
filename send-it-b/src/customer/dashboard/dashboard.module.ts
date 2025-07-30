import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { PermissionModule } from 'src/permissions/permission/permission.module';

@Module({
  imports: [PermissionModule],
  providers: [DashboardService],
  controllers: [DashboardController],
})
export class DashboardModule {}
