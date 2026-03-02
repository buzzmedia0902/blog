import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

async function testConnections() {
  console.log('🧪 API接続テストを開始します\n');

  // Test 1: freee API
  console.log('1️⃣  freee API をテスト中...');
  try {
    const freeeResponse = await axios.get(
      'https://api.freee.co.jp/api/1/companies',
      {
        headers: {
          Authorization: `Bearer ${process.env.FREEE_API_KEY}`,
        },
      }
    );
    
    console.log('✅ freee API 接続成功');
    console.log(`   Account ID: ${process.env.FREEE_ACCOUNT_ID}`);
    console.log(`   Companies found: ${freeeResponse.data.companies?.length || 0}`);
    if (freeeResponse.data.companies?.length > 0) {
      console.log(`   First company: ${freeeResponse.data.companies[0].display_name}`);
    }
  } catch (error) {
    console.error('❌ freee API 接続失敗:', error.response?.status, error.message);
  }

  console.log('\n2️⃣  助成金管理システム API をテスト中...');
  try {
    const subsidyResponse = await axios.get(
      `${process.env.SUBSIDY_API_BASE_URL}/customers`,
      {
        headers: {
          Authorization: `Bearer ${process.env.SUBSIDY_API_KEY}`,
        },
      }
    );
    
    console.log('✅ 助成金管理システム API 接続成功');
    console.log(`   Base URL: ${process.env.SUBSIDY_API_BASE_URL}`);
    console.log(`   Customers found: ${subsidyResponse.data.customers?.length || 0}`);
  } catch (error) {
    console.error('❌ 助成金管理システム API 接続失敗:', error.response?.status, error.message);
  }

  console.log('\n✨ API接続テスト完了');
}

testConnections().catch(console.error);
