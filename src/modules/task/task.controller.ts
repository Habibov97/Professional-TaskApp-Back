import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import Request from 'express';
import { AuthGuard } from '../auth/guard/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard)
  @Post()
  create(@Req() req: Request, @Body() body: CreateTaskDto) {
    return this.taskService.create(req['user'].userId, body);
  }

  @Get()
  findAll(@Req() req: Request) {
    return this.taskService.findAll(req['user'].id);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    return this.taskService.findOne(req.user.userId, id);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() body: UpdateTaskDto,
  ) {
    return this.taskService.update(req['user'].userId, id, body);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard)
  @Delete(':id')
  delete(@Req() req, @Param('id') id: string) {
    return this.taskService.remove(req['user'].userId, id);
  }
}
