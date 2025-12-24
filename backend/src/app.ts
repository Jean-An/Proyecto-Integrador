import express from 'express';
import cors from 'cors';
import { connectDB } from './config/database';

import productRoutes from './routes/product.routes';
import categoryRoutes from './routes/category.routes';
import clientRoutes from './routes/client.routes';
import providerRoutes from './routes/provider.routes';
import authRoutes from './routes/auth.routes';
import transporterRoutes from './routes/transporter.routes';
import employeeRoutes from './routes/employee.routes';
import guideRoutes from './routes/guide.routes';
import entryGuideRoutes from './routes/entryGuide.routes';
import exitGuideRoutes from './routes/exitGuide.routes';
import guideDetailRoutes from './routes/guideDetail.routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/transporters', transporterRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/guides', guideRoutes);
app.use('/api/entry-guides', entryGuideRoutes);
app.use('/api/exit-guides', exitGuideRoutes);
app.use('/api/guide-details', guideDetailRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'CyberManager API is running' });
});

export default app;
