import { Column, DataType, HasMany, IsUUID, Model } from 'sequelize-typescript';
import { Expense } from 'src/expenses/entities/expense.entity';
import { Income } from 'src/income/entities/income.entity';

export class User extends Model {
  @IsUUID(4)
  @Column({
    primaryKey: true,
    type: DataType.STRING,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({ type: DataType.STRING })
  name: string;

  @Column({ type: DataType.STRING })
  email: string;

  @Column({ type: DataType.STRING })
  password: string;

  @HasMany(() => Income)
  incomes: Income[];

  @HasMany(() => Expense)
  expenses: Expense[];
}
