import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from 'src/user/user.service';
import { SignUpDto } from './dto/sign-up.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(credentials: LoginDto) {
    const user = await this.validateUser(credentials.email, credentials.password);
    if (!user) {
      throw new UnauthorizedException('Credenciales Incorrectas!');
    }

    const payload = { 
      id: user.id,
      username: user.username,
      email: user.email,
      avatar_url: user.avatar_url ?? '',
      created_at: user.created_at ?? new Date(0),
      bio: user.bio ?? '',
      following: user.following,
      stats: user.stats ?? {
        booksRead: 0,
        reviewsCount: 0,
        followersCount: 0,
        followingCount: 0,
      }
    };

    return {
      success: true,
      token: this.jwtService.sign(payload)
    };
  }

  async register(createUserDto: SignUpDto) {
    const user = await this.userService.create(createUserDto);
    //const { password, ...result } = user;

    const payload = { 
      id: user.id,
      username: user.username,
      email: user.email,
      avatar_url: '',
      created_at: new Date(0),
      bio: '',
      following: user.following,
      stats: {
        booksRead: 0,
        reviewsCount: 0,
        followersCount: 0,
        followingCount: 0,
      }
    };

    return {
      success: true,
      token: this.jwtService.sign(payload),
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.userService.findByEmail(resetPasswordDto.email!);
    if (!user) {
      throw new NotFoundException('Usuario no fue encontrado.');
    }

    const hashedPassword = await bcrypt.hash(resetPasswordDto.password!, 10);

    await this.userService.update(user.id!, {
    ...user,
    password: hashedPassword
  });
    return {
      success: true,
      message: 'Contraseña cambiada exitosamente!',
    };
  }

}