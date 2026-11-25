import { Field, InputType, Int } from "@nestjs/graphql";
import { IsOptional, IsPositive, Min } from "class-validator";

@InputType()
export class PaginationInput{
    
    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsPositive()
    limit:number;


    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsPositive()
    @Min(0)
    skip:number;
}
