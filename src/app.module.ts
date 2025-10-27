import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'tristangory',
      password: '',
      database: 'lighthouse',
      entities: [],
      synchronize: true, // auto sync schema (disable in production)
    }),
  ], // modules go here
  controllers: [], // controllers go here
  providers: [], // services go here
})
export class AppModule {}
