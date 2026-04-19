import { ArtistProfileContent } from "@/components/ArtistProfileContent";

const FALLBACK = "https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?w=800";

export const metadata = { title: "Suren — Zenspace" };

export default function SurenPage() {
  return (
    <ArtistProfileContent
      name="Suren"
      role="Tattoo Artist & Founder, ZenSpace Andheri"
      experience="6+ Years"
      specialty="Custom tattoo design, realistic tattoos"
      bio="Suren is a tattoo artist and founder of ZenSpace Tattoo Studio in Andheri, Mumbai, with 6+ years of experience in custom and realistic tattoo work. He has received multiple awards and has 5 years of experience teaching tattoo students across India."
      photo={FALLBACK}
      works={[FALLBACK, FALLBACK, FALLBACK]}
    />
  );
}
