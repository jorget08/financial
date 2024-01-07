import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
    ),
  ) {}
  async loginWithGoogle(googleToken: string) {
    const verify = await this.verifyTokenGoogle(googleToken);

    const create = {
      name: verify.name,
      email: verify.email,
    };

    return await this.userService.create(create);
  }

  async verifyTokenGoogle(token: string) {
    try {
      const user = await this.client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      // Verify email validation
      if (!user.getPayload().email_verified) throw new UnauthorizedException();

      const userResponse = {
        email: user.getPayload().email,
        name: user.getPayload().name,
      };

      return userResponse;
    } catch (error) {
      throw new HttpException({ message: error }, HttpStatus.BAD_REQUEST);
    }
  }
}
