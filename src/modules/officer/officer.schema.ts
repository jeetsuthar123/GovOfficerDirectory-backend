import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MSchema, Types } from 'mongoose';
export type OfficerDocument = HydratedDocument<Officer>;
@Schema({ timestamps: true })
export class Officer {
  @Prop({ required: true, unique: true, index: true }) employeeCode: string;
  @Prop({ required: true, index: true }) name: string;
  @Prop({ type: Date, default: null }) dob?: Date;
  @Prop({ type: MSchema.Types.ObjectId, ref: 'Designation', required: true, index: true })
  designationId: Types.ObjectId;
  @Prop({ type: MSchema.Types.ObjectId, ref: 'Office', required: true, index: true })
  officeId: Types.ObjectId;
  @Prop({ type: MSchema.Types.ObjectId, ref: 'District', required: true, index: true })
  districtId: Types.ObjectId;
  @Prop() mobile: string;
  @Prop() phone: string;
  @Prop() email: string;
  @Prop() profileImageUrl: string;
  @Prop() address: string;
  @Prop() remark: string;
  @Prop({ default: 1, index: true }) designationSeniority: number;
  @Prop({ default: true, index: true }) isActive: boolean;
  @Prop({ default: true, index: true }) isPublic: boolean;
}
export const OfficerSchema = SchemaFactory.createForClass(Officer);
OfficerSchema.index({ name: 1, isActive: 1, isPublic: 1 });
OfficerSchema.index({ designationId: 1, districtId: 1, isActive: 1 });
