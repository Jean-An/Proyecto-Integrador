import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class Guide extends Model {
  public id!: number;
  public empleado!: string; // Name as per frontend, consider migrating to ID
  public fecha!: string;
  public tipo!: 'Ingreso' | 'Salida';
}

Guide.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    empleado: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fecha: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.ENUM('Ingreso', 'Salida'),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'guias',
  }
);
