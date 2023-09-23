import { Injectable } from '@nestjs/common';
import { InsertTodoDTO, UpdateTodoDTO } from './dto';

@Injectable()
export class TodoService {


    async getTodos(userId: number) {

    }

    async getTodoById(todoId: number) {

    }


    async addTodo(userId: number, insertTodoDTO: InsertTodoDTO
    ) {

    }


    async updateTodoById(todoId: number, updateTodoDTO: UpdateTodoDTO
    ) {

    }

    async deleteTodoById(todoId: number) {

    }
}
