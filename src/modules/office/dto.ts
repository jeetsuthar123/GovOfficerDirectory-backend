import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsMongoId, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
export class CreateOfficeDto {
  @IsString() @MaxLength(150) name: string;
  @IsString() @MaxLength(40) code: string;
  @IsOptional() @IsString() officeType?: string;
  @IsMongoId() departmentId: string;
  @IsMongoId() districtId: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() place?: string;
  @IsOptional() @IsString() pinCode?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsNumber() latitude?: number;
  @IsOptional() @IsNumber() longitude?: number;
  @IsOptional() @IsBoolean() isActive?: boolean;
}
export class UpdateOfficeDto extends PartialType(CreateOfficeDto) {}
