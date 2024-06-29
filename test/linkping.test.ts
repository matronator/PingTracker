import { assert, describe, it } from "vitest";
import { LinkPing } from "../src/index";

describe("construct", () => {
    it("Set URL list", () => {
        const lp = new LinkPing("https://example.com");
        assert((lp.urls = ["https://example.com"]), "URL list not same");
    });
});
