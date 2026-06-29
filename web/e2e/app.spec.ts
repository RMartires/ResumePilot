import { test, expect } from "@playwright/test";

test("landing page loads", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: /Build resumes that get past ATS and get noticed/i,
    }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: /Continue with Google/i })).toBeVisible();
});

test("login without redirect sends users to landing sign-in", async ({ page }) => {
  await page.goto("/login");
  await expect(page).toHaveURL(/\/#sign-in$/);
  await expect(page.getByRole("button", { name: /Continue with Google/i })).toBeVisible();
});

test("preview dev page renders sample resume", async ({ page }) => {
  await page.goto("/preview");
  await expect(page.getByText("Rohit Martires")).toBeVisible();
  await expect(page.getByText("Professional Summary")).toBeVisible();
});

test("login page renders", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Continue with Google/i }),
  ).toBeVisible();
});
