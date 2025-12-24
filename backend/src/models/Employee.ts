import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class Employee extends Model {
  public id!: number;
  public nombre!: string;
  public apellido!: string;
  public direccion!: string;
  public telefono!: string;
  public correo!: string;
}

Employee.init(
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
    apellido: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    direccion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    correo: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      }
    },
  },
  {
    sequelize,
    tableName: 'empleados',
  }
);
