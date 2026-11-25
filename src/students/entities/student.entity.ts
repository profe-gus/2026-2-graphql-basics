import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Grades } from "./grades.entity";
import { Field, ID, Int, ObjectType } from "@nestjs/graphql";

@Entity()
@ObjectType()
export class Student {



    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
    id:string;


    @Field(() => String)
    @Column("text")
    name:string;


    @Field(() => Int, { nullable: true })
    @Column({
        type: "int",
        nullable: true
    })
    age:number;


    @Field(() => String)
    @Column({
        type: "text",
        unique: true
    })
    email:string;


    @Field(() => Boolean)
    @Column("boolean")
    isActive: boolean;


    @Field(() => String)
    @Column("text")
    gender: string;


    @Field(() => [String])
    @Column({
        type: "text",
        array: true
    })
    favoriteSubjects:string[];


    @Field(() => String)
    @Column("text")
    nickname: string;


    @Field(() => [Grades], { nullable: true })
    @OneToMany(
        ()=> Grades,
        (grade) => grade.student,
        {cascade: true, eager: true}
    )
    grades?: Grades[]

    @BeforeInsert()
    checkNicknameInsert(){
        if(!this.nickname){
            this.nickname = this.name
        }
        this.nickname = this.nickname.toLowerCase()
                        .replaceAll(" ","_")
                        +this.age
    }

    @BeforeUpdate()
    checkNicknameUpdate(){
        this.nickname = this.nickname.toLowerCase()
                        .replaceAll(" ","_")
                        +this.age
    }

}
