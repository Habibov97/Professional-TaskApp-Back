import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guard/auth.guard';
import type { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard)
  me(@Req() req: Request) {
    return this.userService.me(req['user'].userId);
  }
}
