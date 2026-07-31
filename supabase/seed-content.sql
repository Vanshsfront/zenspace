-- Zenspace content seed: blog posts and the privacy policy.
--
-- Separate from schema.sql on purpose. schema.sql is structural and is meant to
-- be re-run freely; this file writes CONTENT, so every statement here is written
-- to be safe to re-run without overwriting anything the studio has since edited:
--   - new posts use `on conflict (slug) do nothing`
--   - the legal pages are only rewritten while they still hold the placeholder
--     text, so a real edit is never clobbered
--
-- Everything seeded here is editable in the panel and inline on the site, so
-- treat it as a starting draft rather than something final.
--
-- Run in the Supabase SQL editor.

-- ─── Blog posts ───────────────────────────────────────────────────
insert into blog_posts (slug, title, excerpt, published, published_at, sort_order, blocks) values
(
  'choosing-your-first-tattoo',
  'Choosing your first tattoo',
  'How to arrive at a design you will still be glad about in twenty years, and the questions worth answering before the needle.',
  true, now(), 1,
  '[
    {"type":"paragraph","text":"A first tattoo carries more weight than the ones that follow. Not because it matters more, but because you have nothing to compare it to. Most of the regret we hear about comes from a decision made quickly, not from a design that was badly drawn."},
    {"type":"heading","level":"h2","text":"Start with the why, not the what"},
    {"type":"paragraph","text":"People usually arrive with a picture. That is a fine place to begin, but a picture found online was designed for someone else''s body and someone else''s reason. In a consultation we work backwards: what is this marking, and what should it feel like to see it in ten years? The image tends to resolve itself once that is clear."},
    {"type":"heading","level":"h2","text":"Placement changes everything"},
    {"type":"paragraph","text":"The same design reads completely differently on a forearm and a ribcage. Skin moves, stretches and creases in ways that flat paper does not. Areas with more friction and sun exposure, the hands and feet especially, will soften faster and need touching up sooner. None of this is a reason to avoid a placement you want, but it should be a deliberate choice rather than a surprise."},
    {"type":"heading","level":"h2","text":"Size honestly"},
    {"type":"paragraph","text":"Fine detail needs room. A design packed with linework that looks crisp at hand size will blur as the ink settles and spreads over the years. If you love the detail, give it the space it needs. If you want it small, we will simplify the design so the parts that matter stay readable."},
    {"type":"heading","level":"h2","text":"Take the time"},
    {"type":"paragraph","text":"We would rather redraw a design three times than tattoo something you are unsure about. There is no cost to sitting with a drawing for a week. Come in, talk it through, and leave with a plan rather than a booking."}
  ]'::jsonb
),
(
  'how-to-care-for-a-new-tattoo',
  'How to care for a new tattoo',
  'The first three weeks decide how a tattoo ages. A straightforward guide to healing, and the things that quietly ruin good work.',
  true, now(), 2,
  '[
    {"type":"paragraph","text":"A tattoo is an open wound with pigment in it. How you treat it in the first weeks affects how sharp the lines stay for the rest of its life. None of this is complicated, but it does have to be consistent."},
    {"type":"heading","level":"h2","text":"The first 48 hours"},
    {"type":"paragraph","text":"Leave the covering on for as long as your artist tells you, which will depend on the wrap used. When it comes off, wash the area with clean hands and a fragrance-free soap, using lukewarm water. Pat it dry with a clean paper towel rather than a bath towel, which holds bacteria. Do not re-wrap it unless you were told to."},
    {"type":"heading","level":"h2","text":"Weeks one to three"},
    {"type":"paragraph","text":"Wash twice a day and apply a thin layer of the ointment your artist recommended. Thin is the operative word: a thick layer traps moisture and stops the skin breathing, which slows healing and can pull ink out. The tattoo will flake and itch around day five to ten. This is normal. Do not pick it and do not scratch it. Pulling a scab early takes pigment with it, and that shows as a patchy line that needs correcting later."},
    {"type":"heading","level":"h2","text":"What to avoid"},
    {"type":"paragraph","text":"No swimming pools, no sea, no bathtubs and no steam rooms until the skin has fully closed, usually two to three weeks. Showers are fine. Keep it out of direct sun while it heals, and once it has healed, sunscreen is the single most effective thing you can do to keep it looking sharp. Sun is what fades tattoos, more than time."},
    {"type":"heading","level":"h2","text":"When to call us"},
    {"type":"paragraph","text":"Some redness and swelling in the first few days is expected. Spreading redness, heat, worsening pain after day three, or any discharge is not. Get in touch and we will look at it. Healing problems caught early are minor."}
  ]'::jsonb
),
(
  'how-tattoos-age',
  'How tattoos age, and how to design for it',
  'Every tattoo softens. Designing with that in mind is the difference between a piece that matures well and one that turns muddy.',
  true, now(), 3,
  '[
    {"type":"paragraph","text":"Ink sits in the dermis, and the dermis is alive. Over years the pigment spreads very slightly, lines thicken, and contrast drops. This happens to every tattoo ever made. The question is only whether the design was built to survive it."},
    {"type":"heading","level":"h2","text":"Contrast outlives detail"},
    {"type":"paragraph","text":"A piece that reads through strong shapes and clear negative space will still read in twenty years. A piece that depends on hairline separation between elements will not, because those gaps close. This is why traditional work from decades ago is still legible while some highly detailed modern pieces need reworking within ten years."},
    {"type":"heading","level":"h2","text":"Where it ages fastest"},
    {"type":"paragraph","text":"Hands, fingers, feet and the inner lip take the most friction and turnover, and they fade first. Ribs and the outer arm hold up well. Areas that see daily sun age faster regardless of placement, which is again an argument for sunscreen."},
    {"type":"heading","level":"h2","text":"Colour and skin tone"},
    {"type":"paragraph","text":"Lighter pigments sit above deeper ones in visibility and fade sooner, and how a colour reads depends on the skin it is in. We will tell you honestly if a palette will not hold on your skin rather than sell you something that looks good for a year."},
    {"type":"heading","level":"h2","text":"Touch-ups are normal"},
    {"type":"paragraph","text":"A tattoo is not a one-time transaction. Most pieces benefit from a small refresh at some point. Planning for that from the start, and leaving room in the design for it, is part of doing the job properly."}
  ]'::jsonb
),
(
  'what-happens-at-a-consultation',
  'What happens at a consultation',
  'What to bring, what we will ask, and why we would rather talk for an hour than tattoo something you are unsure about.',
  true, now(), 4,
  '[
    {"type":"paragraph","text":"A consultation is free and carries no obligation to book. It exists so both sides can decide whether the idea is ready, and it is the part of the process that most determines whether you end up happy."},
    {"type":"heading","level":"h2","text":"What to bring"},
    {"type":"paragraph","text":"Bring references, including ones you dislike. Knowing what you want to avoid is often more useful to an artist than knowing what you like. If you have an existing tattoo you want the new piece to sit alongside, photograph it in good light, or come in so we can see it in person."},
    {"type":"heading","level":"h2","text":"What we will ask"},
    {"type":"paragraph","text":"Where you want it, how visible you need it to be day to day, whether you plan to extend it later, and what you do for a living, because that affects healing and placement. We will also ask about skin conditions, medication and allergies. None of this is intrusive for its own sake; it changes what we can safely do."},
    {"type":"heading","level":"h2","text":"What you leave with"},
    {"type":"paragraph","text":"Usually a direction rather than a finished drawing: a placement, a size, a rough composition and a quote. The drawing follows, and you see it before anything is booked. If the idea is not ready, we will say so and tell you what would make it ready."}
  ]'::jsonb
),
(
  'piercing-what-to-expect',
  'Getting pierced: what to expect',
  'Needle over gun, why the jewellery matters more than the piercing, and realistic healing times by placement.',
  true, now(), 5,
  '[
    {"type":"paragraph","text":"A piercing is quick, but healing is not. Most of what determines the outcome happens after you leave, and a lot of it is decided by the jewellery that goes in on day one."},
    {"type":"heading","level":"h2","text":"Needle, not gun"},
    {"type":"paragraph","text":"We pierce with a single-use sterile needle. A piercing gun forces jewellery through tissue by blunt pressure, which causes more trauma and cannot be sterilised properly between uses. A needle makes a clean channel and heals faster and more predictably. This is the standard everywhere piercing is taken seriously."},
    {"type":"heading","level":"h2","text":"Jewellery is not an afterthought"},
    {"type":"paragraph","text":"Implant-grade titanium is what we use for fresh piercings. Cheaper mixed metals are the most common cause of irritation that people mistake for a badly done piercing. Sizing matters too: initial jewellery is fitted longer to allow for swelling, and is downsized once that settles. Skipping the downsize is how you end up with a crooked or migrating piercing."},
    {"type":"heading","level":"h2","text":"Realistic healing times"},
    {"type":"paragraph","text":"Earlobes take roughly six to eight weeks. Cartilage, including helix and conch, takes six to twelve months despite feeling fine much sooner. Navels and nipples are similarly slow. Feeling healed and being healed are different things, and changing jewellery too early is the most common setback we see."},
    {"type":"heading","level":"h2","text":"Aftercare is simple"},
    {"type":"paragraph","text":"Sterile saline spray twice a day, and otherwise leave it alone. Do not twist it, do not use alcohol or hydrogen peroxide, and do not let hair products or make-up sit on it. Sleep off it where you can. That is genuinely the whole routine."}
  ]'::jsonb
)
on conflict (slug) do nothing;

