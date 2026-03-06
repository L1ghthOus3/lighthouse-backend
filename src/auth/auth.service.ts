import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dtos/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { RegisterDto } from './dtos/register.dto';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async createUser(dto: RegisterDto): Promise<{
    username: string;
    id: string;
    jwt: string;
  }> {
    const existingUser = await this.userRepository.findOne({
      where: { username: dto.username },
    });
    const existingUsername = await this.userRepository.findOne({
      where: { username: dto.username },
    });

    if (existingUser || existingUsername) {
      throw new BadRequestException('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    const newUser = this.userRepository.create({
      username: dto.username,
      password: passwordHash,
    });

    await this.userRepository.save(newUser);
    const payload = { username: newUser.username, sub: newUser.id };
    const jwt = await this.jwtService.signAsync(payload);
    return {
      username: newUser.username,
      id: newUser.id,
      jwt,
    };
  }

  async login(dto: LoginUserDto): Promise<{
    user: User;
    jwt: string;
  }> {
    const user = await this.userRepository.findOne({
      where: { username: dto.username },
      relations: ['guild', 'invitations', 'guild.members'],
    });
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload = { username: user.username, sub: user.id };
    const jwt = await this.jwtService.signAsync(payload);
    return {
      user,
      jwt,
    };
  }
}
