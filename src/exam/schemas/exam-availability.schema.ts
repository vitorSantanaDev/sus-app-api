import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  DateAvailability,
  DateAvailabilitySchema,
} from '../../common/schemas/date-availability.schema';

@Schema()
export class ExamAvailability {
  @Prop({ required: true, index: true })
  examId: string;

  @Prop({ required: true })
  examName: string;

  @Prop({ type: [DateAvailabilitySchema], default: [] })
  availability: DateAvailability[];
}

export const ExamAvailabilitySchema =
  SchemaFactory.createForClass(ExamAvailability);
