import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Appointment, AppointmentDocument } from './schemas/appointment.schema';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { DoctorService } from '../doctor/doctor.service';
import { HealthUnitService } from 'src/health-unit/health-unit.service';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectModel(Appointment.name)
    private appointmentModel: Model<AppointmentDocument>,
    private doctorService: DoctorService,
    private healthUnitService: HealthUnitService,
  ) {}

  async create(
    createAppointmentDto: CreateAppointmentDto,
    userId: string,
  ): Promise<Appointment> {
    const { doctorId, healthUnitId, availabilityId, time } =
      createAppointmentDto;

    const [doctor, healthUnit] = await Promise.all([
      this.doctorService.findOne(doctorId).catch(() => null),
      this.healthUnitService.findOne(healthUnitId).catch(() => null),
    ]);

    if (!doctor) throw new NotFoundException('Médico não encontrado');

    if (!healthUnit)
      throw new NotFoundException('Unidade de Saúde não encontrada');

    const daySchedule = doctor.availability.find(
      (avail: any) => String(avail._id) === availabilityId,
    );

    if (!daySchedule) {
      throw new NotFoundException('Agenda não encontrada para este médico');
    }

    if (!daySchedule.times.includes(time)) {
      throw new ConflictException(
        'O médico não tem disponibilidade no horário selecionado',
      );
    }

    const dateTimeObject = new Date(`${daySchedule.date}T${time}:00.000Z`);

    if (dateTimeObject < new Date()) {
      throw new ConflictException(
        'Não é possível agendar consultas em datas passadas',
      );
    }

    const existingAppointment = await this.appointmentModel.findOne({
      doctor: doctorId,
      dateTime: dateTimeObject,
      status: { $ne: 'Cancelled' },
    });

    if (existingAppointment) {
      throw new ConflictException(
        'Este horário já está reservado com este médico',
      );
    }

    const newAppointment = new this.appointmentModel({
      ...createAppointmentDto,
      dateTime: dateTimeObject,
      user: userId,
      doctor: doctorId,
      healthUnit: healthUnitId,
      status: 'Pending',
    });

    return newAppointment.save();
  }

  async findAllForUser(userId: string): Promise<Appointment[]> {
    return this.appointmentModel
      .find({ user: userId })
      .populate('doctor', 'name specialty')
      .populate('healthUnit', 'name address')
      .sort({ dateTime: 1 })
      .exec();
  }

  async findOneForUser(id: string, userId: string): Promise<Appointment> {
    const appointment = await this.appointmentModel
      .findOne({ _id: id, user: userId })
      .populate('doctor', 'name specialty crm')
      .populate('healthUnit', 'name address')
      .exec();

    if (!appointment) {
      throw new NotFoundException(
        'Agendamento não encontrado ou não pertence a este usuário',
      );
    }

    return appointment;
  }

  async updateForUser(
    id: string,
    updateAppointmentDto: UpdateAppointmentDto,
    userId: string,
  ): Promise<Appointment> {
    const updatedAppointment = await this.appointmentModel
      .findOneAndUpdate({ _id: id, user: userId }, updateAppointmentDto, {
        new: true,
      })
      .exec();

    if (!updatedAppointment) {
      throw new NotFoundException(
        'Agendamento não encontrado ou não pertence a este usuário',
      );
    }
    return updatedAppointment;
  }

  async removeForUser(id: string, userId: string): Promise<any> {
    const result = await this.appointmentModel.deleteOne({
      _id: id,
      user: userId,
    });

    if (result.deletedCount === 0) {
      throw new NotFoundException(
        'Agendamento não encontrado ou não pertence a este usuário',
      );
    }
    return { message: 'Agendamento removido com sucesso' };
  }
}
