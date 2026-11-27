import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class Register {
    @IsString()
    @IsEmail()
    @Field(()=> String)
    email: string;

    @IsString()
    @MinLength(8)
    @MaxLength(16)
    @Field(()=> String)
    password:string;

    @IsString()
    @Field(()=> String)
    fullName:string;
}
