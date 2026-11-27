import { IsString, IsEmail, MinLength, MaxLength } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class Login {
    @IsString()
    @IsEmail()
    @Field(()=> String)
    email: string;

    @IsString()
    @MinLength(8)
    @MaxLength(16)
    @Field(()=> String)
    password: string;
}
