import { CommonService } from '../common.service';
import { Dependencies, Injectable } from '@nestjs/common';
import {
  SequelizeModuleOptions,
  SequelizeOptionsFactory,
} from '@nestjs/sequelize';
import { DBs } from '../interfaces';

@Dependencies(CommonService)
@Injectable()
export class SequelizeConfigService implements SequelizeOptionsFactory {
  constructor(private readonly commonService: CommonService) {}

  private readonly modules = [];

  createSequelizeOptions(): SequelizeModuleOptions {
    const port = this.commonService.getEnv<number>('dbPort');
    const host = this.commonService.getEnv<string>('dbHost');
    const password = this.commonService.getEnv<string>('dbPass');
    const username = this.commonService.getEnv<string>('dbUser');
    const database = this.commonService.getEnv<string>('db');

    // const migrate = this.modules.filter(
    //   (model) =>
    //   model != ViewClient &&
    //   model != ViewClientPoints &&
    //   model != ViewInventory &&
    //   model != ViewListPrice &&
    //   model != ViewListPriceSpecials &&
    //   model != ViewSales &&
    //   model != ViewCommercialAgreement &&
    //   model != ViewActivityChains
    // );
    const migrate = this.modules;

    const sequelizeOptions: SequelizeModuleOptions = {
      name: DBs.main,
      dialect: 'mssql',
      dialectOptions: {
        options: {
          encrypt: false,
          enableArithAbort: true,
          requestTimeout: 120000,
        },
      },
      models: [...this.modules],
      host,
      username,
      password,
      database,
      port,

      //DB Synchronization
      // autoLoadModels: true,
    };

    if (sequelizeOptions.autoLoadModels != undefined) {
      sequelizeOptions.hooks = {
        beforeBulkSync: async () => {
          for (const model of migrate) {
            await model.sync({
              alter: true,
            });
          }
        },
      };
    }

    return sequelizeOptions;
  }
}
