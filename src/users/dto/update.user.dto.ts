import { IsString, IsEmail, IsOptional } from 'class-validator';

export class UpdateUserDTO {
    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    userName?: string;

    @IsString()
    @IsOptional()
    oldPassword?: string;


    @IsString()
    @IsOptional()
    password?: string;

}


