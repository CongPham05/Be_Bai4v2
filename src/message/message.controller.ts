import { Body, Controller, Get, Post, ParseIntPipe, Param, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageDTO } from './dto';
import { AccessJwtGruard } from 'src/auth/guard';

@UseGuards(AccessJwtGruard)
@Controller('message')
export class MessageController {
    constructor(private messageService: MessageService) { }

    @Post()
    addMessage(@Body() messageDTO: MessageDTO) {
        return this.messageService.addMessage(messageDTO)
    }

    @Get(":chatId")
    getMessages(@Param("chatId", ParseIntPipe) chatId: number) {
        return this.messageService.getMessages(chatId)
    }
}
