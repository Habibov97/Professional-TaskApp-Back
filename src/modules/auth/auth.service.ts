import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import bcrpyt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
  ) {}

  async register(body: RegisterDto) {
    const user = await this.userRepo.exists({
      where: { userName: body.userName, email: body.email },
    });
    if (user) throw new ConflictException('User already exists');

    const newUser = this.userRepo.create(body);
    await this.userRepo.save(newUser);

    return {
      message: 'User created successfully',
    };
  }

  async login(body: LoginDto) {
    const user = await this.userRepo.findOne({
      where: { userName: body.userName },
    });

    if (!user) throw new UnauthorizedException('User or password invalid');

    const passwordCompare = await bcrpyt.compare(body.password, user.password);
    if (!passwordCompare)
      throw new UnauthorizedException('User or password invalid');

    const { accessToken, refreshToken } = await this.generateTokens(user.id);

    user.refreshToken = refreshToken;
    await this.userRepo.save(user);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string) {
    //1. Tokeni verify et
    let payload: { userId: string };
    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('jwtRefresh.secret'),
      });
    } catch {
      throw new UnauthorizedException('Unauthorized');
    }
    //2. Useri dbde tap
    const user = await this.userRepo.findOne({ where: { id: payload.userId } });
    if (!user || !user.refreshToken)
      throw new UnauthorizedException('Access Denied!');

    //3. Gelen token ile DB-dekini muqayise et
    const checkRefreshTokenMatch = await bcrpyt.compare(
      refreshToken,
      user.refreshToken,
    );
    if (!checkRefreshTokenMatch)
      throw new UnauthorizedException('Access Denied!');

    //4. Yeni Tokenler Yarat
    const { accessToken, refreshToken: newRefreshToken } =
      await this.generateTokens(user.id);

    user.refreshToken = newRefreshToken;
    await this.userRepo.save(user);

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('Access denied!');

    user.refreshToken = '';

    await this.userRepo.save(user);
  }

  private async generateTokens(userId: string) {
    const accessToken = this.jwtService.sign({ userId });

    const refreshToken = this.jwtService.sign(
      { userId },
      {
        secret: this.configService.get<string>('jwtRefresh.secret'),
        expiresIn: this.configService.get<string>(
          'jwtRefresh.expiresIn',
        ) as any,
      },
    );
    return { accessToken, refreshToken };
  }
}
