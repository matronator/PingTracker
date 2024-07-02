// Add sendBeacon fallback

export interface PingTrackerConfig {
    hrefToQuery?: boolean;
    onlyExternal?: boolean;
}

export class PingTracker {
    config?: PingTrackerConfig;
    urls: string[];

    constructor(url: string);
    constructor(urls: string[]);
    constructor(url: string, config?: PingTrackerConfig);
    constructor(urls: string[], config?: PingTrackerConfig);
    constructor(urls: string | string[], config?: PingTrackerConfig) {
        if (urls instanceof Array) {
            this.urls = urls;
        } else {
            this.urls = [urls];
        }

        this.config = config;

        document.addEventListener("DOMContentLoaded", () => {
            this.addPing();
        });
    }

    addPing() {
        const links = document.querySelectorAll(`a`);
        if (!links) return;

        links.forEach((link: HTMLAnchorElement) => {
            link.setAttribute(`ping`, this.urls.join(" "));
        });
    }
}
