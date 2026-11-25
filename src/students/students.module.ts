import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsResolver } from './students.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grades } from './entities/grades.entity';
import { Student } from './entities/student.entity';

@Module({
  imports:[
        TypeOrmModule.forFeature([Student, Grades]),
  ],
  providers: [StudentsResolver, StudentsService],
})
export class StudentsModule {}
