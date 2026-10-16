import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
export class CreateDistrictDto {
  @IsString() name: string;
  @IsString() code: string;
  @IsOptional() @IsNumber() latitude?: number;
  @IsOptional() @IsNumber() longitude?: number;
  @IsOptional() @IsBoolean() isActive?: boolean;
}
export class UpdateDistrictDto extends PartialType(CreateDistrictDto) {}
