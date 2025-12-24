import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class Client extends Model {
  public id!: number;
  public nombre!: string;
  public apellido!: string;
  public email!: string;
  public telefono!: string;
  public dni!: string;
  public direccion!: string;
  public estado!: string;
}

Client.init(
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      }
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dni: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    direccion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Activo',
    },
  },
  {
    sequelize,
    tableName: 'clientes',
  }
);
