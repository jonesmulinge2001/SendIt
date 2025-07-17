/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CloudinaryModule } from './shared/cloudinary/cloudinary.module';

import { MailerModule } from './shared/mailer/mailer.module';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { SendItCloudinaryService } from './shared/cloudinary/cloudinary.service';
import { SendItMailerService } from './shared/mailer/mailer.service';
import { ConfigModule } from '@nestjs/config';
import { PermissionService } from './permissions/permission/permission.service';
import { PermissionController } from './permissions/permission/permission.controller';
import { PermissionModule } from './permissions/permission/permission.module';
import { ParcelService } from './parcel/parcel.service';
import { ParcelController } from './parcel/parcel.controller';
import { ParcelModule } from './parcel/parcel.module';
import { UsersModule } from './users/users.module';
import { UserService } from './users/users.service';
import { UserController } from './users/users.controller';
import { EmailLogModule } from './email-log/email-log.module';

@Module({
  imports: [CloudinaryModule, 
    MailerModule, 
    AuthModule,
    ConfigModule.forRoot({
    isGlobal: true}),
    PermissionModule,
    ParcelModule,
    UsersModule,
    EmailLogModule
  ],
  controllers: [AppController, AuthController, PermissionController, ParcelController, UserController],
  providers: [
    AppService,
    SendItCloudinaryService,
    SendItMailerService,
    AuthService,
    PermissionService,
    ParcelService,
    UserService,
  ],
})
export class AppModule {}
