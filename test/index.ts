import { ocr } from "../src/index";

const REMOTE_RECEIPT = "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/ReceiptSwiss.jpg/1920px-ReceiptSwiss.jpg";
const LOCAL_RECEIPT = "./test/trader-joes-receipt.jpg";


const receiptStructure = {
  store: {
    name: "string",
    address: "string",
    phone: "string"
  },
  transaction: {
    type: "string",
    items: [{
      name: "string",
      price: "number"
    }],
    total: "number",
    payment: {
      method: "string",
      amount: "number"
    }
  }
};

async function main() {
  let totalTests = 6;
  let passedTests = 0;
  
  console.log("\n=== Testing Markdown Output ===");
  
  try {
    // Test 1: Local file markdown
    console.log("\nTest 1: Local Receipt - Markdown");
    let localMarkdown = await ocr({
      filePath: LOCAL_RECEIPT,
      apiKey: process.env.TOGETHER_API_KEY,
    });
    console.log(localMarkdown);
    console.log("✅ Test 1 passed");
    passedTests++;
  } catch (error) {
    console.log("❌ Test 1 failed:", error.message);
  }

  try {
    // Test 2: Remote file markdown
    console.log("\nTest 2: Remote Receipt - Markdown");
    let remoteMarkdown = await ocr({
      filePath: REMOTE_RECEIPT,
      apiKey: process.env.TOGETHER_API_KEY,
    });
    console.log(remoteMarkdown);
    console.log("✅ Test 2 passed");
    passedTests++;
  } catch (error) {
    console.log("❌ Test 2 failed:", error.message);
  }

  console.log("\n=== Testing JSON Output (No Structure) ===");

  try {
    // Test 3: Local file JSON (no structure)
    console.log("\nTest 3: Local Receipt - JSON (No Structure)");
    let localJson = await ocr({
      filePath: LOCAL_RECEIPT,
      apiKey: process.env.TOGETHER_API_KEY,
      outputFormat: "json"
    });
    console.log(JSON.stringify(localJson, null, 2));
    console.log("✅ Test 3 passed");
    passedTests++;
  } catch (error) {
    console.log("❌ Test 3 failed:", error.message);
  }

  try {
    // Test 4: Remote file JSON (no structure)
    console.log("\nTest 4: Remote Receipt - JSON (No Structure)");
    let remoteJson = await ocr({
      filePath: REMOTE_RECEIPT,
      apiKey: process.env.TOGETHER_API_KEY,
      outputFormat: "json"
    });
    console.log(JSON.stringify(remoteJson, null, 2));
    console.log("✅ Test 4 passed");
    passedTests++;
  } catch (error) {
    console.log("❌ Test 4 failed:", error.message);
  }

  console.log("\n=== Testing JSON Output (With Structure) ===");

  try {
    // Test 5: Local file JSON (with structure)
    console.log("\nTest 5: Local Receipt - JSON (With Structure)");
    let localStructuredJson = await ocr({
      filePath: LOCAL_RECEIPT,
      apiKey: process.env.TOGETHER_API_KEY,
      outputFormat: "json",
      jsonStructure: receiptStructure
    });
    console.log(JSON.stringify(localStructuredJson, null, 2));
    console.log("✅ Test 5 passed");
    passedTests++;
  } catch (error) {
    console.log("❌ Test 5 failed:", error.message);
  }

  try {
    // Test 6: Remote file JSON (with structure)
    console.log("\nTest 6: Remote Receipt - JSON (With Structure)");
    let remoteStructuredJson = await ocr({
      filePath: REMOTE_RECEIPT,
      apiKey: process.env.TOGETHER_API_KEY,
      outputFormat: "json",
      jsonStructure: receiptStructure
    });
    console.log(JSON.stringify(remoteStructuredJson, null, 2));
    console.log("✅ Test 6 passed");
    passedTests++;
  } catch (error) {
    console.log("❌ Test 6 failed:", error.message);
  }

  console.log("\n=== Test Summary ===");
  console.log(`${passedTests}/${totalTests} tests passed ${passedTests === totalTests ? '✅' : '⚠️'}`);
}

main().catch(error => {
  console.error("❌ Test suite failed:", error);
  process.exit(1);
});
