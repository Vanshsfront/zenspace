import { ArtistProfileContent } from "@/components/ArtistProfileContent";

const FALLBACK = "https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?w=800";

export const metadata = { title: "Avinash Kumar — Zenspace" };

export default function AvinashKumarPage() {
  return (
    <ArtistProfileContent
      name="Avinash Kumar"
      role="Tattoo Artist at ZenSpace, Andheri"
      experience="3+ Years"
      specialty="Minimal tattoos, fine line work, custom freehand designs"
      bio="Avinash Kumar is a tattoo artist at ZenSpace Tattoo Studio in Andheri, Mumbai, with over 3 years of experience. He specializes in minimal and fine line tattoos and is skilled in creating custom freehand designs tailored to each client’s idea and placement."
      photo={FALLBACK}
      works={[FALLBACK, FALLBACK, FALLBACK]}
    />
  );
}
