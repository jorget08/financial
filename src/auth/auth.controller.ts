import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGoogleDto } from './dto/auth-google.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  create(@Body() createAuthDto: AuthGoogleDto) {
    return this.authService.loginWithGoogle(createAuthDto.idToken);
  }
}
