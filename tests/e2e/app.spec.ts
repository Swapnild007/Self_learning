import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function replaceCode(page: Page, source: string) {
  const editor = page.locator(".cm-content");
  await editor.click();
  await page.keyboard.press("ControlOrMeta+A");
  await page.keyboard.insertText(source);
  await expect
    .poll(() =>
      editor.evaluate((el) =>
        Array.from(
          el.querySelectorAll(".cm-line"),
          (line) => line.textContent,
        ).join("\n"),
      ),
    )
    .toBe(source);
}
const routes = [
  ["dashboard", "/"],
  ["catalog", "/catalog"],
  ["overview", "/course/python"],
  ["reader", "/read/python-functions"],
  ["lab", "/lab"],
  ["practice", "/practice"],
  ["learning", "/learning"],
  ["settings", "/settings"],
];
test("all screens render accessibly without overflow", async ({
  page,
}, info) => {
  for (const [name, path] of routes) {
    await page.goto("/#" + path);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("h1")).not.toHaveText(
      "Something interrupted this session.",
    );
    await expect
      .poll(() =>
        page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      )
      .toBe(true);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(
      results.violations,
      JSON.stringify(
        results.violations.map((x) => ({
          id: x.id,
          nodes: x.nodes.map((n) => n.target),
        })),
      ),
    ).toEqual([]);
    await page.screenshot({
      path: `docs/screenshots/${info.project.name}-${name}.png`,
      fullPage: name !== "reader",
    });
  }
});
test("search, filters and navigation", async ({ page }) => {
  await page.goto("/#/");
  await page
    .getByRole("textbox", { name: "Search all courses" })
    .fill("Python");
  await page
    .getByRole("textbox", { name: "Search all courses" })
    .press("Enter");
  await expect(page.locator(".course-card")).toHaveCount(1);
  await page.getByRole("textbox", { name: "Search catalog" }).fill("");
  await page.getByRole("button", { name: "Analytics", exact: true }).click();
  await expect(page.locator(".course-card")).toHaveCount(2);
  await page.getByRole("combobox").selectOption("Intermediate");
  await expect(
    page.getByRole("heading", { name: "No courses match yet." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(page.locator(".course-card")).toHaveCount(5);
  await page.locator(".course-card").first().click();
  await page.getByRole("link", { name: "Begin sample chapter" }).click();
  await expect(page.locator("article h1")).toContainText("Functions");
});
test("notes bookmarks reading progress and settings persist", async ({
  page,
}) => {
  await page.goto("/#/read/python-functions");
  await page
    .getByRole("button", { name: "Bookmark chapter", exact: true })
    .click();
  await page.getByRole("button", { name: "Open chapter notes" }).click();
  await page
    .getByRole("textbox", { name: "Chapter notes" })
    .fill("A weighted mean uses the total denominator.");
  await page.getByRole("button", { name: "Close dialog" }).click();
  await page
    .getByRole("button", { name: "Mark section as read", exact: true })
    .first()
    .click();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Remove bookmark" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Section read", exact: true }),
  ).toHaveCount(1);
  await page.goto("/#/learning");
  await expect(
    page.getByRole("textbox", { name: "Saved chapter notes" }),
  ).toHaveValue("A weighted mean uses the total denominator.");
  await page.goto("/#/settings");
  await page.getByRole("button", { name: "Midnight dark" }).click();
  await page
    .getByRole("combobox", { name: "Reading font size" })
    .selectOption("23");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(
    page.getByRole("combobox", { name: "Reading font size" }),
  ).toHaveValue("23");
  await page.goto("/#/read/python-functions");
  await expect(page.locator("article")).toHaveCSS("font-size", "23px");
});
test("real Python output, syntax errors, cancellation and recovery", async ({
  page,
}) => {
  await page.goto("/#/lab");
  await page.getByRole("button", { name: "Run Python" }).click();
  await expect(page.getByLabel("Python output")).toContainText("30.0", {
    timeout: 60000,
  });
  const editor = page.locator(".cm-content");

  await replaceCode(page, "def broken(:\n    pass");
  await page.getByRole("button", { name: "Run Python" }).click();
  await expect(page.getByRole("alert")).toContainText("SyntaxError");

  await replaceCode(page, "while True:\n    pass");
  await page.getByRole("button", { name: "Run Python" }).click();
  await page.getByRole("button", { name: "Stop", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("cancelled");

  await replaceCode(page, "print(sum([1, 2, 3]))");

  await page.getByRole("button", { name: "Run Python" }).click();
  await expect(page.getByLabel("Python output")).toContainText("6", {
    timeout: 60000,
  });
  await replaceCode(page, 'print("x" * 60000)');
  await page.getByRole("button", { name: "Run Python" }).click();
  await expect
    .poll(
      async () =>
        (await page.getByLabel("Python output").textContent())?.length,
      { timeout: 60000 },
    )
    .toBe(50000);
});
test("assessment evaluates behavior and persists score", async ({ page }) => {
  await page.goto("/#/practice");
  await page.getByRole("radio", { name: "None", exact: true }).check();
  await page
    .getByRole("checkbox", { name: "average_wait(150, 5)", exact: true })
    .check();
  await page
    .getByRole("checkbox", { name: "average_wait(60, 2)", exact: true })
    .check();
  await page
    .getByRole("textbox", { name: "Keyword", exact: true })
    .fill("return");
  await replaceCode(
    page,
    "def average_wait(total_seconds, calls):\n    return total_seconds / calls if calls else 0",
  );
  await page.getByRole("button", { name: "Check my understanding" }).click();
  await expect(
    page.getByText("Score: 100%. Assessment mastered.", { exact: true }),
  ).toBeVisible({ timeout: 60000 });
  await page.reload();
  await expect(page.getByText("Latest score: 100% · Mastered")).toBeVisible();
  await replaceCode(
    page,
    "def average_wait(total_seconds, calls):\n    return 30",
  );
  await page.getByRole("button", { name: "Check my understanding" }).click();
  await expect(
    page.getByText("Score: 0%. Review the feedback and try again.", {
      exact: true,
    }),
  ).toBeVisible({ timeout: 60000 });
});
test("dialog keyboard, export, import and reset guard", async ({ page }) => {
  await page.goto("/#/settings");
  await page
    .getByRole("button", { name: "Reset local data", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Permanently reset local data" }),
  ).toBeDisabled();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export data", exact: true }).click();
  expect((await download).suggestedFilename()).toBe("self-learning-data.json");
  await page.getByRole("button", { name: "Import data", exact: true }).click();
  await page.getByLabel("Choose learning data JSON").setInputFiles({
    name: "bad.json",
    mimeType: "application/json",
    buffer: Buffer.from("{}"),
  });
  await page.getByRole("button", { name: "Validate and replace data" }).click();
  await expect(page.getByRole("dialog").getByRole("status")).toContainText(
    "not a valid",
  );
});

test("dark screens remain accessible and reduced motion is honored", async ({
  page,
}, info) => {
  await page.goto("/#/settings");
  await page.getByRole("button", { name: "Midnight dark" }).click();
  await page.getByRole("checkbox", { name: "Reduce motion" }).check();
  for (const [name, path] of routes) {
    await page.goto("/#" + path);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("data-reduced", "true");
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(
      result.violations,
      JSON.stringify(
        result.violations.map((x) => ({
          id: x.id,
          nodes: x.nodes.map((n) => n.target),
        })),
      ),
    ).toEqual([]);
    if (name === "dashboard")
      await page.screenshot({
        path: `docs/screenshots/${info.project.name}-dark-dashboard.png`,
        fullPage: true,
      });
  }
});
test("validated import restores data and confirmed reset removes it", async ({
  page,
}) => {
  await page.goto("/#/settings");
  const current = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("self-learning-v1")!),
  );
  current.notes = { "python-functions": "Imported note" };
  current.theme = "dark";
  await page.getByRole("button", { name: "Import data", exact: true }).click();
  await page.getByLabel("Choose learning data JSON").setInputFiles({
    name: "learning.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(current)),
  });
  await page.getByRole("button", { name: "Validate and replace data" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.keyboard.press("Escape");
  await page.goto("/#/learning");
  await expect(
    page.getByRole("textbox", { name: "Saved chapter notes" }),
  ).toHaveValue("Imported note");
  await page.goto("/#/settings");
  await page
    .getByRole("button", { name: "Reset local data", exact: true })
    .click();
  await page.getByRole("textbox", { name: "Reset confirmation" }).fill("RESET");
  await page
    .getByRole("button", { name: "Permanently reset local data" })
    .click();
  await page.keyboard.press("Escape");
  await page.goto("/#/learning");
  await expect(
    page.getByRole("textbox", { name: "Saved chapter notes" }),
  ).toHaveValue("");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("syllabus control supports keyboard dismissal on mobile and desktop collapse", async ({
  page,
}, info) => {
  await page.goto("/#/read/python-functions");
  await page.getByRole("button", { name: "Toggle chapter syllabus" }).click();
  if (info.project.name === "mobile") {
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await page.getByRole("button", { name: "Toggle chapter syllabus" }).click();
    await page
      .getByRole("dialog")
      .getByRole("link", { name: "2. Define, call, and return" })
      .click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(page.locator("#syntax")).toBeInViewport();
  } else {
    await expect(page.locator(".reader-syllabus")).toBeHidden();
    await page.getByRole("button", { name: "Toggle chapter syllabus" }).click();
    await expect(page.locator(".reader-syllabus")).toBeVisible();
  }
});

test("skip navigation preserves the current route", async ({ page }) => {
  await page.goto("/#/catalog");
  await expect(page.locator("h1")).toBeVisible();
  await page.getByRole("link", { name: "Skip to content" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main")).toBeFocused();
  await expect(page).toHaveURL(/#\/catalog$/);
});
