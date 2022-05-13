import * as dotenv from 'dotenv';

dotenv.config();

export default {
  bugzillaAPIKey: process.env.BUGZILLA_API_KEY,
};
