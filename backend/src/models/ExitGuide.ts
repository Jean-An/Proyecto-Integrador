import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { Guide } from './Guide';

export class ExitGuide extends Model {
  public id!: number;
  public guiaId!: number;
  public cliente!: string;
  public puertoPartida!: string;
  public puertoLlegada!: string;
  public transportista!: string;
}

ExitGuide.init(
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
    cliente: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    puertoPartida: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    puertoLlegada: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    transportista: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'guias_salida',
  }
);
