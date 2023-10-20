import { IsInt, IsNotEmpty, IsString, isInt } from "class-validator"

export class MessageDTO {
    @IsInt()
    @IsNotEmpty()
    chatId: number

    @IsInt()
    @IsNotEmpty()
    senderId: number

    @IsString()
    @IsNotEmpty()
    text: string
}