import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class DateAvailability {
  @Prop({ required: true })
  date: string;

  @Prop({ type: [String], required: true })
  times: string[];
}

export const DateAvailabilitySchema =
  SchemaFactory.createForClass(DateAvailability);
