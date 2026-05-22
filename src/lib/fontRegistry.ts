type FontStatus = "idle" | "loading" | "loaded" | "error";
type Subscriber = (family: string) => void;

class FontRegistry {
  private loaded = new Set<string>();
  private loading = new Map<string, Promise<void>>();
  private status = new Map<string, FontStatus>();
  private sheet: CSSStyleSheet | null = null;
  private insertedFamilies = new Set<string>();
  private subscribers = new Set<Subscriber>();

  constructor() {
    const style = document.createElement("style");
    style.setAttribute("data-font-registry", "true");
    document.head.appendChild(style);
    this.sheet = style.sheet;
  }

  subscribe(fn: Subscriber) {
    this.subscribers.add(fn);
    return () => this.subscribers.delete(fn);
  }

  private notify(family: string) {
    this.subscribers.forEach((fn) => fn(family));
  }

  getStatus(family: string): FontStatus {
    return this.status.get(family) ?? "idle";
  }

  isLoaded(family: string): boolean {
    return this.loaded.has(family);
  }

  private appendFontCSS(family: string) {
    if (this.insertedFamilies.has(family) || !this.sheet) return;
    this.insertedFamilies.add(family);

    const encoded = family.replaceAll(" ", "+");
    const rule = `@import url('https://fonts.googleapis.com/css2?family=${encoded}:wght@100;200;300;400;500;600;700;800;900&display=swap');`;

    try {
      this.sheet.insertRule(rule, 0);
    } catch {
      const style = document.querySelector("[data-font-registry]") as HTMLStyleElement;
      if (style && !style.innerHTML.includes(family)) {
        style.innerHTML += rule;
      }
    }
  }

  async loadFont(family: string): Promise<void> {
    if (!family) return;
    if (this.loaded.has(family)) return;
    if (this.loading.has(family)) return this.loading.get(family);

    this.status.set(family, "loading");

    const promise = (async () => {
      try {
        this.appendFontCSS(family);
        await document.fonts.load(`16px "${family}"`);
        this.loaded.add(family);
        this.status.set(family, "loaded");
        this.notify(family);
      } catch {
        this.status.set(family, "error");
      } finally {
        this.loading.delete(family);
      }
    })();

    this.loading.set(family, promise);
    return promise;
  }

  async preloadFonts(families: string[]): Promise<void> {
    const unique = [...new Set(families.filter(Boolean))];
    await Promise.all(unique.map((f) => this.loadFont(f)));
  }

  getLoadedFamilies(): string[] {
    return [...this.loaded];
  }
}

export const fontRegistry = new FontRegistry();
