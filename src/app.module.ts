import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloDriverConfig, ApolloDriver} from "@nestjs/apollo"
import { join } from 'path';
import { GraphQLModule } from '@nestjs/graphql';
import { StudentsModule } from './students/students.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), "src/schema.gql")
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT!,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true //Solo usarla en ambientes bajos, no usar en prod
    }),
    StudentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
