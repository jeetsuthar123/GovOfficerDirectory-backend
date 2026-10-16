import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type DistrictDocument = HydratedDocument<District>;
@Schema({ timestamps: true })
export class District {
  @Prop({ required: true, unique: true }) name: string;
  @Prop({ required: true, unique: true }) code: string;
  @Prop() latitude: number;
  @Prop() longitude: number;
  @Prop({ default: true }) isActive: boolean;
}
export const DistrictSchema = SchemaFactory.createForClass(District);
