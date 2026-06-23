import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskEntity } from 'src/entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from 'src/entities/category.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepo: Repository<TaskEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepo: Repository<CategoryEntity>,
    private readonly userService: UserService,
  ) {}

  private async validateStatusId(statusId: string) {
    const status = await this.categoryRepo.findOne({
      where: { id: statusId },
      relations: { parent: true },
    });

    if (!status || status.parent?.title !== 'Task Status') {
      throw new BadRequestException('Invalid statusId');
    }
  }

  private async validatePriorityId(priorityId: string) {
    const priority = await this.categoryRepo.findOne({
      where: { id: priorityId },
      relations: { parent: true },
    });

    if (!priority || priority.parent?.title !== 'Task Priority') {
      throw new BadRequestException('Invalid priorityId');
    }
  }

  private async assertOwnershipOrAdmin(task: TaskEntity, userId: string) {
    if (task.userId === userId) return;

    const { user } = await this.userService.me(userId);
    if (user.role !== 'admin') {
      throw new NotFoundException('Task not found');
    }
  }

  async create(userId: string, body: CreateTaskDto) {
    await Promise.all([
      this.validateStatusId(body.statusId),
      this.validatePriorityId(body.priorityId),
    ]);

    const task = this.taskRepo.create({ ...body, userId });
    await this.taskRepo.save(task);

    const fullTask = await this.taskRepo.findOne({
      where: { id: task.id },
      relations: { status: true, priority: true },
    });

    return {
      success: true,
      message: 'Task has been created successfully',
      data: fullTask,
    };
  }

  async findAll() {
    const tasks = await this.taskRepo.find({
      order: { createdAt: 'DESC' },
    });

    return {
      success: true,
      data: tasks,
    };
  }

  async findOne(userId: string, taskId: string) {
    const task = await this.taskRepo.findOne({
      where: { id: taskId },
      relations: { status: true, priority: true },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.assertOwnershipOrAdmin(task, userId);

    return {
      success: true,
      data: task,
    };
  }

  async update(userId: string, taskId: string, body: UpdateTaskDto) {
    const task = await this.taskRepo.findOne({ where: { id: taskId } });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.assertOwnershipOrAdmin(task, userId);

    const validations: Promise<void>[] = [];
    if (body.statusId) validations.push(this.validateStatusId(body.statusId));
    if (body.priorityId)
      validations.push(this.validatePriorityId(body.priorityId));
    await Promise.all(validations);

    this.taskRepo.merge(task, body);
    await this.taskRepo.save(task);

    const fullTask = await this.taskRepo.findOne({
      where: { id: task.id },
      relations: { status: true, priority: true },
    });

    return {
      success: true,
      message: 'Task has been updated successfully',
      data: fullTask,
    };
  }

  async remove(userId: string, taskId: string) {
    const task = await this.taskRepo.findOne({ where: { id: taskId } });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.assertOwnershipOrAdmin(task, userId);

    await this.taskRepo.remove(task);

    return {
      success: true,
      message: 'Task has been deleted successfully',
    };
  }
}
