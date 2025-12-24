import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class Brand extends Model {
  public id!: number;
  public nombre!: string;
}

Brand.init(
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
    tableName: 'marcas',
  }
);
