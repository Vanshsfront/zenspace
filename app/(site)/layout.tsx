import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { EditModeBoot } from "@/components/EditModeBoot";
import { getSiteSettings, getArtists, getCategories } from "@/lib/data";

// Cached via unstable_cache in lib/data; admin writes call revalidateTag so
// edits show up on the next request. Allow up to 1h before a background refresh.
export const revalidate = 3600;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  // Nav data fetched once per render, in parallel.
  const [settings, artists, categories] = await Promise.all([
    getSiteSettings(),
    getArtists(),
    getCategories(),
  ]);

  return (
    // The admin check is client-side on purpose: reading the admin cookie here
    // would call cookies() and opt every visitor's page into dynamic rendering.
    <EditModeBoot>
      <Navbar
        artists={artists.map((a) => ({ id: a.id, name: a.name, slug: a.slug }))}
        categories={categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug }))}
      />
      <main className="flex-1">{children}</main>
      {/* Narrowed to the columns Footer reads. It is a client component, so the
          whole site_settings row would otherwise be serialised into the RSC
          payload of every page in the group, not just the ones that use it. */}
      <Footer
        settings={
          settings && {
            address: settings.address,
            email: settings.email,
            phone: settings.phone,
            whatsapp: settings.whatsapp,
            facebook: settings.facebook,
            instagram: settings.instagram,
            pinterest: settings.pinterest,
          }
        }
      />
      <WhatsAppFab digits={settings?.whatsapp} />
    </EditModeBoot>
  );
}
