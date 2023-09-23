import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class UpdateUserDTO {
    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    userName?: string;
}


