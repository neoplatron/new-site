import SEO from "../components/SEO";

export interface LegalSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
}

interface LegalPageProps {
  title: string;
  description: string;
  path: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}

const LegalPage = ({ title, description, path, updated, intro, sections }: LegalPageProps) => (
  <main className="pt-28 pb-16 bg-bg dark:bg-d-bg min-h-screen">
    <SEO title={`${title} | Neoplatron`} description={description} canonical={path} />
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="font-title text-3xl sm:text-4xl font-bold text-text dark:text-d-text mb-2">{title}</h1>
      <p className="text-sm text-text-muted dark:text-d-text-muted mb-8">Last updated: {updated}</p>
      <p className="text-text-para dark:text-d-text-para mb-8 leading-relaxed">{intro}</p>

      <div className="space-y-8">
        {sections.map((s, i) => (
          <section key={s.heading}>
            <h2 className="font-title text-xl font-semibold text-text dark:text-d-text mb-3">
              {i + 1}. {s.heading}
            </h2>
            {s.paragraphs?.map((p) => (
              <p key={p} className="text-text-para dark:text-d-text-para leading-relaxed mb-3">
                {p}
              </p>
            ))}
            {s.bullets && (
              <ul className="list-disc pl-6 space-y-1.5 text-text-para dark:text-d-text-para leading-relaxed">
                {s.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  </main>
);

export default LegalPage;