-- Replace the two placeholder posts only while they are still placeholders.
update blog_posts set
  excerpt = 'Who we are, how we work, and what a consultation-led studio actually means in practice.',
  blocks = '[
    {"type":"paragraph","text":"Zenspace is a tattoo and piercing studio in Andheri East, Mumbai. We work by consultation rather than by walk-in catalogue, which means the first conversation is about what you want the piece to do, not which flash sheet to pick from."},
    {"type":"heading","level":"h2","text":"How we work"},
    {"type":"paragraph","text":"Every piece starts with a conversation and a drawing made for you. We will redraw until the placement, scale and composition are right, and we will tell you plainly when an idea will not age well rather than take the booking and let you find out in five years."},
    {"type":"heading","level":"h2","text":"Hygiene is not a feature"},
    {"type":"paragraph","text":"Single-use needles, sealed sterile equipment, implant-grade jewellery and a studio cleaned to a standard we would be happy to have inspected unannounced. This is the baseline, not something to advertise."},
    {"type":"heading","level":"h2","text":"Come and talk"},
    {"type":"paragraph","text":"Consultations are free and carry no obligation. Bring an idea, bring a reference, or bring nothing at all and we will work it out from the beginning."}
  ]'::jsonb
where slug = 'welcome-to-zenspace' and blocks::text like '%placeholder%';

