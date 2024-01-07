import { join } from 'path';
import { Module } from '@nestjs/common';
import EnvConfig from './config/app.config';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CommonModule } from './common/common.module';
import { SequelizeConfigService } from './common/database/connection';
import { DBs } from './common/interfaces';
import { IncomeModule } from './income/income.module';
import { ExpensesModule } from './expenses/expenses.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // Environments
    ConfigModule.forRoot({
      load: [EnvConfig],
      isGlobal: true,
    }),

    // Public & static module
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'public'),
    }),

    // Database
    SequelizeModule.forRootAsync({
      imports: [CommonModule],
      useClass: SequelizeConfigService,
      name: DBs.main,
    }),

    IncomeModule,

    ExpensesModule,

    UsersModule,

    CategoriesModule,

    AuthModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
