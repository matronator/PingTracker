// TODO: Add some workaround to detect link visits from contextmenu (visibilitychange)
// TODO: Fix bundle generation to have proper intellisesne.
// https://stackoverflow.com/questions/78478711/jsdoc-intellisense-when-using-script-tags
// https://stackoverflow.com/questions/75236041/vite-use-keep-names-esbuild-flag-for-production-build

/**
 * @interface PingTrackerConfig
 * @member {boolean} hrefToQuery — If `true` appends the url inside the link's href to the ping's URL query (ie.: `?href=https://example.com`)
 * @member {boolean} onlyExternal — If `true` only external links will be modified (defaults to `false`)
 * @member {Element | Element[] | Node | Node[] | NodeList | NodeListOf<Element|HTMLElement>} elementsToWatch — Element or elements to watch for changes (defaults to `document.body`)
 * @member {boolean} watchDOM — Watch DOM changes to modify newly created <a> tags (defaults to `true`)
 * @member {boolean} sendBeaconInstead — If `true`, Ping Tracker won't add `ping` attribute to links, but use `sendBeacon` on click event instead (defaults to `false`). Note that this method doesn't work for opening links via the `contextmenu`.
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
    /** If `true`, Ping Tracker won't add `ping` attribute to links, but use `sendBeacon` on click event instead (defaults to `false`). Note that this method doesn't work for opening links via the `contextmenu`. */
    sendBeaconInstead?: boolean;
}

export class PingTracker {
    config?: PingTrackerConfig;
    urls: string[];
    #watchedElements?: HTMLElement | HTMLElement[] | Node | Node[] | NodeList | NodeListOf<HTMLElement>;
    #watchDOM: boolean = true;
    #onlyExternal: boolean = false;
    #hrefToQuery: boolean = false;
    #sendBeaconInstead: boolean = false;
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

    modifyLink(link: HTMLAnchorElement) {
        if (this.#sendBeaconInstead) {
            this.addBeaconToLink(link);
        } else {
            this.addPingToLink(link);
        }
    }

    addPingToAllLinks() {
        const links = document.querySelectorAll(`a`);
        if (!links) return;

        this.addPingToLinks(links);
    }

    addPingToLinks(links: NodeListOf<HTMLAnchorElement> | HTMLAnchorElement[]) {
        links.forEach(el => {
            this.modifyLink(el);
        });
    }

    addPingToLink(link: HTMLAnchorElement) {
        if (link.hasAttribute("ping")) return;

        const href = link.getAttribute("href");
        if (!href) return;

        if (this.#onlyExternal) {
            if (href) {
                if (!this.isExternal(href)) {
                    return;
                }
            }
        }

        const urls: string[] = this.#appendHrefToUrls(href);

        link.setAttribute("ping", urls.join(""));
    }

    addBeaconToLink(link: HTMLAnchorElement) {
        const href = link.getAttribute("href");
        if (!href) return;

        if (this.#onlyExternal) {
            if (!this.isExternal(href)) {
                return;
            }
        }

        ['click', 'auxclick'].forEach(event => {
            link.addEventListener(event, () => {
                const urls: string[] = this.#appendHrefToUrls(href);
    
                urls.forEach(url => {
                    navigator.sendBeacon(url);
                });
            });
        });
    }

    isExternal(url: string) {
        return new URL(url).origin !== location.origin;
    }

    #appendHrefToUrls(href: string) {
        const urls: string[] = this.urls;
        if (this.#hrefToQuery) {
            urls.forEach(url => {
                if (url.includes("?")) {
                    return (url += `&href=${href}`);
                }

                return (url += `?href=${href}`);
            });
        }
        return urls;
    }

    #setConfigDefaults() {
        if (this.config === undefined) return;
        
        this.#onlyExternal = !!this.config.onlyExternal;
        this.#hrefToQuery = !!this.config.hrefToQuery;
        this.#sendBeaconInstead = !!this.config.sendBeaconInstead;
        this.#watchDOM = !!this.config.watchDOM;
        
        if (this.#watchDOM) {
            this.#watchedElements = this.config.elementsToWatch ?? document.body;
        }
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
                                    this.modifyLink(node as HTMLAnchorElement);
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
