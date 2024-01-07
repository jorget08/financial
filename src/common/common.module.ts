import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { CommonService } from './common.service';
import { SequelizeConfigService } from './database/connection';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [SequelizeConfigService, CommonService],
  exports: [SequelizeConfigService, CommonService],
})
export class CommonModule {}
