import { Includeable, Order } from 'sequelize';

import { IPagination } from './pagination.interface';

export interface IFindByTermOptions {
  nameModel?: string,
  include?: Includeable | Includeable[];
  term?: any;
  or?: boolean;
  order?: Order;
  scope?: string;
  paranoid?: boolean;
  restore?: boolean;
  validUniqueProps?: boolean;
  pagination?: IPagination;
  count?: boolean;
}
