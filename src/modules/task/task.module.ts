import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from 'src/entities/task.entity';
import { CategoryEntity } from 'src/entities/category.entity';
import { AuthGuard } from '../auth/guard/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
    JwtModule,
    TypeOrmModule.forFeature([TaskEntity, CategoryEntity]),
  ],
  controllers: [TaskController],
  providers: [TaskService, AuthGuard],
})
export class TaskModule {}
