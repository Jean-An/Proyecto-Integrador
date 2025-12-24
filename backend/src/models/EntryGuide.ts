import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { Guide } from './Guide';

export class EntryGuide extends Model {
  public id!: number;
  public guiaId!: number;
  public proveedor!: string;
}

EntryGuide.init(
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
    proveedor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'guias_ingreso',
  }
);
