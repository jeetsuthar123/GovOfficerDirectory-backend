import { PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
export class CreateOfficerDto {
  @IsString() employeeCode: string;
  @IsString() name: string;
  @IsOptional() @IsDateString() dob?: string;
  @IsMongoId() designationId: string;
  @IsMongoId() officeId: string;
  @IsMongoId() districtId: string;
  @IsOptional() @IsString() mobile?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() profileImageUrl?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() remark?: string;
  @IsOptional() @IsNumber() designationSeniority?: number;
  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsOptional() @IsBoolean() isPublic?: boolean;
}
export class UpdateOfficerDto extends PartialType(CreateOfficerDto) {}
