import { User } from './User';
import { Category } from './Category';
import { Product } from './Product';
import { Brand } from './Brand';
import { Client } from './Client';
import { Provider } from './Provider';
import { Transporter } from './Transporter';
import { Employee } from './Employee';
import { Guide } from './Guide';
import { GuideDetail } from './GuideDetail';
import { EntryGuide } from './EntryGuide';
import { ExitGuide } from './ExitGuide';

// Define Associations

// Guide -> Details
Guide.hasMany(GuideDetail, { foreignKey: 'guiaId', as: 'detalles' });
GuideDetail.belongsTo(Guide, { foreignKey: 'guiaId', as: 'guia' });

// Guide -> EntryGuide (One-to-One ish, but schema allows ID mismatch, actually it's 1:1 usually)
Guide.hasOne(EntryGuide, { foreignKey: 'guiaId', as: 'ingreso' });
EntryGuide.belongsTo(Guide, { foreignKey: 'guiaId', as: 'guia' });

// Guide -> ExitGuide (One-to-One)
Guide.hasOne(ExitGuide, { foreignKey: 'guiaId', as: 'salida' });
ExitGuide.belongsTo(Guide, { foreignKey: 'guiaId', as: 'guia' });

export {
  User,
  Category,
  Product,
  Brand,
  Client,
  Provider,
  Transporter,
  Employee,
  Guide,
  GuideDetail,
  EntryGuide,
  ExitGuide
};
