import { test, expect } from "@playwright/test";

test("landing page loads", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: /Build resumes that get past ATS and get noticed/i,
    }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: /Continue with Google/i }).first()).toBeVisible();
});

test("login without redirect sends users to landing sign-in", async ({ page }) => {
  await page.goto("/login");
  await expect(page).toHaveURL(/\/#sign-in$/);
  await expect(page.getByRole("button", { name: /Continue with Google/i }).first()).toBeVisible();
});

test("preview dev page renders sample resume", async ({ page }) => {
  await page.goto("/preview");
  await expect(page.getByText("Alex Rivera")).toBeVisible();
  await expect(page.getByText("Professional Summary")).toBeVisible();
});

test("login page renders", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Continue with Google/i }).first(),
  ).toBeVisible();
});

test("Phase 3 content routes render and cross-link", async ({ page }) => {
  await page.goto("/guides/how-to-make-a-resume");
  await expect(
    page.getByRole("heading", { name: "How to Make a Resume That Gets Interviews" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /Resume examples/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Frequently asked questions/ })).toBeVisible();

  await page.goto("/guides/ats/workday-resume");
  await expect(page.getByRole("heading", { name: /Workday Resume Parsing/ })).toBeVisible();
  await expect(page.getByText(/configurations, integrations, and review practices vary/i)).toBeVisible();

  await page.goto("/guides/ats/ats-friendly-resume-format");
  await expect(
    page.getByRole("heading", { name: /ATS-Friendly Resume Format/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /paste-test the file/i }),
  ).toBeVisible();
  await expect(page.getByText(/Copy the whole file into Notepad/i)).toBeVisible();
  await expect(page.getByRole("link", { name: /ATS checker/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /ATS-friendly resume templates/ })).toBeVisible();

  await page.goto("/guides/ats/resume-keywords");
  await expect(
    page.getByRole("heading", { name: /Resume Keywords: How to Tailor Them/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /Verify with a Notepad paste-test/i }),
  ).toBeVisible();
  await expect(page.getByText(/Copy the whole resume into Notepad/i)).toBeVisible();
  await expect(page.getByRole("link", { name: /ATS checker/ })).toBeVisible();

  await page.goto("/guides/ats/canva-resume-ats");
  await expect(
    page.getByRole("heading", { name: /Are Canva Resumes ATS Friendly/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /Paste-test this Canva export/i }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /ATS checker/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /ATS-friendly resume templates/ })).toBeVisible();

  await page.goto("/examples/resumes/nursing");
  await expect(
    page.getByRole("heading", { name: "Nursing Resume Example" }),
  ).toBeVisible();
  await expect(page.getByText("Jordan Lee")).toBeVisible();

  await page.goto("/compare/resumepilot-vs-jobscan");
  await expect(
    page.getByRole("table", { name: /Feature comparison/ }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Official sources" })).toBeVisible();
});
