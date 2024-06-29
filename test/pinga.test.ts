import { assert, describe, it } from "vitest";
import { PingA } from "../src/index";

describe("construct", () => {
    it("Set URL list", () => {
        const lp = new PingA("https://example.com");
        assert((lp.urls = ["https://example.com"]), "URL list not same");
    });
});
