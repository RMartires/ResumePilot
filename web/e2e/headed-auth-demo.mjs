import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const outDir = join(process.cwd(), "..", ".qa-screenshots");
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ headless: false, slowMo: 400 });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

async function shot(name) {
  const path = join(outDir, name);
  await page.screenshot({ path, fullPage: true });
  console.log("SHOT", path);
  return path;
}

console.log("STEP 1: Login page");
await page.goto("http://localhost:3000/login?redirect=%2Fdashboard");
await page.waitForSelector('text=Sign in');
await shot("01-login-page.png");

console.log("STEP 2: Invalid credentials");
await page.getByLabel("Email").fill("rohitmartires14@gmail.com");
await page.getByLabel("Password").fill("wrong-password-test");
await page.getByRole("button", { name: "Sign in" }).click();
await page.waitForSelector("text=Invalid email or password");
await shot("02-login-invalid-credentials.png");

console.log("STEP 3: Signup page");
await page.goto("http://localhost:3000/signup");
await page.waitForSelector('text=Create account');
await shot("03-signup-page.png");

const testEmail = `qa-test-${Date.now()}@example.com`;
console.log("STEP 4: Signup with", testEmail);
await page.getByLabel("Email").fill(testEmail);
await page.getByLabel("Password").fill("testpass123456");
await page.getByRole("button", { name: "Sign up" }).click();
await page.waitForTimeout(2500);
await shot("04-signup-result.png");

const body = await page.locator("body").innerText();
console.log("RESULT_TEXT", body.replace(/\s+/g, " ").slice(0, 500));

await page.waitForTimeout(3000);
await browser.close();
console.log("DONE");
