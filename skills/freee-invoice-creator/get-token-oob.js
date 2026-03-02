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
        code: process.env.FREEE_AUTH_CODE,
        client_id: process.env.FREEE_CLIENT_ID,
        client_secret: process.env.FREEE_CLIENT_SECRET,
        redirect_uri: 'urn:ietf:wg:oauth:2.0:oob',  // OOB フロー用
      }
    );

    console.log('✅ access_token 取得成功！\n');
    console.log('📋 トークン情報:');
    console.log(`  access_token: ${response.data.access_token.substring(0, 30)}...`);
    console.log(`  token_type: ${response.data.token_type}`);
    console.log(`  expires_in: ${response.data.expires_in} 秒`);
    console.log(`  refresh_token: ${response.data.refresh_token.substring(0, 30)}...`);

    console.log('\n💾 以下を .env に追加してください:');
    console.log(`FREEE_ACCESS_TOKEN=${response.data.access_token}`);
    console.log(`FREEE_REFRESH_TOKEN=${response.data.refresh_token}`);

    return response.data;
  } catch (error) {
    console.error('❌ access_token 取得失敗:');
    console.error(`  Status: ${error.response?.status}`);
    console.error(`  Error: ${error.response?.data?.error}`);
    console.error(`  Message: ${error.response?.data?.error_description || error.message}`);
  }
}

getAccessToken().catch(console.error);
