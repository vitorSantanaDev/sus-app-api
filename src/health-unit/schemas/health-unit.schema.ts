import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HealthUnitDocument = HealthUnit & Document;

@Schema({ timestamps: true })
export class HealthUnit {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  address: string;
}

export const HealthUnitSchema = SchemaFactory.createForClass(HealthUnit);
