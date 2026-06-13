interface PageDefinition {
  title: string;
  loadTemplate: () => Promise<{ template: string }>;
  loadPage: () => Promise<unknown>;
}

const pages: Record<string, PageDefinition> = {
  "/": {
    title: "Echo Echo - Turn Your Mood Into Music",
    loadTemplate: () => import("./pages/home/template"),
    loadPage: () => import("./pages/home"),
  },
  "/login": {
    title: "Echo Echo - Sign in",
    loadTemplate: () => import("./pages/login/template"),
    loadPage: () => import("./pages/login"),
  },
  "/dashboard": {
    title: "Echo Echo - Dashboard",
    loadTemplate: () => import("./pages/dashboard/template"),
    loadPage: () => import("./pages/dashboard"),
  },
  "/generate": {
    title: "Echo Echo - Generating your track",
    loadTemplate: () => import("./pages/generate/template"),
    loadPage: () => import("./pages/generate"),
  },
  "/output": {
    title: "Echo Echo - Your Tracks",
    loadTemplate: () => import("./pages/output/template"),
    loadPage: () => import("./pages/output"),
  },
};

async function bootstrap(): Promise<void> {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  const page = pages[path] || pages["/"];
  const app = document.querySelector<HTMLDivElement>("#app");

  if (!app || !page) return;

  document.title = page.title;
  const { template } = await page.loadTemplate();
  app.replaceWith(document.createRange().createContextualFragment(template));
  await page.loadPage();
}

void bootstrap();

