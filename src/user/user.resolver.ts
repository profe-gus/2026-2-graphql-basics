import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { AuthResponse } from './dto/auth-response.input';
import { Register } from './dto/register.input';
import { Login } from './dto/login.input';

@Resolver('User')
export class UserResolver {
  constructor(private readonly usersService: UserService) {}


   @Mutation(()=> AuthResponse, { name: 'signup'})
  async signup(
    @Args("signupInput") signupInput: Register
  ){
    return await this.usersService.create(signupInput);
  }

  @Mutation(()=> AuthResponse, {name:"login"})
  async login(@Args('loginInput') loginInput: Login) {
    return await this.usersService.login(loginInput)
  }


}
