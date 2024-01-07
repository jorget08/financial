import { IsJWT } from 'class-validator';

export class AuthGoogleDto {
  @IsJWT()
  idToken: string;
}
