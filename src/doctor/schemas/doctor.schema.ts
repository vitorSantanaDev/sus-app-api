import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DoctorDocument = Doctor & Document;

@Schema({ _id: false })
export class AvailabilitySchedule {
  @Prop({ required: true })
  dayOfWeek: string;

  @Prop({ type: [String], required: true })
  times: string[];
}

export const AvailabilityScheduleSchema =
  SchemaFactory.createForClass(AvailabilitySchedule);

@Schema({ timestamps: true })
export class Doctor {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  crm: string;

  @Prop({ required: true, index: true })
  specialty: string;

  @Prop({ type: [AvailabilityScheduleSchema], default: [] })
  availability: AvailabilitySchedule[];
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);
