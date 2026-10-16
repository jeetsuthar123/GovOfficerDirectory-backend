import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type DesignationDocument = HydratedDocument<Designation>;
@Schema({ timestamps: true })
export class Designation {
  @Prop({ required: true }) name: string;
  @Prop({ required: true, unique: true }) code: string;
  @Prop({ default: 1 }) level: number;
  @Prop({ default: 1 }) seniority: number;
  @Prop() description: string;
  @Prop({ default: true }) isActive: boolean;
}
export const DesignationSchema = SchemaFactory.createForClass(Designation);
