import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class InsertTodoDTO {
    @IsString()
    @IsNotEmpty()
    title: string

    @IsString()
    @IsOptional()
    description?: string


}