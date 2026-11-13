const guideUrl =
  "https://github.com/TandemCreativeDev/cbc/blob/main/docs/admin-guide.md";

const links = [
  {
    href: "/admin/collections/tour-dates",
    en: "Tour dates",
    fr: "Dates de tournée",
  },
  { href: "/admin/collections/lyrics", en: "Lyrics", fr: "Paroles" },
  {
    href: "/admin/globals/about-page",
    en: "Carousel photos (About page)",
    fr: "Photos du carrousel (page À propos)",
  },
];

export const DashboardWelcome = () => (
  <section className="clarks-welcome" aria-labelledby="clarks-welcome-title">
    <h2 id="clarks-welcome-title">Welcome back / Bon retour</h2>
    <p lang="en">Edit the site here. Pick a page to get going:</p>
    <p lang="fr">Modifiez le site ici. Choisissez une page pour commencer :</p>
    <ul>
      {links.map(({ href, en, fr }) => (
        <li key={href}>
          <a href={href}>
            {en} <span lang="fr">/ {fr}</span>
          </a>
        </li>
      ))}
    </ul>
    <p>
      <a href={guideUrl} target="_blank" rel="noopener noreferrer">
        Band guide / Guide du groupe
      </a>
    </p>
  </section>
);
