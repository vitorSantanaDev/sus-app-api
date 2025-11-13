/* eslint-disable @typescript-eslint/no-base-to-string */
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Doctor, DoctorDocument } from './schemas/doctor.schema';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { HealthUnitService } from 'src/health-unit/health-unit.service';
import {
  Appointment,
  AppointmentDocument,
} from '../appointment/schemas/appointment.schema';

@Injectable()
export class DoctorService {
  constructor(
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
    @InjectModel(Appointment.name)
    private appointmentModel: Model<AppointmentDocument>,
    private healthUnitService: HealthUnitService,
  ) {}

  async create(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    const { crm, healthUnitId } = createDoctorDto;

    const existingDoctor = await this.doctorModel.findOne({ crm });

    if (existingDoctor) {
      throw new ConflictException('Um médico com este CRM já existe');
    }

    await this.healthUnitService.findOne(healthUnitId);

    const createdDoctor = new this.doctorModel({
      ...createDoctorDto,
      healthUnit: healthUnitId,
    });

    return (await createdDoctor.save()).populate('healthUnit', 'name address');
  }

  async findAll(specialty?: string): Promise<any[]> {
    const filter = specialty ? { specialty } : {};

    const doctors = await this.doctorModel
      .find(filter)
      .populate('healthUnit', 'name address')
      .lean()
      .exec();

    //@ts-ignore
    const doctorIds = doctors.map((d) => String(d._id));
    const bookedAppointments = await this.appointmentModel
      .find({
        doctor: { $in: doctorIds },
        status: { $ne: 'Cancelled' },
      })
      .select('doctor dateTime')
      .lean()
      .exec();

    const bookedSlots = new Set<string>();

    bookedAppointments.forEach((appt) => {
      const key = `${appt.doctor.toString()}_${appt.dateTime.toISOString()}`;
      bookedSlots.add(key);
    });

    const availableDoctors = doctors.map((doctor) => {
      const filteredAvailability = doctor.availability.flatMap(
        (daySchedule) => {
          const availableTimes = daySchedule.times.filter((time) => {
            const dateTimeObject = new Date(
              `${daySchedule.date}T${time}:00.000Z`,
            );

            const key = `${String(doctor._id)}_${dateTimeObject.toISOString()}`;

            return !bookedSlots.has(key);
          });

          if (availableTimes.length > 0) {
            return [{ ...daySchedule, times: availableTimes }];
          }

          return [];
        },
      );

      return { ...doctor, availability: filteredAvailability };
    });

    return availableDoctors.filter((doc) => doc.availability.length > 0);
  }

  async findOne(id: string): Promise<Doctor> {
    const doctor = await this.doctorModel
      .findById(id)
      .populate('healthUnit', 'name address')
      .lean()
      .exec();

    if (!doctor) {
      throw new NotFoundException(`Médico com ID "${id}" não encontrado`);
    }

    const bookedAppointments = await this.appointmentModel
      .find({
        doctor: doctor._id,
        status: { $ne: 'Cancelled' },
      })
      .select('dateTime')
      .lean()
      .exec();

    const bookedSlots = new Set<string>(
      bookedAppointments.map((appt) => appt.dateTime.toISOString()),
    );

    const filteredAvailability = doctor.availability.flatMap((daySchedule) => {
      const availableTimes = daySchedule.times.filter((time) => {
        const dateTimeObject = new Date(`${daySchedule.date}T${time}:00.000Z`);
        return !bookedSlots.has(dateTimeObject.toISOString());
      });

      if (availableTimes.length > 0) {
        return [{ ...daySchedule, times: availableTimes }];
      }
      return [];
    });

    return { ...doctor, availability: filteredAvailability };
  }

  async update(id: string, updateDoctorDto: UpdateDoctorDto): Promise<Doctor> {
    const existingDoctor = await this.doctorModel
      .findByIdAndUpdate(id, updateDoctorDto, { new: true })
      .exec();

    if (!existingDoctor) {
      throw new NotFoundException(`Médico com ID "${id}" não encontrado`);
    }
    return existingDoctor;
  }

  async remove(id: string): Promise<any> {
    const result = await this.doctorModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Médico com ID "${id}" não encontrado`);
    }
    return { message: 'Médico removido com sucesso' };
  }
}
