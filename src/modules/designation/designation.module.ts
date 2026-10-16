import { AuthModule } from '../auth/auth.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Designation, DesignationSchema } from './designation.schema';
import { DesignationController } from './designation.controller';
import { DesignationService } from './designation.service';
@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: Designation.name, schema: DesignationSchema }]),
  ],
  controllers: [DesignationController],
  providers: [DesignationService],
  exports: [DesignationService, MongooseModule],
})
export class DesignationModule {}
