import { Body, Controller, Get, Post, ParseIntPipe, Param } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageDTO } from './dto';

@Controller('message')
export class MessageController {
    constructor(private messageService: MessageService) { }

    @Post()
    addMessage(@Body() messageDTO: MessageDTO) {
        console.log(messageDTO)
        return this.messageService.addMessage(messageDTO)
    }

    @Get(":chatId")
    getMessages(@Param("chatId", ParseIntPipe) chatId: number) {
        return this.messageService.getMessages(chatId)
    }
}
