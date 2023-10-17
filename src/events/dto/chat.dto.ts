import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class ChatDTO {
    @IsString()
    @IsNotEmpty()
    content: string
}