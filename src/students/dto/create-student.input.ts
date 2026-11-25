import { IsPositive, IsEmail, IsIn, IsOptional, IsString, IsBoolean } from "class-validator";
import { GradeInput } from "./grade.input";
import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class CreateStudentInput{


    @Field(()=> String)
    @IsString()
    name: string;

    @Field(()=> Int)
    @IsPositive()
    age: number;

    @Field(()=> String)
    @IsEmail()
    email: string;

    @Field(()=> Boolean)
    @IsBoolean()
    isActive: boolean;

    @Field(()=> String)
    @IsIn(['Male', 'Female', 'Other'])
    gender: string;

    @Field(()=> [String])
    @IsOptional()
    favoriteSubjects: string[];


    @Field(()=> [GradeInput], { nullable: true })
    @IsOptional()
    grades?: GradeInput[];
}

