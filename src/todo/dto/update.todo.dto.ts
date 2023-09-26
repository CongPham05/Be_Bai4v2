import { IsNumber, IsOptional, IsString } from "class-validator"

export class UpdateTodoDTO {
    @IsString()
    @IsOptional()
    content?: string

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