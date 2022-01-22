import * as dotenv from 'dotenv';

dotenv.config({ path: '../../.plumber.env' });

export default {
  bugzillaAPIKey: process.env.BUGZILLA_API_KEY,
};
