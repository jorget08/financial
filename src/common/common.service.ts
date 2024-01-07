import { Model, ModelCtor } from 'sequelize-typescript';
import { isUUID } from 'class-validator';
import { Op } from 'sequelize';
import { ConfigService } from '@nestjs/config';
import {
  BadRequestException,
  Dependencies,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { EnvName } from '../config/app.config';
import { IFindByTermOptions, IPagination } from './interfaces';

@Dependencies(ConfigService)
@Injectable()
export class CommonService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Get the value of a configuration variable with the given name from the
   * environment, cast to type T.
   *
   * @template T The type to cast the configuration variable to
   * @param {EnvName} name The name of the configuration variable to get
   * @returns {T} The value of the configuration variable cast to type T
   */
  getEnv<T>(name: EnvName): T {
    return this.configService.get<T>(name);
  }

  /**
   * Search data based on id or key.
   * @param model - The sequelize model.
   * @param options - The configuration that will be taken into account when making the query.
   * @returns A promise with the object representing the query result.
   */
  async findByIdOrKey<T extends Model>(
    model: ModelCtor<T>,
    options: IFindByTermOptions,
  ): Promise<T> {
    const {
      nameModel = '',
      include = [],
      term = '',
      scope,
      paranoid = true,
    } = options;
    let obj: T;
    if (isUUID(term)) {
      obj = await model.scope(scope).findByPk(term, {
        include,
        paranoid,
      });

      if (!obj)
        throw new NotFoundException(`${nameModel} with ID '${term}' not found`);
    } else {
      obj = await model.scope(scope).findOne({
        include,
        paranoid,
        where: { key: term },
      });

      if (!obj)
        throw new NotFoundException(
          `${nameModel} with key '${term}' not found`,
        );
    }

    return obj;
  }

  /**
   * Finds all data based on an array of properties.
   * @param model - The sequelize model.
   * @param options - The configuration that will be taken into account when making the query.
   * @returns Objects that represent the result of the query.
   */
  async findByTerm<T extends Model>(
    model: ModelCtor<T>,
    options: IFindByTermOptions,
  ) {
    const {
      nameModel = '',
      include = [],
      term = '',
      or = true,
      order = [['createdAt', 'DESC']],
      paranoid = true,
      scope,
      restore = false,
      validUniqueProps = false,
      pagination = { page: 1, limit: 8 },
      count = false,
    } = options;

    const { limit, offset } = this.parsePagination(pagination);

    const whereCondition: any = {};
    if (term) {
      if (term.businessName) {
        whereCondition[Op.or] = [
          { businessName: { [Op.like]: `%${term.businessName}%` } },
          { userName: { [Op.like]: `%${term.businessName}%` } },
        ];
        delete term.businessName;
      }
    }

    const configRq = {
      include,
      where:
        (term && or && { [Op.or]: { ...term, ...whereCondition } }) ||
        (term && !or && { [Op.and]: { ...term, ...whereCondition } }),
      paranoid,
      limit,
      offset,
      order,
    };

    if (count) {
      const objCount = await model.scope(scope).findAndCountAll(configRq);

      if (objCount.rows.length > 0) {
        if (restore)
          await this.restoreData<T>(objCount.rows[0], term, nameModel);
        if (validUniqueProps) this.isExistsUniqueProps(term);
      }

      return objCount;
    }

    const obj = await model.scope(scope).findAll(configRq);

    if (obj.length > 0) {
      if (restore) await this.restoreData<T>(obj[0], term, nameModel);
      if (validUniqueProps) this.isExistsUniqueProps(term);
      return obj;
    }
  }

  /**
   * Restores the data by validating that all elements in the property array are equal to the data properties.
   * @param obj - Data to restore.
   * @param term - Property array to restore the data.
   * @param nameModel - Text string representing the model name.
   * @returns Objects that represent the result of the query.
   */
  async restoreData<T extends Model>(obj: T, term: any, nameModel: string) {
    const iteratorTerm = Object.entries(term);
    let isEqualTerms = true;
    iteratorTerm.forEach(([key, value]) => {
      if (isEqualTerms) isEqualTerms = obj[key] === value;
    });

    if (isEqualTerms && obj.deletedAt !== null) {
      await obj.restore();
      throw new HttpException(
        {
          statusCode: HttpStatus.OK,
          data: `${nameModel} has been restored`,
        },
        HttpStatus.OK,
      );
    }
  }

  /**
   * Validates that unique values are not repeated when creating or updating a data.
   * @param term - Property array to validate.
   */
  isExistsUniqueProps(term: any) {
    const iteratorTerm = Object.entries(term);
    let termMessage = '';

    iteratorTerm.forEach(
      ([key, value], index) =>
        (termMessage += `${key} '${value}' ${
          index + 1 !== iteratorTerm.length ? 'or ' : ''
        }`),
    );

    throw new BadRequestException(
      `The resource with the ${termMessage}already exists`,
    );
  }

  /**
   * Restores the data by validating that all elements in the property array are equal to the data properties.
   * @param page - Data page.
   * @param limit - Data limit to display.
   * @returns Object that represents the result of the pagination parse.
   */
  parsePagination({ page = 1, limit = 8 }: IPagination): IPagination {
    const pagination: IPagination = {
      page: Math.round(page),
      limit: Math.round(limit),
      offset: Math.round((page - 1) * limit),
    };

    return pagination;
  }
}
