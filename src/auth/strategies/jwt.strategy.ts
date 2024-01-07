import { Dependencies, Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

import { AuthProperties } from '../interface/auth.interface';

@Dependencies(ConfigService)
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwtKey'),
    });
  }

  async validate(payload: AuthProperties): Promise<AuthProperties> {
    // Object to store on authorized requests (req.user)
    return {
      id: payload.id,
      email: payload.email,
      name: payload.name,
    };
  }
}
