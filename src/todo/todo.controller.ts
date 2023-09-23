import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { TodoService } from './todo.service';
import { GetUser } from '../auth/decorator';
import { InsertTodoDTO } from './dto/insert.todo.dto';
import { UpdateTodoDTO } from './dto';

@Controller('todo')
export class TodoController {
    constructor(private todoService: TodoService) { }

    @Get()
    getTodos(@GetUser('id') userId: number) {
        return this.todoService.getTodos(userId)
    }

    @Get(':id')
    getTodoById(@Param('id') todoId: number) {
        return this.todoService.getTodoById(todoId)
    }

    @Post()
    addTodo(
        @GetUser('id') userId: number,
        @Body() insertTodoDTO: InsertTodoDTO
    ) {
        return this.todoService.addTodo(userId, insertTodoDTO)
    }

    @Patch()
    updateTodoById(
        @Param('id', ParseIntPipe) todoId: number,
        @Body() updateTodoDTO: UpdateTodoDTO
    ) {
        return this.todoService.updateTodoById(todoId, updateTodoDTO)

    }

    @Delete()
    deleteTodoById(@Param('id', ParseIntPipe) todoId: number) {
        return this.todoService.deleteTodoById(todoId)
    }

}
