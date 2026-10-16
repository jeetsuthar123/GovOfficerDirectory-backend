import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DirectoryController } from './directory.controller';
import { Officer, OfficerSchema } from '../officer/officer.schema';
import { Office, OfficeSchema } from '../office/office.schema';
import { District, DistrictSchema } from '../district/district.schema';
import { Designation, DesignationSchema } from '../designation/designation.schema';
import { Department, DepartmentSchema } from '../department/department.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Officer.name, schema: OfficerSchema },
      { name: Office.name, schema: OfficeSchema },
      { name: District.name, schema: DistrictSchema },
      { name: Designation.name, schema: DesignationSchema },
      { name: Department.name, schema: DepartmentSchema },
    ]),
  ],
  controllers: [DirectoryController],
})
export class DirectoryModule {}
