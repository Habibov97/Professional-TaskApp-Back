import { ForbiddenException, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/entities/category.entity';
import { IsNull, Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class CategoryService implements OnModuleInit {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepo: Repository<CategoryEntity>,
    private readonly userService: UserService,
  ) {}

  async onModuleInit() {
    const count = await this.categoryRepo.count();
    if (count === 0) {
      const defaultCategories = [
        {
          title: 'Task Status',
        },
        {
          title: 'Task Priority',
        },
      ];
      const entities = this.categoryRepo.create(defaultCategories);
      await this.categoryRepo.save(entities);
    }
  }

  async list() {
    return this.categoryRepo.find({
      where: { parentId: IsNull() },
      relations: { children: true },
    });
  }

  async create(userId: string, body: CreateCategoryDto) {
    const { user } = await this.userService.me(userId);
    if (user.role !== 'admin') {
      throw new ForbiddenException('Only admin can create task action');
    }
    const parent = await this.categoryRepo.findOne({
      where: {
        id: body.parentId,
        parentId: IsNull(),
      },
    });

    if (!parent) {
      throw new ForbiddenException(
        'Parent category not found or it is not a root category',
      );
    }

    const category = this.categoryRepo.create(body);

    await this.categoryRepo.save(category);

    return {
      success: true,
      message: 'Category has been created successfully',
    };
  }

  async update(userId: string, id: string, body: UpdateCategoryDto) {
    const { user } = await this.userService.me(userId);
    if (user.role !== 'admin') {
      throw new ForbiddenException('Only admin can update task categories');
    }
    const category = await this.categoryRepo.findOne({
      where: { id },
    });

    if (!category) {
      throw new ForbiddenException('Category not found');
    }

    category.title = body.title as string;

    await this.categoryRepo.save(category);

    return {
      success: true,
      message: 'Category has been updated successfully',
    };
  }

  async remove(userId: string, id: string) {
    const { user } = await this.userService.me(userId);
    if (user.role !== 'admin') {
      throw new ForbiddenException('Only admin can delete task categories');
    }
    await this.categoryRepo.delete({ id });

    return {
      success: true,
      message: 'Category has been deleted successfully',
    };
  }
}
