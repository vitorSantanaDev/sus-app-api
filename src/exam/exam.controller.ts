import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
  Delete,
} from '@nestjs/common';
import { ExamService } from './exam.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';

@UseGuards(JwtAuthGuard)
@Controller('exams')
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Post()
  create(@Body() createExamDto: CreateExamDto, @Request() req) {
    const userId = req.user.userId as string;
    return this.examService.create(createExamDto, userId);
  }

  @Get()
  findAll(@Request() req) {
    const userId = req.user.userId as string;
    return this.examService.findAllForUser(userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string, @Request() req) {
    const userId = req.user.userId as string;
    return this.examService.findOneForUser(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateExamDto: UpdateExamDto,
    @Request() req,
  ) {
    const userId = req.user.userId as string;
    return this.examService.updateForUser(id, updateExamDto, userId);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string, @Request() req) {
    const userId = req.user.userId as string;
    return this.examService.removeForUser(id, userId);
  }
}
