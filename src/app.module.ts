import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DepartmentModule } from './modules/department/department.module';
import { OfficerModule } from './modules/officer/officer.module';
import { OfficeModule } from './modules/office/office.module';
import { DistrictModule } from './modules/district/district.module';
import { DesignationModule } from './modules/designation/designation.module';
import { DirectoryModule } from './modules/directory/directory.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI') || 'mongodb://127.0.0.1:27017/gov_officer_directory',
      }),
    }),
    DepartmentModule,
    OfficerModule,
    OfficeModule,
    DistrictModule,
    DesignationModule,
    DirectoryModule,
    AuthModule,
  ],
})
export class AppModule {}
