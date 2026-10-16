import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApiTags } from '@nestjs/swagger';
import { Officer, OfficerDocument } from '../officer/officer.schema';
import { Office, OfficeDocument } from '../office/office.schema';
import { District, DistrictDocument } from '../district/district.schema';
import { Designation, DesignationDocument } from '../designation/designation.schema';
import { Department, DepartmentDocument } from '../department/department.schema';
@ApiTags('directory')
@Controller('directory')
export class DirectoryController {
  constructor(
    @InjectModel(Officer.name) private officers: Model<OfficerDocument>,
    @InjectModel(Office.name) private offices: Model<OfficeDocument>,
    @InjectModel(District.name) private districts: Model<DistrictDocument>,
    @InjectModel(Designation.name) private designations: Model<DesignationDocument>,
    @InjectModel(Department.name) private departments: Model<DepartmentDocument>,
  ) {}
  @Get('summary') async summary() {
    const [officers, offices, districts, designations, departments] = await Promise.all([
      this.officers.countDocuments({ isActive: true, isPublic: true }),
      this.offices.countDocuments({ isActive: true }),
      this.districts.countDocuments({ isActive: true }),
      this.designations.countDocuments({ isActive: true }),
      this.departments.countDocuments({ isActive: true }),
    ]);
    return { success: true, data: { officers, offices, districts, designations, departments } };
  }
}