update blog_posts set
  excerpt = 'Saline, patience, and the handful of mistakes that cause almost every piercing problem we see.',
  blocks = '[
    {"type":"heading","level":"h2","text":"The first two weeks"},
    {"type":"paragraph","text":"Spray with sterile saline twice a day and otherwise leave the piercing alone. Do not turn or twist the jewellery. Wash your hands before touching it, and try not to touch it otherwise. Some swelling, light crusting and tenderness in the first fortnight is normal."},
    {"type":"heading","level":"h2","text":"What not to use"},
    {"type":"paragraph","text":"No alcohol, no hydrogen peroxide, no tea tree oil and no antibacterial ointments. All of them irritate healing tissue and slow it down. Saline is enough, and stronger is not better here."},
    {"type":"heading","level":"h2","text":"Give it the full time"},
    {"type":"paragraph","text":"Lobes need six to eight weeks. Cartilage needs six to twelve months even though it stops hurting long before that. Changing jewellery early is the single most common cause of irritation bumps and migration. Come to us for the first change and we will fit the right size."},
    {"type":"heading","level":"h2","text":"When something is wrong"},
    {"type":"paragraph","text":"Persistent heat, spreading redness, thick discharge or pain that increases after the first few days needs looking at. Message us with a photo and come in. Almost everything is easy to fix when it is caught early."}
  ]'::jsonb
where slug = 'aftercare-basics' and blocks::text like '%Placeholder%';

