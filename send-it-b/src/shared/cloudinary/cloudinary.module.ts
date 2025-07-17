/* eslint-disable prettier/prettier */
import { SendItCloudinaryService } from './cloudinary.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [SendItCloudinaryService],
  exports: [SendItCloudinaryService],
})
export class CloudinaryModule {}
