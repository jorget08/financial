export { IFindByTermOptions } from './findByTermOptions';
export { IPagination } from './pagination.interface';

export enum DBs {
  main = 'gws',
  replica = 'gws-replica',
}

export interface IRequestNotificationService {
  sendCreateNotification: (data: unknown) => Promise<void>;
  sendUpdateNotification: (data: unknown) => Promise<void>;
}