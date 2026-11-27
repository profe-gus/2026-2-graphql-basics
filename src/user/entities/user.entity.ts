import { Field, ObjectType } from "@nestjs/graphql";
import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@ObjectType()
export class User {
    @PrimaryGeneratedColumn("uuid")
    @Field(()=> String)
    id:string;

    @Column({
        type: "text",
        unique: true
    })
    @Field(()=> String)
    email:string;

    @Column({
        type: "text"
    })
    @Field(()=> String)
    password?:string;

    @Column({
        type: "text",
    })
    @Field(()=> String)
    fullName:string;

    @Column("bool", {default: true})
    @Field(()=> Boolean)
    isActive: boolean;

    @Column({
        type: "text",
        array: true,
        default: ["teacher"]
    })
    @Field(()=> [String])
    roles: string[];

    @BeforeInsert()
    @BeforeUpdate()
    checkEmailBeforeChanges(){
        this.email = this.email.toLowerCase().trim();
    }
}
