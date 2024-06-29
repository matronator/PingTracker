export interface LinkPingConfig {
    hrefToQuery?: boolean;
    onlyExternal?: boolean;
}

export class LinkPing {
    config?: LinkPingConfig;
    urls: string[];

    constructor(url: string);
    constructor(urls: string[]);
    constructor(url: string, config?: LinkPingConfig);
    constructor(urls: string[], config?: LinkPingConfig);
    constructor(urls: string | string[], config?: LinkPingConfig) {
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
