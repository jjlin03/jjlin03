import { expect, test } from "@playwright/test";

test.beforeEach("Load page", async ({ page }) => {
  // Notice: http, not https! Our front-end is not set up for HTTPs.
  await page.goto("http://localhost:8000/");
});

test("Clicking the login button changes the page state", async ({ page }) => {
    await expect(page.getByLabel("Login")).toBeVisible();
    await expect(page.getByLabel("Sign Out")).not.toBeVisible();
    await expect(page.getByPlaceholder("Enter command here!")).not.toBeVisible();
    await page.getByLabel("Login").click();
    await expect(page.getByLabel("Sign Out")).toBeVisible();
    await expect(page.getByPlaceholder("Enter command here!")).toBeVisible();
});

test("data loads properly for valid data", async ({ page }) => {
    await page.getByLabel("Login").click();
    var mock_input = `load_file <topNBAScorers>`;
    await page.getByPlaceholder("Enter command here!").click();
    await page.getByPlaceholder("Enter command here!").fill(mock_input);
    await expect(page.getByPlaceholder("Enter command here!")).toHaveValue(
      mock_input
    );
    await page.getByRole("button", { name: "Submitted 0 times" }).click();

    // is this even the right format?
    const firstChild = await page.evaluate(() => {
      const history = document.querySelector(".repl-history");
      return history?.children[0]?.textContent;
    });
    await expect(firstChild).toEqual("File successfully found");
});

test("data doesn't load for incorrectly spelled load_file command", async ({ page }) => {
  await page.getByLabel("Login").click();
  var mock_input = `load_f <topNBAScorers>`;
  await page.getByPlaceholder("Enter command here!").click();
  await page.getByPlaceholder("Enter command here!").fill(mock_input);
  await page.getByRole("button", { name: "Submitted 0 times" }).click();

  const firstChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[0]?.textContent;
  });
  await expect(firstChild).toEqual("Invalid Command");
});

test("data doesn't load for nonexistent data", async ({ page }) => {
  await page.getByLabel("Login").click();
  var mock_input = `load_file <NBAScorers>`;
  await page.getByPlaceholder("Enter command here!").click();
  await page.getByPlaceholder("Enter command here!").fill(mock_input);
  await page.getByRole("button", { name: "Submitted 0 times" }).click();

  const firstChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[0]?.textContent;
  });
  await expect(firstChild).toEqual("File not found");
});

test("loaded data can be viewed", async ({ page }) => {
  await page.getByLabel("Login").click();
  var mock_input = `load_file <topNBAScorers>`;
  await page.getByPlaceholder("Enter command here!").click();
  await page.getByPlaceholder("Enter command here!").fill(mock_input);
  await page.getByRole("button", { name: "Submitted 0 times" }).click();

  await page.getByPlaceholder("Enter command here!").click();
  await page.getByPlaceholder("Enter command here!").fill("view");
  await page.getByRole("button", { name: "Submitted 1 times" }).click();

  await expect(page.getByText("Shai Gilgeous-Alexander")).toBeVisible();
});

test("searched data can be viewed if column value present", async ({ page }) => {
  await page.getByLabel("Login").click();
  var mock_input = `load_file <topNBAScorers>`;
  await page.getByPlaceholder("Enter command here!").click();
  await page.getByPlaceholder("Enter command here!").fill(mock_input);
  await page.getByRole("button", { name: "Submitted 0 times" }).click();

  await page.getByPlaceholder("Enter command here!").click();
  await page
    .getByPlaceholder("Enter command here!")
    .fill("search <Team> <OKC>");
  await page.getByRole("button", { name: "Submitted 1 times" }).click();

  await expect(page.getByTestId("repl-history")).toContainText("Kevin Durant");
  await expect(page.getByTestId("repl-history")).not.toContainText(
    "Donovan Mitchell"
  );

});

test("searched data can be viewed w/o column value present", async ({
  page,
}) => {
  await page.getByLabel("Login").click();
  var mock_input = `load_file <topNBAScorers>`;
  await page.getByPlaceholder("Enter command here!").click();
  await page.getByPlaceholder("Enter command here!").fill(mock_input);
  await page.getByRole("button", { name: "Submitted 0 times" }).click();

  await page.getByPlaceholder("Enter command here!").click();
  await page
    .getByPlaceholder("Enter command here!")
    .fill("search <OKC>");
  await page.getByRole("button", { name: "Submitted 1 times" }).click();
  await expect(page.getByTestId("repl-history")).toContainText("Kevin Durant");
  await expect(page.getByTestId("repl-history")).not.toContainText(
    "Donovan Mitchell"
  );
});

test("search returns only header if value not present", async ({
  page,
}) => {
  await page.getByLabel("Login").click();
  var mock_input = `load_file <topNBAScorers>`;
  await page.getByPlaceholder("Enter command here!").click();
  await page.getByPlaceholder("Enter command here!").fill(mock_input);
  await page.getByRole("button", { name: "Submitted 0 times" }).click();

  await page.getByPlaceholder("Enter command here!").click();
  await page.getByPlaceholder("Enter command here!").fill("search <OC>");
  await page.getByRole("button", { name: "Submitted 1 times" }).click();
  await expect(page.getByTestId("repl-history")).not.toContainText("Kevin Durant");
  await expect(page.getByTestId("repl-history")).not.toContainText(
    "Donovan Mitchell"
  );
});

