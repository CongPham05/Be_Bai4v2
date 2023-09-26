import { PrismaService } from './../prisma/prisma.service';
import { Injectable, HttpStatus } from '@nestjs/common';
import { InsertTodoDTO, UpdateTodoDTO } from './dto';

@Injectable()
export class TodoService {

    constructor(private prismaService: PrismaService) { }


    async getTodos(userId: number) {
        const todos = await this.prismaService.todo.findMany({
            where: { userId: userId },
            select: {
                id: true,
                content: true,
                description: true,
                statusId: true,
                priorityId: true,
                sizeId: true,
                userId: true
            }
        })
        return {
            status: HttpStatus.OK,
            todos
        };
    }

    async getTodoById(todoId: number) {

    }

    async addTodo(userId: number, insertTodoDTO: InsertTodoDTO) {
        const result = await this.prismaService.todo.create({
            data: {
                content: insertTodoDTO.content,
                description: insertTodoDTO.description,
                statusId: insertTodoDTO?.statusId,
                priorityId: insertTodoDTO?.priorityId,
                sizeId: insertTodoDTO?.sizeId,
                userId,
            },
        })
        delete (result.createdAt)
        delete (result.updatedAt)
        return {
            status: HttpStatus.OK,
            message: "Add todo successfully",
            result
        };
    }


    async updateTodoById(todoId: number, updateTodoDTO: UpdateTodoDTO) {
        const res = await this.prismaService.todo.update({
            where: {
                id: todoId
            },
            data: {
                content: updateTodoDTO.content,
                description: updateTodoDTO.description,
                statusId: updateTodoDTO.statusId,
                priorityId: updateTodoDTO.priorityId,
                sizeId: updateTodoDTO.sizeId,
            }
        })
        return {
            message: "Save successfully",
            status: HttpStatus.OK,
            res
        };
    }
    async deleteTodoById(todoId: number) {
        await this.prismaService.todo.delete({
            where: {
                id: todoId
            }
        })
        return {
            status: HttpStatus.OK,
            message: "Deleted successfully",
        };
    }
    async deleteTodoByStatusId(statusId: string) {
        await this.prismaService.todo.deleteMany({
            where: {
                statusId: statusId
            }
        })
        return {
            status: HttpStatus.OK,
            message: "Deleted successfully",
        };
    }
}
