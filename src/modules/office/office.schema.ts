import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MSchema, Types } from 'mongoose';
export type OfficeDocument = HydratedDocument<Office>;

@Schema({ timestamps: true })
export class Office {
  @Prop({ required: true, trim: true }) name: string;
  @Prop({ required: true, unique: true, trim: true, uppercase: true }) code: string;
  @Prop() officeType: string;
  @Prop({ type: MSchema.Types.ObjectId, ref: 'Department', index: true }) departmentId: Types.ObjectId;
  @Prop({ type: MSchema.Types.ObjectId, ref: 'District', required: true, index: true }) districtId: Types.ObjectId;
  @Prop() address: string;
  @Prop() place: string;
  @Prop() pinCode: string;
  @Prop() phone: string;
  @Prop() email: string;
  @Prop() latitude: number;
  @Prop() longitude: number;
  @Prop({ default: true, index: true }) isActive: boolean;
}
export const OfficeSchema = SchemaFactory.createForClass(Office);
OfficeSchema.index({ departmentId: 1, districtId: 1, isActive: 1 });
OfficeSchema.index({ name: 'text', code: 'text', place: 'text' });
