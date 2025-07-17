/* eslint-disable prettier/prettier */
// src/mailer/mailer.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SendItMailerService } from './mailer.service';

@Module({
  imports: [ConfigModule],
  providers: [SendItMailerService],
  exports: [SendItMailerService],
})
export class MailerModule {}
