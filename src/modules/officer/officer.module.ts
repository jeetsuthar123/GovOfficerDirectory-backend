import { AuthModule } from '../auth/auth.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Officer, OfficerSchema } from './officer.schema';
import { Office, OfficeSchema } from '../office/office.schema';
import { OfficerController } from './officer.controller';
import { OfficerService } from './officer.service';
@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Officer.name, schema: OfficerSchema },
      { name: Office.name, schema: OfficeSchema },
    ]),
  ],
  controllers: [OfficerController],
  providers: [OfficerService],
  exports: [OfficerService, MongooseModule],
})
export class OfficerModule {}
