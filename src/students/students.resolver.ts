import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { StudentsService } from './students.service';
import { CreateStudentInput } from './dto/create-student.input';
import { UpdateStudentInput } from './dto/update-student.input';
import { PaginationInput } from './dto/pagination.input';
import { StudentResponse } from './types/student-response.type';
import { Auth } from 'src/user/decorators/auth.decorator';
import { ValidRoles } from 'src/user/enums/valid-roles.enum';

@Resolver('Student')
export class StudentsResolver {
  constructor(private readonly studentsService: StudentsService) {}

  @Mutation(() => StudentResponse, { name: "createStudent"})
  @Auth(ValidRoles.admin, ValidRoles.teacher)
  create(@Args('createStudentInput') createStudentInput: CreateStudentInput){
    return this.studentsService.createStudent(createStudentInput);
  }

  @Query(() => [StudentResponse], { name: "students"})
  findAll(@Args('paginationInput') paginationInput: PaginationInput){
    return this.studentsService.findAll(paginationInput);
  }

  @Query(() => StudentResponse, { name: "student"})
  findOne(@Args('term', { type: () => String }) term: string){
    return this.studentsService.findOne(term);
  }

  @Mutation(() => StudentResponse, { name: "updateStudent"})
  @Auth(ValidRoles.teacher)
  update(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateStudentInput') updateStudentInput: UpdateStudentInput
  ){
    return this.studentsService.updateV2(id, updateStudentInput);
  }

  @Mutation(() => Boolean, { name: "removeStudent", nullable: true})
  @Auth(ValidRoles.superUser)
  async remove(@Args('id', { type: () => ID }) id: string): Promise<void>{
    await this.studentsService.removeStudent(id);
  }

}
