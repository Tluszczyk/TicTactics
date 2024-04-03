import { APIService } from './src/services/APIService/APIService';

import * as dotenv from 'dotenv';
dotenv.config();

new APIService(3000).start();