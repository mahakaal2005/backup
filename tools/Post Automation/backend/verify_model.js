const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const CANDIDATE_MODELS = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-flash-lite-latest", // Verified working before
    "gemini-2.0-flash-lite-preview-02-05",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-2.0-pro-exp-02-05"
];

async function verifyModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("No API key found in .env");
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const workingModels = [];

    console.log("Starting Model Verification...\n");

    for (const modelName of CANDIDATE_MODELS) {
        process.stdout.write(`Testing ${modelName.padEnd(35)} `);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            // Use a very simple prompt to minimize token usage/latency
            const result = await model.generateContent("Hi");
            const response = await result.response;
            await response.text(); // Ensure we can read text
            console.log(`✅ WORKING`);
            workingModels.push(modelName);
        } catch (error) {
            let msg = error.message;
            if (msg.includes("404")) msg = "404 Not Found";
            else if (msg.includes("429")) msg = "429 Quota Exceeded";
            else if (msg.includes("503")) msg = "503 Service Unavailable";
            console.log(`❌ FAILED: ${msg.substring(0, 50)}...`);
        }
        // Small delay to avoid self-imposed rate limits during check
        await new Promise(pkg => setTimeout(pkg, 1000));
    }

    console.log("\nSummary of Working Models:");
    console.log(JSON.stringify(workingModels, null, 2));
}

verifyModels();
