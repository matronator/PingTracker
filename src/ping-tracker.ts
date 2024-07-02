// Add sendBeacon fallback

/**
 * @interface PingTrackerConfig
 * @field {boolean} hrefToQuery If `true` appends the url inside the link's href to the ping's URL query (ie.: `?href=https://example.com`)
 * @field {boolean} onlyExternal If `true` only external links will be modified (defaults to `false`)
 * @field {Element | Element[] | Node | Node[] | NodeList | NodeListOf<Element|HTMLElement>} elementsToWatch Element or elements to watch for changes (defaults to `document.body`)
 * @field {boolean} watchDOM Watch DOM changes to modify newly created <a> tags (defaults to `true`)
 */
export interface PingTrackerConfig {
    /** If `true` appends the url inside the link's href to the ping's URL query (ie.: `?href=https://example.com`) */
    hrefToQuery?: boolean;
    /** If `true` only external links will be modified (defaults to `false`) */
    onlyExternal?: boolean;
    /** Watch DOM changes to modify newly created <a> tags (defaults to `true`) */
    watchDOM?: boolean;
    /** Element or elements to watch for changes (defaults to `document.body`) */
    elementsToWatch?: HTMLElement | HTMLElement[] | Node | Node[] | NodeList | NodeListOf<HTMLElement>;
}

export class PingTracker {
    config?: PingTrackerConfig;
    urls: string[];
    #watchedElements?: HTMLElement | HTMLElement[] | Node | Node[] | NodeList | NodeListOf<HTMLElement>;
    #watchDOM: boolean = true;
    #onlyExternal: boolean = false;
    #hrefToQuery: boolean = false;
    #observer?: MutationObserver;

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
        this.#setConfigDefaults();

        document.addEventListener("DOMContentLoaded", () => {
            this.addPingToAllLinks();
            this.#watchDOMChanges();
        });
    }

    addPingToAllLinks() {
        const links = document.querySelectorAll(`a`);
        if (!links) return;

        this.addPingToLinks(links);
    }

    addPingToLinks(links: NodeListOf<HTMLAnchorElement> | HTMLAnchorElement[]) {
        links.forEach(el => {
            this.addPingToLink(el);
        });
    }

    addPingToLink(link: HTMLAnchorElement) {
        if (link.hasAttribute("ping")) return;

        const href = link.getAttribute("href");

        if (this.#onlyExternal) {
            if (href) {
                if (!this.isExternal(href)) {
                    return;
                }
            }
        }

        const urls: string[] = this.urls;
        if (this.#hrefToQuery) {
            urls.forEach(url => {
                if (url.includes("?")) {
                    return (url += `&href=${href}`);
                }

                return (url += `?href=${href}`);
            });
        }

        link.setAttribute("ping", urls.join(""));
    }

    isExternal(url: string) {
        return new URL(url).origin !== location.origin;
    }

    #setConfigDefaults() {
        if (this.config === undefined) return;

        if (this.config.watchDOM === undefined) {
            this.#watchDOM = true;
        } else {
            this.#watchDOM = this.config.watchDOM;
        }

        if (this.#watchDOM) {
            if (this.config.elementsToWatch === undefined) {
                this.#watchedElements = document.body;
            } else {
                this.#watchedElements = this.config.elementsToWatch;
            }
        }

        this.#onlyExternal = !!this.config.onlyExternal;
        this.#hrefToQuery = !!this.config.hrefToQuery;
    }

    #watchDOMChanges() {
        if (!this.#watchDOM || !this.#watchedElements) return;

        if (this.#watchedElements instanceof Array || this.#watchedElements instanceof NodeList) {
            this.#watchedElements.forEach(el => {
                const options: MutationObserverInit = {
                    subtree: true,
                    childList: true,
                };

                const callback = (mutationList: MutationRecord[]) => {
                    for (const mutation of mutationList) {
                        if (mutation.type === "childList") {
                            mutation.addedNodes.forEach(node => {
                                if (node.nodeName.toLowerCase() === "a" && node instanceof HTMLElement) {
                                    this.addPingToLink(node as HTMLAnchorElement);
                                }
                            });
                        }
                    }
                };

                this.#observer = new MutationObserver(callback);
                this.#observer.observe(el, options);
            });
        }
    }
}