test("search works after view", async ({ page }) => {
  await page.getByLabel("Login").click();
  var mock_input = `load_file <topNBAScorers>`;
  await page.getByPlaceholder("Enter command here!").click();
  await page.getByPlaceholder("Enter command here!").fill(mock_input);
  await page.getByRole("button", { name: "Submitted 0 times" }).click();

  await page.getByPlaceholder("Enter command here!").click();
  await page.getByPlaceholder("Enter command here!").fill("view");
  await page.getByRole("button", { name: "Submitted 1 times" }).click();

  await page.getByPlaceholder("Enter command here!").click();
  await page.getByPlaceholder("Enter command here!").fill("search <MIL>");
  await page.getByRole("button", { name: "Submitted 2 times" }).click();
  await expect(page.getByTestId("repl-history")).toContainText(
    "File successfully foundRankNameTeamPts1Luka DoncicDAL34.32Shai Gilgeous-AlexanderOKC31.23Giannis AntetokounmpoMIL30.84Donovan MitchellCLE28.15Kevin DurantOKC28.0RankNameTeamPts3Giannis AntetokounmpoMIL30.8"
  );
});

test("changing modes work", async ({ page }) => {
  await page.getByLabel("Login").click();
  var mock_input = `load_file <topNBAScorers>`;
  await page.getByPlaceholder("Enter command here!").click();
  await page.getByPlaceholder("Enter command here!").fill(mock_input);
  await page.getByRole("button", { name: "Submitted 0 times" }).click();
  await expect(page.getByTestId("repl-history")).toContainText(
    "File successfully found"
  );

  await page.getByPlaceholder("Enter command here!").click();
  await page.getByPlaceholder("Enter command here!").fill("mode <verbose>");
  await page.getByRole("button", { name: "Submitted 1 times" }).click();
  await expect(page.getByTestId("repl-history")).toContainText(
    "Command: load_file <topNBAScorers>Output: File successfully foundCommand: mode <verbose>Output: Mode set to verbose"
  );

  await page.getByPlaceholder("Enter command here!").click();
  await page.getByPlaceholder("Enter command here!").fill("view");
  await page.getByRole("button", { name: "Submitted 2 times" }).click();
  await expect(page.getByTestId("repl-history")).toContainText(
    "Command: load_file <topNBAScorers>Output: File successfully foundCommand: mode <verbose>Output: Mode set to verboseCommand: viewOutput: RankNameTeamPts1Luka DoncicDAL34.32Shai Gilgeous-AlexanderOKC31.23Giannis AntetokounmpoMIL30.84Donovan MitchellCLE28.15Kevin DurantOKC28.0"
  );


});

test("switching files works", async ({ page }) => {
  await page.getByLabel("Login").click();
  var mock_input = `load_file <topNBAScorers>`;
  await page.getByPlaceholder("Enter command here!").click();
  await page.getByPlaceholder("Enter command here!").fill(mock_input);
  await page.getByRole("button", { name: "Submitted 0 times" }).click();
  await expect(page.getByTestId("repl-history")).toContainText(
    "File successfully found"
  );

  mock_input = `load_file <topNBARebounders>`;
  await page.getByPlaceholder("Enter command here!").click();
  await page.getByPlaceholder("Enter command here!").fill(mock_input);
  await page.getByRole("button", { name: "Submitted 1 times" }).click();
  await expect(page.getByTestId("repl-history")).toContainText(
    "File successfully foundFile successfully found"
  );

  await page.getByPlaceholder("Enter command here!").click();
  await page.getByPlaceholder("Enter command here!").fill("view");
  await page.getByRole("button", { name: "Submitted 2 times" }).click();
  await expect(page.getByTestId("repl-history")).toContainText(
    "Anthony Davis"
  );
  await expect(page.getByTestId("repl-history")).not.toContainText("Kevin Durant");
});

test("logging out removes all input", async ({ page }) => {
  await page.getByLabel("Login").click();
  var mock_input = `load_file <topNBAScorers>`;
  await page.getByPlaceholder("Enter command here!").click();
  await page.getByPlaceholder("Enter command here!").fill(mock_input);
  await page.getByRole("button", { name: "Submitted 0 times" }).click();
  await expect(page.getByTestId("repl-history")).toContainText(
    "File successfully found"
  );

  await page.getByLabel("Sign out").click();
  await page.getByLabel("Login").click();
  await expect(page.getByTestId("repl-history")).not.toContainText(
    "File successfully found"
  );

  await page.getByPlaceholder("Enter command here!").click();
  await page.getByPlaceholder("Enter command here!").fill("view");
  await page.getByRole("button", { name: "Submitted 0 times" }).click();
  await expect(page.getByTestId("repl-history")).toContainText("No file loaded");
  
});
// test("", async ({ page }) => {});
// test("", async ({ page }) => {});