-- ─── Terms ────────────────────────────────────────────────────────
-- Only written while the page is empty or still the placeholder, so a real set
-- of terms is never overwritten.
--
-- IMPORTANT: the commercial clauses below are deliberately marked as TO CONFIRM
-- rather than invented. Deposit amounts, cancellation windows and refund rules
-- are the studio's decisions and must be filled in before this page is treated
-- as binding. Everything else states how the studio already works.
update legal_pages set
  title = 'Terms & Conditions',
  blocks = '[
    {"type":"paragraph","text":"These terms cover appointments, deposits and the work carried out at Zenspace Art and Tattoo, Andheri East, Mumbai. Please read them before booking."},
    {"type":"heading","level":"h2","text":"Age"},
    {"type":"paragraph","text":"We tattoo clients aged 18 and over. Photographic identification is required and no exceptions are made. Piercings for minors are carried out only with a parent or legal guardian present and consenting in person."},
    {"type":"heading","level":"h2","text":"Consultations and designs"},
    {"type":"paragraph","text":"Consultations are free and carry no obligation to book. Designs are drawn for you and remain the artwork of the artist who made them. We will revise a design until it is right, and we will tell you when we believe an idea will not age well."},
    {"type":"heading","level":"h2","text":"Deposits and cancellations"},
    {"type":"paragraph","text":"TO CONFIRM: state the deposit amount or percentage, whether it is deducted from the final price, how much notice is required to move an appointment, and in what circumstances a deposit is refundable. Do not publish this page until this paragraph is replaced."},
    {"type":"heading","level":"h2","text":"On the day"},
    {"type":"paragraph","text":"Come having eaten and well rested. We cannot tattoo or pierce anyone who is intoxicated or under the influence of drugs, and doing so forfeits the appointment. Tell us about any medical condition, medication, allergy or pregnancy before we begin, as some of these mean we must decline or reschedule."},
    {"type":"heading","level":"h2","text":"Aftercare and touch-ups"},
    {"type":"paragraph","text":"We give aftercare instructions with every piece and they are also published on this site. Healing depends heavily on aftercare, and we cannot take responsibility for a result affected by instructions not being followed. TO CONFIRM: state your touch-up policy, including any free window and what falls outside it."},
    {"type":"heading","level":"h2","text":"Photography"},
    {"type":"paragraph","text":"We photograph finished work for our portfolio and social media. Tell us if you would prefer your work not to be used, or not to be identifiable, and we will respect that. You can withdraw permission later and we will remove the images we control."},
    {"type":"heading","level":"h2","text":"Contact"},
    {"type":"paragraph","text":"Questions about these terms: zenspace32@gmail.com, or speak to us at the studio."}
  ]'::jsonb
where slug = 'terms'
  and (blocks is null or blocks = '[]'::jsonb or blocks::text like '%placeholder%');

-- ─── Privacy policy ───────────────────────────────────────────────
-- Only rewritten while it still holds the seeded placeholder, so an edited
-- policy is never overwritten by re-running this file.
update legal_pages set
  title = 'Privacy Policy',
  blocks = '[
    {"type":"paragraph","text":"This policy explains what personal information Zenspace Art and Tattoo collects, why we collect it, and what we do with it. It covers this website and the studio at Andheri East, Mumbai."},
    {"type":"heading","level":"h2","text":"What we collect"},
    {"type":"paragraph","text":"When you send an enquiry or a custom design request we collect the name, phone number and email address you give us, along with whatever you tell us about the work you want, including any reference images you upload. When you are tattooed or pierced we also record the information needed to do that safely, such as relevant medical history, allergies and age verification."},
    {"type":"paragraph","text":"We take photographs of finished work. Where a photograph identifies you, we ask before using it publicly."},
    {"type":"heading","level":"h2","text":"Why we collect it"},
    {"type":"paragraph","text":"To reply to your enquiry, to design and book your appointment, to carry out the work safely, and to keep the records a studio is expected to keep. We do not sell your information, and we do not use it for advertising targeting."},
    {"type":"heading","level":"h2","text":"Who can see it"},
    {"type":"paragraph","text":"Your information is visible to the Zenspace team members involved in your work. It is stored on our website hosting and database providers, who process it on our behalf and are not permitted to use it for their own purposes. We share information with anyone else only where the law requires it."},
    {"type":"heading","level":"h2","text":"How long we keep it"},
    {"type":"paragraph","text":"Enquiries that do not lead to an appointment are kept only as long as they are useful to answer you. Records connected to work we have carried out are kept longer, because a studio needs to be able to show what was done and with what equipment."},
    {"type":"heading","level":"h2","text":"Cookies and analytics"},
    {"type":"paragraph","text":"This site does not use advertising cookies or third-party tracking. Some pages embed content from other services, such as a Google map on the contact page, and those services may set their own cookies when the embedded content loads."},
    {"type":"heading","level":"h2","text":"Your choices"},
    {"type":"paragraph","text":"You can ask us what we hold about you, ask for it to be corrected, ask us to delete it where we are not required to keep it, and withdraw consent for the use of your photographs at any time. Ask us and we will act on it."},
    {"type":"heading","level":"h2","text":"Contact"},
    {"type":"paragraph","text":"For anything in this policy, email zenspace32@gmail.com or speak to us at the studio. If we change this policy the updated version appears on this page."}
  ]'::jsonb
where slug = 'privacy' and blocks::text like '%placeholder%';
