import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaginationWithSearchLoginAndEmailTerm } from '../../../base/models/pagination.base.model';
import { SortingPropertiesType } from '../../../base/types/sorting-properties.type';
import { UsersService } from '../application/users.service';
import { UsersQueryRepository } from '../infrastructure/users.query-repository';
import { UserCreateModel } from './models/input/create-user.input.model';
import { UserOutputModel } from './models/output/user.output.model';

export const USERS_SORTING_PROPERTIES: SortingPropertiesType<UserOutputModel> =
  ['login', 'email'];

// Tag для swagger
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersQueryRepository: UsersQueryRepository,
  ) { }

  @Get()
  async getAll(
    // Для работы с query
    @Query() query: any,
  ) {
    const pagination: PaginationWithSearchLoginAndEmailTerm =
      new PaginationWithSearchLoginAndEmailTerm(
        query,
        USERS_SORTING_PROPERTIES,
      );

    return this.usersQueryRepository.getAll(pagination);
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<UserOutputModel | null> {

    const user = this.usersQueryRepository.getById(id);

    if (user) return user
    else throw new NotFoundException(`User with id ${id} not found`);
  }

  @Post()
  async create(@Body() createModel: UserCreateModel) {
    const { login, password, email } = createModel;

    const createdUserId = await this.usersService.create(
      login,
      password,
      email,
    );

    return this.usersQueryRepository.getById(createdUserId);
  }

  // :id в декораторе говорит nest о том что это параметр
  // Можно прочитать с помощью @Param("id") и передать в property такое же название параметра
  // Если property не указать, то вернется объект @Param()
  @Delete(':id')
  // Для переопределения default статус кода https://docs.nestjs.com/controllers#status-code
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    const deletingResult: boolean = await this.usersService.delete(id);

    if (!deletingResult) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }
}
