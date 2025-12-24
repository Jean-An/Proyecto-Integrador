import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class Provider extends Model {
  public id!: number;
  public ruc!: string;
  public nombre!: string;
  public apellido!: string;
  public direccion!: string;
  public telefono!: string;
  public correo!: string;
  public estado!: string;
}

Provider.init(
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
    estado: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Activo',
    },
  },
  {
    sequelize,
    tableName: 'proveedores',
  }
);
