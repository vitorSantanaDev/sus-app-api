import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { HealthUnitService } from './health-unit.service';
import { CreateHealthUnitDto } from './dto/create-health-unit.dto';
import { UpdateHealthUnitDto } from './dto/update-health-unit.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';

@Controller('health-units')
export class HealthUnitController {
  constructor(private readonly healthUnitService: HealthUnitService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createHealthUnitDto: CreateHealthUnitDto) {
    return this.healthUnitService.create(createHealthUnitDto);
  }

  @Get(':id/exams')
  getExamsForUnit(@Param('id', ParseMongoIdPipe) id: string) {
    return this.healthUnitService.getAvailableExams(id);
  }

  @Get()
  findAll() {
    return this.healthUnitService.findAll();
  }

  @Get('with-exams')
  findWithExams() {
    return this.healthUnitService.findWithExams();
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.healthUnitService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateHealthUnitDto: UpdateHealthUnitDto,
  ) {
    return this.healthUnitService.update(id, updateHealthUnitDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.healthUnitService.remove(id);
  }
}
