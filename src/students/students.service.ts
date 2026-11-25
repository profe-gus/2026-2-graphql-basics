import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateStudentInput } from './dto/create-student.input';
import { UpdateStudentInput } from './dto/update-student.input';
import { PaginationInput } from './dto/pagination.input';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import { Repository, DataSource } from 'typeorm';
import { Grades } from './entities/grades.entity';
import { Student } from './entities/student.entity';

@Injectable()
export class StudentsService {

    private readonly logger = new Logger("StudentService");

    constructor(
        @InjectRepository(Grades)
        private readonly gradesRepository: Repository<Grades>,
        @InjectRepository(Student)
        private readonly studentRepository: Repository<Student>,
        private datasource: DataSource
    ){}

    async createStudent(createStudentInput: CreateStudentInput): Promise<Student | undefined>{
        try{
            const {grades = [], ...studentDetails} = createStudentInput;
            const student = this.studentRepository.create({
                ...studentDetails,
                grades: grades.map( grade => this.gradesRepository.create(grade))
            });
            await this.studentRepository.save(student);
            return student;
        }catch(error){
            this.handleException(error);
        }
    }

    async findAll(paginationInput: PaginationInput){
        try{
            const {skip, limit} = paginationInput;
            return await this.studentRepository.find({
                take: limit,
                skip: skip
            });
        }catch(error){
            this.handleException(error);
        }
    }

    async findOne(term: string){
        let student: Student | null;
        try{
            if(isUUID(term)) {
                student = await this.studentRepository.findOneBy({ id: term});
            }else{
                const queryBuilder = this.studentRepository.createQueryBuilder("student");
                student = await queryBuilder.where("UPPER(name)=:name or nickname=:nickname", {
                    name: term.toUpperCase(),
                    nickname: term.toLowerCase()
                })
                .leftJoinAndSelect("student.grades", "studentGrades")
                .getOne()
            }
            
            if(!student)
                throw new NotFoundException(`Student with ${term} not found`);

            return student;

        }catch(error){
            this.handleException(error);
        }
    }

    async updateV2(id: string, updateStudentInput : UpdateStudentInput){
        const {grades, ...studentDetails} = updateStudentInput;
        const student = await this.studentRepository.preload({
            id: id,
            ...studentDetails
        })

        if(!student) throw new NotFoundException(`Student with id ${id} not found`);

        const queryRunner = this.datasource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try{
            if(grades){
                // 1. Traer las notas que el estudiante tiene hoy
                const currentGrades = await queryRunner.manager.find(Grades, {
                    where : { student: {id} 
                }
                })

                // 2. Combinar: actualizar las notas que existen, agregar las nuevas si llegan nuevas
                for ( const newGrade of grades){
                    const existing = currentGrades.find(
                        grade => grade.subject.toLowerCase() === newGrade.subject.toLowerCase());

                        if(existing) {
                            existing.grade = newGrade.grade;
                        }else{
                            currentGrades.push(this.gradesRepository.create({
                                subject: newGrade.subject,
                                grade: newGrade.grade
                            }))
                        }
    
                    }
                    // 3. Guardar la lista de notas compelta : no queda ninguna nota huerfana
                    student.grades = currentGrades;
            }

            await queryRunner.manager.save(student);
            await queryRunner.commitTransaction();
            await queryRunner.release();

            return await this.findOne(student.id);

        }catch(error){
            await queryRunner.rollbackTransaction();
            await queryRunner.release();
            this.handleException(error);
        }
    }

    async update(id: string, updateStudentInput: UpdateStudentInput){
        const {grades, ...studentDetails} = updateStudentInput;
        const student = await this.studentRepository.preload({
            id: id,
            ...studentDetails
        })

        if(!student) throw new NotFoundException(`Student with id ${id} not found`);

        const queryRunner = this.datasource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try{
            if(grades){
                student.grades = grades.map( grade => this.gradesRepository.create(grade));
                await queryRunner.manager.delete(Grades, {student:{id}});

            }

            await queryRunner.manager.save(student);
            await queryRunner.commitTransaction();
            await queryRunner.release();

            return await this.findOne(student.id);

        }catch(error){
            await queryRunner.rollbackTransaction();
            await queryRunner.release();
            this.handleException(error);
        }

    }

    async removeStudent(id: string){
        const student = await this.findOne(id);
        if(!student) throw new NotFoundException(`Student with id ${id} not found`);
        await this.studentRepository.remove(student);
    }

    deleteAllStudents(){
    const query = this.studentRepository.createQueryBuilder();
    try{
      return query.delete()
                        .execute();
    }catch(error){
      this.handleException(error);
    }
  }

    private handleException(error:any){
        this.logger.error(error);
        if(error.code === '23505'){
            throw new InternalServerErrorException(error.detail);
        }
    }
}

