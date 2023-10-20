import { IsInt, IsNotEmpty, IsString, isInt } from "class-validator"

export class ChatDTO {
    @IsInt()
    @IsNotEmpty()
    senderId: number

    @IsInt()
    @IsNotEmpty()
    receiverId: number
}