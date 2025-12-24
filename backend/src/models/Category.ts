import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class Category extends Model {
  public id!: number;
  public nombre!: string;
}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'categorias',
  }
);
