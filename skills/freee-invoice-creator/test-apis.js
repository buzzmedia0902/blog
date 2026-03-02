import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

async function testAPIs() {
  console.log('🧪 API接続テストを開始します\n');

  // Test 1: freee API
  console.log('1️⃣  freee API をテスト中...');
  try {
    const freeeResponse = await axios.get(
      'https://api.freee.co.jp/api/1/users/me',
      {
        headers: {
          Authorization: `Bearer ${process.env.FREEE_ACCESS_TOKEN}`,
        },
      }
    );
    
    console.log('✅ freee API 接続成功');
    console.log(`   ユーザー: ${freeeResponse.data.user?.email}`);
    console.log(`   Company ID: ${process.env.FREEE_ACCOUNT_ID}`);
  } catch (error) {
    console.error('❌ freee API 接続失敗:');
    console.error(`   Status: ${error.response?.status}`);
    console.error(`   Message: ${error.response?.data?.errors?.[0]?.message || error.message}`);
  }

  // Test 2: freee 取引先一覧
  console.log('\n2️⃣  freee 取引先一覧をテスト中...');
  try {
    const partnersResponse = await axios.get(
      `https://api.freee.co.jp/api/1/partners`,
      {
        headers: {
          Authorization: `Bearer ${process.env.FREEE_ACCESS_TOKEN}`,
        },
        params: {
          company_id: process.env.FREEE_ACCOUNT_ID,
        },
      }
    );
    
    console.log('✅ freee 取引先取得成功');
    console.log(`   取引先数: ${partnersResponse.data.partners?.length || 0}`);
    if (partnersResponse.data.partners?.length > 0) {
      console.log(`   最初の取引先: ${partnersResponse.data.partners[0].name}`);
    }
  } catch (error) {
    console.error('❌ freee 取引先取得失敗:');
    console.error(`   Status: ${error.response?.status}`);
    console.error(`   Message: ${error.response?.data?.errors?.[0]?.message || error.message}`);
  }

  // Test 3: 助成金管理システム
  console.log('\n3️⃣  助成金管理システム API をテスト中...');
  try {
    const subsidyResponse = await axios.get(
      `${process.env.SUBSIDY_API_BASE_URL}/customers`,
      {
        headers: {
          Authorization: `Bearer ${process.env.SUBSIDY_API_KEY}`,
        },
      }
    );
    
    console.log('✅ 助成金管理システム接続成功');
    console.log(`   顧客数: ${subsidyResponse.data.customers?.length || 0}`);
    if (subsidyResponse.data.customers?.length > 0) {
      subsidyResponse.data.customers.slice(0, 3).forEach((c, i) => {
        console.log(`   ${i+1}. ${c.company_name}`);
      });
    }
  } catch (error) {
    console.error('❌ 助成金管理システム接続失敗:');
    console.error(`   Status: ${error.response?.status}`);
    console.error(`   Message: ${error.response?.data?.error || error.message}`);
  }

  console.log('\n✨ API接続テスト完了');
}

testAPIs().catch(console.error);
