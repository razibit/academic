'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Markdown } from "@/lib/markdown";
import { internalRoute, publicAssetUrl } from "@/lib/routes";
import type { SiteConfig } from "@/lib/content";

type SidebarProps = {
  config: SiteConfig;
  researchInterests: string[];
  spotlight: string[];
  blogCategories: string[];
  blogYears: string[];
};

const socialIcons: Array<{ key: string; label: string; icon: string }> = [
  { key: "linkedin", label: "LinkedIn profile", icon: "linkedin.png" },
  { key: "x", label: "X (Twitter) profile", icon: "x.png" },
  { key: "github", label: "GitHub profile", icon: "github.png" },
  { key: "researchgate", label: "ResearchGate profile", icon: "researchgate.png" },
  { key: "dblp", label: "DBLP profile", icon: "dblp.png" },
  { key: "orcid", label: "ORCID profile", icon: "orcid.png" },
];

export default function AcademicSidebar({ config, researchInterests, spotlight, blogCategories, blogYears }: SidebarProps) {
  const pathname = usePathname();
  const isBlog = pathname.includes("/blog");

  return <aside className="left-sidebar">
    <div className="profile-container">
      {config.author.avatar ? <img className="profile-pic" src={publicAssetUrl(config.author.avatar)} alt={config.author.name} width={150} height={150} /> : <div className="profile-pic placeholder-avatar" role="img" aria-label="Profile image placeholder">Profile image<br />to add</div>}
      <h2>{config.author.name}</h2>
    </div>

    <div className="university-info">
      {config.author.title && <p>{config.author.title}</p>}
      {config.author.department && <p>{config.author.department}</p>}
      {config.author.institution && <p>{config.author.institution}</p>}
    </div>

    {(config.author.email_display || config.author.email || config.author.location) && <div className="contact-info">
      {(config.author.email_display || config.author.email) && <p><img src={publicAssetUrl("/assets/icons/social_icons/email.png")} alt="" className="icon" aria-hidden="true" /><span>{config.author.email_display ?? config.author.email}</span></p>}
      {config.author.location && <p><img src={publicAssetUrl("/assets/icons/social_icons/location.png")} alt="" className="icon" aria-hidden="true" /><span>{config.author.location}</span></p>}
    </div>}

    <div className="social-links" aria-label="Social media links">
      {socialIcons.map((social) => {
        const href = config.social?.[social.key];
        if (!href) return null;
        return <a key={social.key} href={href} className="social-icon" aria-label={social.label} target={href.startsWith("/") ? undefined : "_blank"} rel={href.startsWith("/") ? undefined : "noreferrer"}>
          <img src={publicAssetUrl(`/assets/icons/social_icons/${social.icon}`)} alt="" className="icon" aria-hidden="true" />
        </a>;
      })}
    </div>

    {researchInterests.length > 0 && <section className="section" aria-labelledby="research-interests">
      <h3 id="research-interests">Research Interest</h3>
      {researchInterests.map((interest) => <p key={interest}>{interest}</p>)}
    </section>}

    {spotlight.length > 0 && <section className="section" aria-labelledby="spotlight">
      <h3 id="spotlight">Spotlight!</h3>
      {spotlight.map((item, index) => <Markdown key={`${index}-${item}`} content={`${index + 1}. ${item}`} className="sidebar-markdown" />)}
    </section>}

    {isBlog && <>
      <section className="section" aria-labelledby="blog-categories">
        <h3 id="blog-categories">Categories</h3>
        <ul className="category-list">
          {blogCategories.map((category) => <li key={category}><Link href={internalRoute(`/blog/?tag=${encodeURIComponent(category)}`)}>{category}</Link></li>)}
        </ul>
      </section>
      <section className="section" aria-labelledby="blog-archive">
        <h3 id="blog-archive">Archive</h3>
        <ul className="archive-list">
          {blogYears.map((year) => <li key={year}><Link href={internalRoute(`/blog/?year=${year}`)}>{year}</Link></li>)}
        </ul>
      </section>
    </>}
  </aside>;
}
