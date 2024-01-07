import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  IsUUID,
  Model,
  Table,
} from 'sequelize-typescript';
import { Category } from 'src/categories/entities/category.entity';
import { User } from 'src/users/entities/user.entity';

@Table({
  createdAt: true,
  updatedAt: true,
})
export class Income extends Model {
  @IsUUID(4)
  @Column({
    primaryKey: true,
    type: DataType.STRING,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({ type: DataType.STRING })
  name: string;

  @Column({ type: DataType.TEXT })
  description: string;

  @Column({ type: DataType.FLOAT })
  value: number;

  @ForeignKey(() => Category)
  categoryId: string;

  @BelongsTo(() => Category, 'categoryId')
  category: Category;

  @ForeignKey(() => User)
  userId: string;

  @BelongsTo(() => User, 'userId')
  user: User;
}
