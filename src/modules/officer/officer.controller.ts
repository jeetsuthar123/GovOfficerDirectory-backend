import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OfficerService } from './officer.service';
import { CreateOfficerDto, UpdateOfficerDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@ApiTags('officers')
@Controller('officers')
export class OfficerController {
  constructor(private service: OfficerService) {}
  @Get() list(
    @Query('search') search?: string,
    @Query('designationId') designationId?: string,
    @Query('districtId') districtId?: string,
    @Query('officeId') officeId?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('departmentId') departmentId?: string,
  ) {
    return this.service.list(search, designationId, districtId, officeId, positiveInt(page, 1, 1000000), positiveInt(limit, 20, 100), departmentId);
  }
  @Get(':id') find(@Param('id') id: string) { return this.service.find(id); }
  @Post() @ApiBearerAuth() @UseGuards(JwtAuthGuard) create(@Body() dto: CreateOfficerDto) { return this.service.create(dto); }
  @Patch(':id') @ApiBearerAuth() @UseGuards(JwtAuthGuard) update(@Param('id') id: string, @Body() dto: UpdateOfficerDto) { return this.service.update(id, dto); }
}
function positiveInt(value: string, fallback: number, max: number) { const n = Number.parseInt(value, 10); return Number.isFinite(n) ? Math.min(max, Math.max(1, n)) : fallback; }
