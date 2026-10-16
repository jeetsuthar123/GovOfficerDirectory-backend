import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DesignationService } from './designation.service';
import { CreateDesignationDto, UpdateDesignationDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
@ApiTags('designations')
@Controller('designations')
export class DesignationController {
  constructor(private service: DesignationService) {}
  @Get() list(@Query('search') s?: string) {
    return this.service.list(s);
  }
  @Get(':id') find(@Param('id') id: string) {
    return this.service.find(id);
  }
  @Post() @ApiBearerAuth() @UseGuards(JwtAuthGuard) create(@Body() d: CreateDesignationDto) {
    return this.service.create(d);
  }
  @Patch(':id') @ApiBearerAuth() @UseGuards(JwtAuthGuard) update(
    @Param('id') id: string,
    @Body() d: UpdateDesignationDto,
  ) {
    return this.service.update(id, d);
  }
}
