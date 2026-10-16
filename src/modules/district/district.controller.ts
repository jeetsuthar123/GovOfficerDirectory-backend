import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DistrictService } from './district.service';
import { CreateDistrictDto, UpdateDistrictDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
@ApiTags('districts')
@Controller('districts')
export class DistrictController {
  constructor(private service: DistrictService) {}
  @Get() list(@Query('search') search?: string) {
    return this.service.list(search);
  }
  @Get(':id') find(@Param('id') id: string) {
    return this.service.find(id);
  }
  @Post() @ApiBearerAuth() @UseGuards(JwtAuthGuard) create(@Body() dto: CreateDistrictDto) {
    return this.service.create(dto);
  }
  @Patch(':id') @ApiBearerAuth() @UseGuards(JwtAuthGuard) update(
    @Param('id') id: string,
    @Body() dto: UpdateDistrictDto,
  ) {
    return this.service.update(id, dto);
  }
}
