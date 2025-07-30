/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import type { Express } from 'express';


export interface CloudinaryUploadResult extends UploadApiResponse {
  folder: string;
}

export interface SendItUploadConfig {
  uploadType: SendItUploadType;
  maxSizeBytes: number;
  allowedFormats: string[];
  folder: string;
  transformations?: any;
}

export enum SendItUploadType {
  PROFILE_IMAGE = 'profile_image',
  PARCEL_IMAGE = 'parcel_image',
}

@Injectable()
export class SendItCloudinaryService {
  private readonly logger = new Logger(SendItCloudinaryService.name);

  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });

    this.logger.log('SendIt Cloudinary service initialized');
  }

  private getUploadConfig(uploadType: SendItUploadType): SendItUploadConfig {
    const configs: Record<SendItUploadType, SendItUploadConfig> = {
      [SendItUploadType.PROFILE_IMAGE]: {
        uploadType,
        maxSizeBytes: 2 * 1024 * 1024,
        allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
        folder: 'sendit/users/profiles',
        transformations: {
          width: 400,
          height: 400,
          crop: 'fill',
          gravity: 'face',
          quality: 'auto',
          format: 'auto',
        },
      },
      [SendItUploadType.PARCEL_IMAGE]: {
        uploadType,
        maxSizeBytes: 5 * 1024 * 1024,
        allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
        folder: 'sendit/parcels/images',
        transformations: {
          width: 800,
          height: 600,
          crop: 'fill',
          quality: 'auto',
          format: 'auto',
        },
      },
    };

    return configs[uploadType];
  }

  async uploadImage(
    file: Express.Multer.File,
    uploadType: SendItUploadType,
  ): Promise<CloudinaryUploadResult> {
    const config = this.getUploadConfig(uploadType);

    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (file.size > config.maxSizeBytes) {
      throw new BadRequestException('File exceeds maximum allowed size');
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: config.folder,
          transformation: config.transformations,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error || !result) {
            return reject(
              new BadRequestException(
                'Cloudinary upload failed: ' + (error?.message || 'Unknown error'),
              ),
            );
          }

          const uploadResult: CloudinaryUploadResult = {
            ...result,
            folder: config.folder,
          };

          resolve(uploadResult);
        },
      );

      uploadStream.end(file.buffer);
    });
  }
}
