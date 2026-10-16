import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsOptional, IsString, IsUrl, MinLength } from 'class-validator';
export class CreateDepartmentDto {
  @IsString() @MinLength(2) name: string;
  @IsString() code: string;
  @IsOptional() @IsString() shortName?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsUrl() logoUrl?: string;
  @IsOptional() @IsUrl() website?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsBoolean() isActive?: boolean;
}
export class UpdateDepartmentDto extends PartialType(CreateDepartmentDto) {}
