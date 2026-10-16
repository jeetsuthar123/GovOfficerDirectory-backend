import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type AdminDocument = HydratedDocument<Admin>;
@Schema({ timestamps: true })
export class Admin {
  @Prop({ required: true, unique: true }) username: string;
  @Prop({ required: true }) passwordHash: string;
  @Prop({ required: true, default: 'ADMIN' }) role: string;
  @Prop({ default: true }) isActive: boolean;
  @Prop() lastLoginAt: Date;
}
export const AdminSchema = SchemaFactory.createForClass(Admin);
