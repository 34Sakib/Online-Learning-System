import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  gender: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  dateOfBirth: string;

  @IsString()
  @IsNotEmpty()
  role: string;
}
