import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { TodoService } from './todos.service';
import { GetUser } from '../auth/decorator';
import { InsertTodoDTO } from './dto/insert.todo.dto';
import { UpdateTodoDTO } from './dto';
import { AccessJwtGruard } from 'src/auth/guard';


@UseGuards(AccessJwtGruard)
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

    @Patch(':id')
    updateTodoById(
        @Param('id', ParseIntPipe) todoId: number,
        @Body() updateTodoDTO: UpdateTodoDTO
    ) {
        console.log({ todoId, updateTodoDTO })
        return this.todoService.updateTodoById(todoId, updateTodoDTO)
    }

    @Delete(':id')
    deleteTodoById(@Param('id', ParseIntPipe) todoId: number) {
        return this.todoService.deleteTodoById(todoId)
    }

    @Delete('status/:id')
    deleteTodoByStatusId(@Param('id') statusId: string) {
        return this.todoService.deleteTodoByStatusId(statusId)
    }

}
