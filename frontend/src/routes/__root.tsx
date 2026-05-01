import { Outlet, createRootRoute, HeadContent, Scripts, useLocation } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import appCss from "../styles.css?url";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ConciergeFab } from "@/components/ConciergeFab";
import { InteractionContactPopup } from "@/components/InteractionContactPopup";

const queryClient = new QueryClient();

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="divider-gold mb-6 justify-center inline-flex">Lost?</p>
        <h1 className="font-serif text-7xl">404</h1>
        <h2 className="mt-4 font-serif text-2xl">This page is not in our atelier</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          The piece you're looking for may have been moved or never existed.
        </p>
        <a
          href="/"
          className="mt-8 inline-flex items-center justify-center px-9 py-4 bg-onyx text-ivory text-xs tracking-luxe hover:bg-gold hover:text-onyx transition-colors"
          style={{ backgroundColor: "var(--onyx)", color: "var(--ivory)" }}
        >
          Return Home →
        </a>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Sahajanand Jewellers — Timeless Elegance, Crafted for Every Occasion" },
      {
        name: "description",
        content:
          "Discover heirloom-quality gold and diamond jewellery, hand-crafted in our atelier. Rings, necklaces, earrings and bracelets for every occasion.",
      },
      { name: "author", content: "Sahajanand Jewellers" },
      { property: "og:title", content: "Sahajanand Jewellers — Fine Jewellery" },
      { property: "og:description", content: "Heirloom-quality gold and diamond jewellery, hand-crafted." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <>
      {!isAdmin && <Navbar />}
      <main className={!isAdmin ? "pt-[var(--header-height)]" : ""}>
        <Outlet />
      </main>
      {!isAdmin && <Footer />}
      {!isAdmin && <ConciergeFab />}
      {!isAdmin && <InteractionContactPopup />}
    </>
  );
}
