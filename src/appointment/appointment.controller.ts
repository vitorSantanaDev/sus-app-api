/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';

@UseGuards(JwtAuthGuard)
@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto, @Request() req) {
    const userId = req.user.userId;
    return this.appointmentService.create(createAppointmentDto, userId);
  }

  @Get()
  findAll(@Request() req) {
    const userId = req.user.userId;
    return this.appointmentService.findAllForUser(userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string, @Request() req) {
    const userId = req.user.userId;
    return this.appointmentService.findOneForUser(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
    @Request() req,
  ) {
    const userId = req.user.userId;
    return this.appointmentService.updateForUser(
      id,
      updateAppointmentDto,
      userId,
    );
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string, @Request() req) {
    const userId = req.user.userId;
    return this.appointmentService.removeForUser(id, userId);
  }
}
