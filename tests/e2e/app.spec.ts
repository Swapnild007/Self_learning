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
test("search, filters and adaptive course navigation", async ({ page }) => {
  await page.goto("/#/");
  await page
    .getByRole("textbox", { name: "Search all courses" })
    .fill("Python for Practical Problem Solving");
  await page
    .getByRole("textbox", { name: "Search all courses" })
    .press("Enter");

  const pythonRow = page.locator(".sorted-course-row").filter({
    hasText: "Python for Practical Problem Solving",
  });
  await expect(pythonRow).toHaveCount(1);

  await page.getByRole("textbox", { name: "Search catalog" }).fill("");
  await page.getByRole("button", { name: "Ready now", exact: true }).click();
  await expect(page.locator(".sorted-course-row")).not.toHaveCount(0);

  await page.getByRole("button", { name: "All", exact: true }).click();
  await page.getByRole("combobox").filter({ has: page.locator("option") }).selectOption("az");
  await expect(page.locator(".sorted-course-row").first()).toBeVisible();

  await page.getByRole("textbox", { name: "Search catalog" }).fill("Python for Practical Problem Solving");
  await pythonRow.click();
  await expect(page.getByText("NEXT BEST ACTION", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: /Start lesson|Continue lesson|Run experiment|Check understanding|Retry with feedback/ }).first().click();
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
  await page.getByRole("tab", { name: /Notes/ }).click();
  await expect(
    page.getByRole("textbox", { name: /Notes for/ }).first(),
  ).toHaveValue("A weighted mean uses the total denominator.");
  await page.goto("/#/settings");
  await page.getByRole("button", { name: "Midnight dark" }).click();
  await page
    .getByRole("combobox", { name: "Reading font size" })
    .selectOption("23");
  await page
    .getByRole("textbox", { name: "Learner display name" })
    .fill("Swapnil");
  await page
    .getByRole("combobox", { name: "Primary learning path" })
    .selectOption("global-cs-core");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(
    page.getByRole("combobox", { name: "Reading font size" }),
  ).toHaveValue("23");
  await expect(
    page.getByRole("textbox", { name: "Learner display name" }),
  ).toHaveValue("Swapnil");
  await expect(
    page.getByRole("combobox", { name: "Primary learning path" }),
  ).toHaveValue("global-cs-core");
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

test("personal LMS follows profile, activity, and review evidence", async ({ page }) => {
  await page.goto("/#/settings");
  await page.getByRole("textbox", { name: "Learner display name" }).fill("Swapnil");
  await page.getByRole("combobox", { name: "Primary learning path" }).selectOption("global-cs-core");
  await page.goto("/#/read/python-functions");
  await page.getByRole("button", { name: "Needs another pass" }).first().click();
  await page.getByRole("button", { name: "Mark section as read", exact: true }).first().click();
  await page.goto("/#/");
  await expect(page.getByRole("heading", { name: /Swapnil/ })).toBeVisible();
  await expect(page.getByText("Strengthen a weak spot", { exact: true })).toBeVisible();
  await expect(page.getByText("Global Computer Science Core", { exact: true })).toBeVisible();
  await page.goto("/#/learning");
  await expect(page.getByRole("tab", { name: "Mastery" })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByText(/MASTERY MAP · GLOBAL COMPUTER SCIENCE CORE/)).toBeVisible();
  await page.getByRole("tab", { name: "Evidence" }).click();
  await expect(page.getByText(/CURRENT LEARNING · GLOBAL COMPUTER SCIENCE CORE/)).toBeVisible();
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
  await page.getByRole("tab", { name: /Notes/ }).click();
  await expect(
    page.getByRole("textbox", { name: /Notes for/ }).first(),
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
  await page.getByRole("tab", { name: /Notes/ }).click();
  await expect(
    page.getByRole("textbox", { name: /Notes for/ }).first(),
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
  await expect(page.locator(".path-card")).toHaveCount(9);
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

test("mission labs run real instruments and persist evidence", async ({ page }) => {
  await page.goto("/#/lab?chapter=llm-foundations");
  await expect(page.getByRole("heading", { name: /Learn by changing the system/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Token probability engine" })).toBeVisible();

  await page.getByRole("button", { name: /Run inference/ }).click();
  await expect(page.getByText("Inference result", { exact: true })).toBeVisible();
  await expect(page.locator(".mission-meter")).toHaveCount(3);

  await expect
    .poll(async () =>
      page.evaluate(() => {
        const data = JSON.parse(localStorage.getItem("self-learning-v1") || "{}");
        return data.labEvidence?.["llm-foundations"]?.best;
      }),
    )
    .toBe(100);

  await page.getByRole("button", { name: /Semantic geometry/ }).click();
  await expect(page.getByRole("heading", { name: "Semantic geometry" })).toBeVisible();
  await page.getByRole("button", { name: "Measure similarity" }).click();
  await expect(page.getByText("Above threshold", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: /Retrieval evidence arena/ }).click();
  await page.getByRole("button", { name: /Run retrieval/ }).click();
  await expect(page.getByText("Top result: Overtime policy", { exact: true })).toBeVisible();
  await expect(page.getByText("untrusted instruction", { exact: true })).toBeVisible();
});

test("new LLM chapters expose curriculum, mastery and assessments", async ({ page }) => {
  await page.goto("/#/course/llm-engineering");
  await page.getByRole("tab", { name: "Curriculum" }).click();
  await expect(page.getByText(/Embeddings: when meaning becomes geometry/).first()).toBeVisible();
  await expect(page.getByText(/Attention: choosing context with numbers/).first()).toBeVisible();
  await expect(page.getByText(/Retrieval-augmented generation: answers with evidence/).first()).toBeVisible();

  await page.getByRole("tab", { name: "Mastery" }).click();
  await expect(page.getByRole("heading", { name: "What should happen next?" })).toBeVisible();
  await expect(page.locator(".course-mastery-row")).not.toHaveCount(0);

  await page.goto("/#/read/llm-attention");
  await expect(page.getByRole("heading", { name: /Attention: choosing context with numbers/ })).toBeVisible();
  await expect(page.locator("figure.flow-diagram")).toBeVisible();
  await expect(page.getByText("[0.665, 0.245, 0.09]", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: /Check your understanding/ }).last().click();
  await expect(page.getByText("Numerical attention checkpoint")).toBeVisible();
});
