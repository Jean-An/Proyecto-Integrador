import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class Transporter extends Model {
  public id!: number;
  public ruc!: string;
  public nombre!: string;
  public apellido!: string;
  public placa!: string;
}

Transporter.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ruc: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    apellido: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    placa: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'transportistas',
  }
);
