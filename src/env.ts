import {createEnv} from '@t3-oss/env-core';
import dotenv from 'dotenv';
import {z} from 'zod';

dotenv.config();

export const env = createEnv({
  clientPrefix: '',
  server: {
    LOG_LEVEL: z.string().default('debug'),
    INFURA_PROJECT_ID: z.string().optional(),
    // AlchemyNFT Remixed for example
    MY_NFT_CONTRACT_ADDRESS: z
      .string()
      .default('0x222222222291749de47895c0c0a9b17e4fca8268'),
  },
  client: {},
  runtimeEnv: process.env,
});
