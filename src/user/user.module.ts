import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserResolver } from './user.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({defaultStrategy : 'jwt'}),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService : ConfigService) => {
        return {
          secret: configService.get("JWT_SECRET"),
          signOptions: {
            expiresIn: '1h'
          }
        }
      }
    })
  ],
  providers: [UserResolver, UserService, ConfigService, JwtStrategy],
   exports: [TypeOrmModule, PassportModule, JwtModule, JwtStrategy]
})
export class UserModule {}
