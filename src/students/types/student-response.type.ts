import { ObjectType } from "@nestjs/graphql";
import { Student } from "../entities/student.entity";

@ObjectType()
export class StudentResponse extends Student{}