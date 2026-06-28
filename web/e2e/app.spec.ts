import { test, expect } from "@playwright/test";

test("landing page loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "ResumeBuilder" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Get started" })).toBeVisible();
});

test("preview dev page renders sample resume", async ({ page }) => {
  await page.goto("/preview");
  await expect(page.getByText("Rohit Martires")).toBeVisible();
  await expect(page.getByText("Professional Summary")).toBeVisible();
});

test("login page renders", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
});
