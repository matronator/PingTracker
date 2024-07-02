import { assert, describe, it } from "vitest";
import { PingTracker } from "../src/index";

describe("construct", () => {
    it("Set URL list", () => {
        const lp = new PingTracker("https://example.com");
        assert((lp.urls = ["https://example.com"]), "URL list not same");
    });
});
