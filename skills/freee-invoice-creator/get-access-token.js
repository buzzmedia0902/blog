import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

async function getAccessToken() {
  console.log('🔐 access_token を取得中...\n');

  try {
    const response = await axios.post(
      'https://accounts.secure.freee.co.jp/public_api/token',
      {
        grant_type: 'authorization_code',
        code: process.env.FREEE_API_KEY, // authorization code
        client_id: process.env.FREEE_CLIENT_ID,
        client_secret: process.env.FREEE_CLIENT_SECRET,
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    console.log('✅ access_token 取得成功！\n');
    console.log('📋 トークン情報:');
    console.log(`  access_token: ${response.data.access_token}`);
    console.log(`  token_type: ${response.data.token_type}`);
    console.log(`  expires_in: ${response.data.expires_in} 秒`);
    console.log(`  refresh_token: ${response.data.refresh_token}`);

    console.log('\n💾 .env を更新してください:');
    console.log(`FREEE_ACCESS_TOKEN=${response.data.access_token}`);
    console.log(`FREEE_REFRESH_TOKEN=${response.data.refresh_token}`);
    console.log(`FREEE_TOKEN_EXPIRES_AT=${new Date(Date.now() + response.data.expires_in * 1000).toISOString()}`);

    return response.data;
  } catch (error) {
    console.error('❌ access_token 取得失敗:');
    console.error(`  Status: ${error.response?.status}`);
    console.error(`  Message: ${error.response?.data?.error_description || error.message}`);
    
    console.log('\n📍 必要な環境変数:');
    console.log('  FREEE_CLIENT_ID');
    console.log('  FREEE_CLIENT_SECRET');
    console.log('  FREEE_API_KEY (authorization code として使用)');
  }
}

getAccessToken().catch(console.error);
