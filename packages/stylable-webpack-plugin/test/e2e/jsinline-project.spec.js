const { expect } = require("chai");
const { join } = require("path");
const { 
  StylableProjectRunner: ProjectRunner,
  browserFunctions
} = require("stylable-build-test-kit");

const projectFixtures = join(__dirname, "projects");

xdescribe("(jsinline-project)", () => {
  const projectRunner = ProjectRunner.mochaSetup(
    {
      projectDir: join(projectFixtures, "jsinline-project"),
      port: 3001,
      puppeteerOptions: {
        headless: false
      }
    },
    before,
    afterEach,
    after
  );

  it("renders css", async () => {
    const { page } = await projectRunner.openInBrowser();
  });

});
