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
        // Validar usuario y contraseña
        const validUser = await this.validateUser(credentials.email, credentials.password);
        if (!validUser) {
            throw new UnauthorizedException('Credenciales incorrectas!');
        }

        // Obtener el usuario completo desde la base de datos
        const user = await this.userService.findByEmail(validUser.email);

        if (!user) {
            throw new NotFoundException('Usuario no encontrado en base de datos.');
        }

        // Construir el payload completo para el token
        const payload = {
            id: user.id,
            username: user.username,
            email: user.email,
            avatar_url: user.avatar ?? '',
            bio: user.biography ?? '',
            stats: {
                booksRead: user.books_read ?? 0,
                reviewsCount: user.reviews_written ?? 0,
                followersCount: user.followers_count ?? 0,
                followingCount: user.following_count ?? 0,
            }
        };

        // Retornar respuesta con el token
        return {
            success: true,
            token: this.jwtService.sign(payload),
        };
    }


    async register(createUserDto: SignUpDto) {
        // Crear el usuario en la base de datos
        const user = await this.userService.create(createUserDto);

        // Construir el payload completo
        const payload = {
            id: user.id,
            username: user.username,
            email: user.email,
            avatar_url: user.avatar ?? '',
            bio: user.biography ?? '',
            stats: {
                booksRead: user.books_read ?? 0,
                reviewsCount: user.reviews_written ?? 0,
                followersCount: user.followers_count ?? 0,
                followingCount: user.following_count ?? 0,
            }
        };

        // Retornar respuesta con el token
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