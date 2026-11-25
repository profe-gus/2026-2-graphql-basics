import { Field, Int, InputType } from "@nestjs/graphql";

@InputType()
export class GradeInput {

    @Field(() => String)
    subject: string;

    @Field(() => Int)
    grade: number;
}
