import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type DepartmentDocument = HydratedDocument<Department>;
@Schema({ timestamps: true })
export class Department {
  @Prop({ required: true }) name: string;
  @Prop({ required: true, unique: true }) code: string;
  @Prop() shortName: string;
  @Prop() description: string;
  @Prop() logoUrl: string;
  @Prop() website: string;
  @Prop() email: string;
  @Prop() phone: string;
  @Prop() address: string;
  @Prop({ default: true }) isActive: boolean;
}
export const DepartmentSchema = SchemaFactory.createForClass(Department);
