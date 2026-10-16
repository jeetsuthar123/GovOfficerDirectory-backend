import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OfficeService } from './office.service';
import { CreateOfficeDto, UpdateOfficeDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@ApiTags('offices')
@Controller('offices')
export class OfficeController {
  constructor(private service: OfficeService) {}
  @Get() list(@Query('search') search?: string, @Query('districtId') districtId?: string, @Query('page') page = '1', @Query('limit') limit = '20', @Query('departmentId') departmentId?: string) {
    return this.service.list(search, districtId, positiveInt(page, 1, 1000000), positiveInt(limit, 20, 100), departmentId);
  }
  @Get(':id') find(@Param('id') id: string) { return this.service.find(id); }
  @Post() @ApiBearerAuth() @UseGuards(JwtAuthGuard) create(@Body() dto: CreateOfficeDto) { return this.service.create(dto); }
  @Patch(':id') @ApiBearerAuth() @UseGuards(JwtAuthGuard) update(@Param('id') id: string, @Body() dto: UpdateOfficeDto) { return this.service.update(id, dto); }
}
function positiveInt(value: string, fallback: number, max: number) { const n = Number.parseInt(value, 10); return Number.isFinite(n) ? Math.min(max, Math.max(1, n)) : fallback; }
