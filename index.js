import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import connectData from './src/database/index.js';
import Root from './src/routes/index.js';
import { notFound, errorHandler } from './src/middleware/errors.js'; // ← Thêm import
import studentRoutes from './src/routes/student.routes.js';

const app = express();

const ALLOWED_ORIGINS = [
  'http://localhost:5173', 
  'http://localhost:5174', 
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }
    console.log('CORS blocked for origin:', origin);
    return callback(new Error('CORS not allowed for this origin'), false);
  },
  credentials: true,
  methods: ['GET','HEAD','PUT','PATCH','POST','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-CSRF-Token', 'Authorization', 'Accept'],
}));

app.use(express.json());
app.use(cookieParser());

connectData();

app.use(Root);
// Thêm vào file index.js backend (tạm thời)
app.get('/debug-routes', (req, res) => {
  const routes = [];
  app._router.stack.forEach(middleware => {
    if (middleware.route) {
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods)
      });
    } else if (middleware.name === 'router') {
      middleware.handle.stack.forEach(handler => {
        if (handler.route) {
          routes.push({
            path: handler.route.path,
            methods: Object.keys(handler.route.methods)
          });
        }
      });
    }
  });
  res.json(routes);
});
// ✅ Thêm error handlers
app.use(notFound);
app.use(errorHandler);

app.listen(process.env.PORT || 8080, () => {
  console.log('Server is running on port', process.env.PORT || 8080);
});