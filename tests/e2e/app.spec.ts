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
  ["paths", "/paths"],
  ["visuals", "/visuals"],
  ["path-detail", "/paths/python-ai"],
  ["planned-course", "/course/sql"],
  ["overview", "/course/python"],
  ["reader", "/read/python-functions"],
  ["llm-reader", "/read/llm-attention"],
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
  await expect(page.locator(".course-card").filter({ hasText: "Python for practical problem solving" })).toHaveCount(1);
  await page.getByRole("textbox", { name: "Search catalog" }).fill("");
  await page.getByRole("button", { name: "Analytics", exact: true }).click();
  await expect(page.locator(".course-card")).toHaveCount(4);
  await page.getByRole("combobox", { name: "Level" }).selectOption("Intermediate");
  await expect(
    page.getByRole("heading", { name: "No matching courses" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(page.locator(".course-card")).toHaveCount(36);
  await page.locator(".course-card").filter({ hasText: "Python for practical problem solving" }).click();
  await page.getByRole("link", { name: "Start learning" }).click();
  await expect(page.locator("article h1")).toContainText("Programming and Python foundations");
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
    page.locator("textarea[aria-label='Saved chapter notes']").filter({ hasText: "A weighted mean uses the total denominator." }),
  ).toHaveCount(1);
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
      { timeout: 150000 },
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
    page.locator("textarea[aria-label='Saved chapter notes']").filter({ hasText: "Imported note" }),
  ).toHaveCount(1);
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
    page.getByRole("textbox", { name: "Saved chapter notes" }).first(),
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

test("account settings navigation closes the account dialog", async ({
  page,
}) => {
  await page.goto("/#/");
  await page.getByRole("button", { name: "Open account menu" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("link", { name: "Open settings", exact: true }).click();
  await expect(page).toHaveURL(/#\/settings$/);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Your space. Your pace." }),
  ).toBeVisible();
});

test("guided paths link to published chapters and expose planned curricula honestly", async ({ page }) => {
  await page.goto("/#/paths");
  await expect(page.locator(".path-card")).toHaveCount(8);
  await page.getByRole("textbox", { name: "Search learning paths" }).fill("agents");
  await expect(page.locator(".path-card")).toHaveCount(1);
  await page.locator(".path-card").first().click();
  await expect(page.locator(".path-step")).toHaveCount(5);
  await expect(page.getByRole("heading", { name: "Reliable AI agents." })).toBeVisible();
  await expect(page.getByText("Lessons available", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Curriculum planned", { exact: true }).first()).toBeVisible();
  await page.getByRole("link", { name: "Explore the curriculum" }).first().click();
  await expect(page.locator(".planned-module")).toHaveCount(3);
  await expect(page.getByText("These are curriculum topics, not published or assessed lessons.")).toBeVisible();
});

test("interactive visual notes update measured values and support keyboard input", async ({ page }) => {
  await page.goto("/#/visuals");
  await expect(page.getByRole("heading", { name: /Change a number/ })).toBeVisible();
  await expect(page.locator(".visual-formula")).toContainText("46.00 seconds");
  await page.locator("#first-calls").focus();
  await page.keyboard.press("End");
  await expect(page.locator(".visual-formula")).toContainText("34.21 seconds");
  await page.getByRole("button", { name: /Next-token predictions/ }).click();
  await expect(page.locator(".visual-bar")).toHaveCount(3);
  await expect(page.locator(".visual-formula")).toContainText("coding");
  await page.getByRole("button", { name: /Algorithm growth/ }).click();
  await expect(page.locator(".visual-formula")).toContainText("400");
  await page.locator("#items-n").focus();
  await page.keyboard.press("End");
  await expect(page.locator(".visual-formula")).toContainText("10000");
});

test("new LLM chapters provide real explanations and assessments", async ({ page }) => {
  await page.goto("/#/course/llm-engineering");
  await expect(page.getByRole("link", { name: /Embeddings: when meaning becomes geometry/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Attention: choosing context with numbers/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Retrieval-augmented generation: answers with evidence/ })).toBeVisible();
  await page.goto("/#/read/llm-attention");
  await expect(page.getByRole("heading", { name: /Attention: choosing context with numbers/ })).toBeVisible();
  await expect(page.locator("figure.flow-diagram")).toBeVisible();
  await expect(page.getByText("[0.665, 0.245, 0.09]", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: /Check your understanding/ }).last().click();
  await expect(page.getByText("Numerical attention checkpoint")).toBeVisible();
});
