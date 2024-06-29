export interface PingAConfig {
    hrefToQuery?: boolean;
    onlyExternal?: boolean;
}

export class PingA {
    config?: PingAConfig;
    urls: string[];

    constructor(url: string);
    constructor(urls: string[]);
    constructor(url: string, config?: PingAConfig);
    constructor(urls: string[], config?: PingAConfig);
    constructor(urls: string | string[], config?: PingAConfig) {
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
