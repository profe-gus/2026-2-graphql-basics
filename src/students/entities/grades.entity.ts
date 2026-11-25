import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Student } from "./student.entity";
import { Field, ID, Int, ObjectType } from "@nestjs/graphql";

@Entity()
@ObjectType()
export class Grades {

    @Field(() => ID, { nullable: true })
    @PrimaryGeneratedColumn("uuid")
    id?:string;


    @Field(() => String)
    @Column("text")
    subject:string;


    @Field(() => Int)
    @Column("int")
    grade: number;

    @ManyToOne(
        () => Student,
        (student) => student.grades,
        { onDelete: "CASCADE"}
    )
    student?: Student;
    
}
