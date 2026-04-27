import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

const SEED_POSTS = [
  {
    slug: "bpc-157-regeneracija-tkiv",
    tag: "Regeneracija",
    tag_icon: "ri-first-aid-kit-line",
    published_at: "2026-03-12",
    read_minutes: 6,
    cover_image: "/blog/bpc157.jpg",
    title: {
      slo: "BPC-157: Kaj pravijo raziskave o regeneraciji tkiv?",
      eng: "BPC-157: What Does Research Say About Tissue Regeneration?",
    },
    intro: {
      slo: "BPC-157 (Body Protection Compound) je pentadekapeptid, izoliran iz proteina v človeškem želodčnem soku. V zadnjih dveh desetletjih je postal eden najpogosteje proučevanih peptidov na področju regenerativne medicine.",
      eng: "BPC-157 (Body Protection Compound) is a pentadecapeptide isolated from a protein found in human gastric juice. Over the past two decades it has become one of the most studied peptides in regenerative medicine research.",
    },
    body: [
      {
        head: { slo: "Mehanizem delovanja", eng: "Mechanism of Action" },
        text: {
          slo: "BPC-157 spodbuja sintezo kolagena in angiogenezo – proces nastajanja novih žil. V in vitro in in vivo modelih je peptid pokazal sposobnost aktivacije receptorjev za rastni hormon, kar posredno vpliva na popravilo mišičnega in vezivnega tkiva. Posebej izrazit je vpliv na fibroblaste, ki so ključni za celjenje ran in obnovo sklepnih struktur.",
          eng: "BPC-157 promotes collagen synthesis and angiogenesis — the formation of new blood vessels. In vitro and in vivo models have shown the peptide can activate growth hormone receptors, indirectly influencing muscle and connective tissue repair. Its effect on fibroblasts is particularly notable, as these cells are key to wound healing and joint structure restoration.",
        },
      },
      {
        head: { slo: "Zaščita prebavil", eng: "Gastrointestinal Protection" },
        text: {
          slo: "Izvorni kontekst odkritja BPC-157 je gastroenterologija. Peptid je pokazal zaščitno delovanje na sluznico prebavnega trakta pri modelih razjed, vnetja črevesja in poškodb jeter. Aktivira sistem dušikovega oksida (NO), ki uravnava pretok krvi v prebavilih in pomaga vzdrževati integriteto sluznice.",
          eng: "BPC-157 was originally discovered in gastroenterology research. The peptide has demonstrated protective effects on gastrointestinal mucosa in ulcer, inflammatory bowel disease, and liver injury models. It activates the nitric oxide (NO) system, which regulates blood flow in the digestive tract and helps maintain mucosal integrity.",
        },
      },
      {
        head: { slo: "Trenutno stanje raziskav", eng: "Current State of Research" },
        text: {
          slo: "Večina obstoječih podatkov izhaja iz živalskih modelov (podgane, miši), kjer so bili opaženi izjemni učinki pri celjenju tetiv, ligamentov, mišic in kosti. Humanih kliničnih preizkušanj z BPC-157 je malo, kar pomeni, da mehanizmi pri ljudeh še niso dokončno potrjeni. Peptid ostaja izjemno zanimiv predmet nadaljnjih raziskav v regenerativni medicini.",
          eng: "Most existing data comes from animal models (rats, mice), where remarkable effects were observed in the healing of tendons, ligaments, muscles, and bones. Human clinical trials with BPC-157 are limited, meaning the mechanisms in humans have not yet been definitively confirmed. The peptide remains a highly compelling subject for further research in regenerative medicine.",
        },
      },
    ],
    cta_product: "BPC-157",
  },
  {
    slug: "epithalon-telomere-staranje",
    tag: "Dolgoživost",
    tag_icon: "ri-leaf-line",
    published_at: "2026-03-03",
    read_minutes: 5,
    cover_image: "/blog/epithalon.jpg",
    title: {
      slo: "Epithalon in telomere: Ali je upočasnitev staranja mogoča?",
      eng: "Epithalon and Telomeres: Is Slowing Ageing Possible?",
    },
    intro: {
      slo: "Epithalon je tetrapeptid (Ala-Glu-Asp-Gly), ki ga je razvil ruski biolog Vladimir Khavinson kot sintetični analog epitalamina – peptida, ki ga izloča epifiza. V laboratorijskih pogojih je pokazal sposobnost podaljševanja telomer in modulacije cirkadianih ritmov.",
      eng: "Epithalon is a tetrapeptide (Ala-Glu-Asp-Gly) developed by Russian biologist Vladimir Khavinson as a synthetic analogue of epithalamin — a peptide secreted by the pineal gland. Under laboratory conditions it has shown the ability to lengthen telomeres and modulate circadian rhythms.",
    },
    body: [
      {
        head: { slo: "Telomere in telomeraza", eng: "Telomeres and Telomerase" },
        text: {
          slo: "Telomere so zaščitne kapice na koncih kromosomov, ki se z vsako celično delitvijo krajšajo. Ko postanejo prekratke, celica vstopi v senescenco ali apoptozo. Telomeraza je encim, ki telomere podaljšuje – pri večini somatskih celic je izklopljen, a ga je mogoče reaktivirati. Epithalon naj bi po rezultatih preliminarnih raziskav stimuliral aktivnost telomeraze in upočasnil krajšanje telomer.",
          eng: "Telomeres are protective caps at the ends of chromosomes that shorten with each cell division. When they become too short, the cell enters senescence or apoptosis. Telomerase is the enzyme that lengthens telomeres — typically switched off in most somatic cells, but potentially reactivatable. Preliminary research suggests Epithalon may stimulate telomerase activity and slow telomere shortening.",
        },
      },
      {
        head: { slo: "Epifiza in melatonin", eng: "Pineal Gland and Melatonin" },
        text: {
          slo: "Epithalon je bil odkrit s strani ruskega biologa Vladimira Khavinsona in je sintetični analog epitalamina – peptida, ki ga izloča epifiza. Epifiza uravnava cirkadiane ritme in izločanje melatonina. Khavinson in sodelavci so v seriji objavljenih študij poročali o podaljšanju življenjske dobe pri miših in izboljšanju imunskih funkcij pri starejših prostovoljcih.",
          eng: "Epithalon was developed as a synthetic analogue of epithalamin — a peptide secreted by the pineal gland, which regulates circadian rhythms and melatonin secretion. Khavinson and colleagues reported in a series of published studies on lifespan extension in mice and improved immune function in elderly volunteers.",
        },
      },
      {
        head: { slo: "Kaj še ne vemo", eng: "What We Still Don't Know" },
        text: {
          slo: "Večina Epithalon študij izhaja iz ene same ruske raziskovalne skupine, kar otežuje neodvisno replikacijo rezultatov. Zahodne regulatorne agencije niso odobrile peptida za klinično uporabo. Prav tako ni jasno, kako dolgotrajna uporaba vpliva na tveganje za celično rast – stimulacija telomeraze je namreč dvojno rezilo: upočasni staranje, a teoretično poveča tveganje za nekontrolirano celično proliferacijo.",
          eng: "Most Epithalon studies originate from a single Russian research group, making independent replication difficult. Western regulatory agencies have not approved the peptide for clinical use. It also remains unclear how long-term use affects cancer risk — stimulating telomerase is a double-edged sword that may slow aging but theoretically increases the risk of uncontrolled cell proliferation.",
        },
      },
    ],
    cta_product: "Epithalon",
  },
];

export async function POST() {
  const supabase = createServiceClient();

  const results: { slug: string; status: string }[] = [];

  for (const post of SEED_POSTS) {
    const { error } = await supabase
      .from("blog_posts")
      .upsert(post, { onConflict: "slug" });

    results.push({ slug: post.slug, status: error ? `error: ${error.message}` : "ok" });
  }

  return NextResponse.json({ results });
}
