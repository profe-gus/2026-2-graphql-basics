import { applyDecorators, UseGuards } from "@nestjs/common";
import { ValidRoles } from "../enums/valid-roles.enum";
import { RoleProtected } from "./role-protected/role-protected.decorator";
import { UserRoleGuard } from "../guards/user-role/user-role.guard";
import { GraphQlAuthGuard } from "../guards/graph-auth/graph-auth.guard";

export function Auth(...roles: ValidRoles[]){
    return applyDecorators(
        RoleProtected(...roles),
        UseGuards(GraphQlAuthGuard, UserRoleGuard)
    )
}
