import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class AuthResponse {
    @Field(()=> String)
    id: string;

    @Field(()=> String)
    email: string;

    @Field(()=> String)
    token: string;
}

@ObjectType()
export class SignupResponse extends AuthResponse {
    @Field(()=> String)
    fullName: string;

    @Field(()=> Boolean)
    isActive: boolean;

    @Field(()=> [String])
    roles: string[];
}
