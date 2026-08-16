import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { downloadRegionForContinent, type DownloadsPageData, downloadsPageDataRevision } from "./download";

const data: DownloadsPageData = {
  projectResult: {
    value: {
      id: "paper",
      name: "Paper",
      latestStableVersion: "1.21.5",
      latestExperimentalVersion: null,
      latestVersionGroup: "1.21",
    },
  },
  stableBuildsResult: { value: { builds: [] } },
  experimentalBuildsResult: null,
};

describe("downloads snapshot revisions", () => {
  test("is independent of object key insertion order", async () => {
    const reordered = {
      experimentalBuildsResult: null,
      stableBuildsResult: { value: { builds: [] } },
      projectResult: {
        value: {
          name: "Paper",
          id: "paper",
          latestVersionGroup: "1.21",
          latestExperimentalVersion: null,
          latestStableVersion: "1.21.5",
        },
      },
    } satisfies DownloadsPageData;

    assert.equal(await downloadsPageDataRevision(reordered), await downloadsPageDataRevision(data));
  });

  test("changes when snapshot content changes", async () => {
    const changed = structuredClone(data);
    if (changed.projectResult.value) changed.projectResult.value.latestStableVersion = "1.21.6";
    assert.notEqual(await downloadsPageDataRevision(changed), await downloadsPageDataRevision(data));
  });

  test("matches JSON serialization semantics for undefined object properties", async () => {
    const withUndefined = structuredClone(data);
    if (withUndefined.stableBuildsResult.value) withUndefined.stableBuildsResult.value.latest = undefined;
    assert.equal(await downloadsPageDataRevision(withUndefined), await downloadsPageDataRevision(data));
  });
});

describe("downloads regional routing", () => {
  const cases = [
    ["NA", "wnam"],
    ["SA", "wnam"],
    ["EU", "weur"],
    ["AF", "weur"],
    ["AS", "apac"],
    ["OC", "apac"],
  ] as const;

  for (const [continent, expected] of cases) {
    test(`maps ${continent} to ${expected}`, () => {
      assert.equal(downloadRegionForContinent(continent), expected);
    });
  }
});
