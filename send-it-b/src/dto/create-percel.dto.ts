/* eslint-disable prettier/prettier */
import { IsEmail, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateParcelDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  weightKg: number;

  @IsString()
  pickupAddress: string;

  @IsString()
  destination: string;

  @IsString()
  senderName: string;
  
  @IsEmail()
  senderEmail: string;

  @IsString()
  receiverName: string;

  @IsString()
  receiverEmail: string;
}
