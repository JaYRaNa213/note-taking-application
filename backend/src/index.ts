import app from './app';
import { connect } from 'mongoose';
import env from './config/env';

const PORT = env.PORT || 4000;
connect(env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  })
  .catch(err => {
    console.error('DB connection error', err);
    process.exit(1);
  });
