import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class InsertTodoDTO {
    @IsString()
    @IsNotEmpty()
    content: string

    @IsString()
    @IsOptional()
    description?: string

    @IsString()
    @IsOptional()
    statusId?: string

    @IsString()
    @IsOptional()
    priorityId?: string

    @IsString()
    @IsOptional()
    sizeId?: string
}