import { IsNotEmpty, IsString } from "class-validator"

export class MessageDTO {
    @IsString()
    @IsNotEmpty()
    content: string
}