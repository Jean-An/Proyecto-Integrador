import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { Guide } from './Guide';

export class GuideDetail extends Model {
  public id!: number;
  public guiaId!: number;
  public producto!: string;
  public cantidad!: number;
}

GuideDetail.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    guiaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Guide,
        key: 'id',
      },
    },
    producto: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'detalles_guia',
  }
);
