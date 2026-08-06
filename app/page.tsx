"use client";

/* eslint-disable @next/next/no-img-element -- local WebP and editorial source assets are already optimized */
import { type CSSProperties, type KeyboardEvent, useEffect, useMemo, useState } from "react";
import { FrameSequence } from "./components/FrameSequence";
import { siteConfig } from "./site.config";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [selectedNeed, setSelectedNeed] = useState(0);
  const [selectedDoctor, setSelectedDoctor] = useState(0);

  const doctor = siteConfig.professionals[selectedDoctor];
  const jsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "Dentist",
      name: siteConfig.name,
      description: siteConfig.seo.description,
      telephone: [siteConfig.whatsapp, siteConfig.phone],
      address: {
        "@type": "PostalAddress",
        streetAddress: "R. Tibagi, 3587",
        addressLocality: "Votuporanga",
        addressRegion: "SP",
        postalCode: "15500-007",
        addressCountry: "BR",
      },
      sameAs: [siteConfig.instagram],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: siteConfig.reputation.rating.replace(",", "."),
        reviewCount: siteConfig.reputation.reviewCount,
      },
    }),
    [],
  );

  useEffect(() => {
    const resetInitialScroll = () => {
      if (!window.location.hash) window.scrollTo(0, 0);
    };

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const animationFrame = window.requestAnimationFrame(resetInitialScroll);
    window.addEventListener("pageshow", resetInitialScroll);
    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("pageshow", resetInitialScroll);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const hero = document.querySelector<HTMLElement>("#top");
      setScrolled(Boolean(hero && hero.getBoundingClientRect().bottom <= 80));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const changeDoctorWithKeyboard = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const next = event.key === "ArrowRight" ? (selectedDoctor + 1) % 2 : (selectedDoctor + 1) % 2;
    setSelectedDoctor(next);
    document.getElementById(`doctor-tab-${next}`)?.focus();
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className={`site-header ${scrolled || menuOpen ? "is-solid" : ""} ${menuOpen ? "menu-active" : ""}`}>
        <a className="wordmark" href="#top" aria-label="DuoDent, início">
          <span>Duo</span>Dent
        </a>
        <nav className="desktop-nav" aria-label="Navegação principal">
          {siteConfig.navigation.map(([label, href]) => (
            <a key={href} href={href}>{label}</a>
          ))}
        </nav>
        <a className="header-cta" href={siteConfig.whatsappHref} target="_blank" rel="noreferrer">
          Agendar
        </a>
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          onClick={() => setMenuOpen((value) => !value)}
        >
          <span />
          <span />
        </button>
      </header>

      <div id="mobile-menu" className={`mobile-menu ${menuOpen ? "is-open" : ""}`} aria-hidden={!menuOpen}>
        <nav aria-label="Navegação móvel">
          {siteConfig.navigation.map(([label, href], index) => (
            <a key={href} href={href} onClick={() => setMenuOpen(false)}>
              <span>0{index + 1}</span>{label}
            </a>
          ))}
        </nav>
        <div className="mobile-menu-contact">
          <a href={siteConfig.whatsappHref} target="_blank" rel="noreferrer">{siteConfig.whatsapp}</a>
          <p>{siteConfig.address}</p>
        </div>
      </div>

      <FrameSequence
        id="top"
        className="hero-sequence"
        desktopCount={72}
        mobileCount={36}
        desktopPath="/media/hero-hq-desktop"
        mobilePath="/media/hero-hq-mobile"
        desktopPoster="/media/hero-hq-desktop/frame-001.webp"
        mobilePoster="/media/hero-hq-mobile/frame-001.webp"
        fallbackVideo="/media/video/hero-enhanced.mp4"
        ariaLabel="Entrada cinematográfica na clínica DuoDent"
      >
        {(progress) => {
          const clamp = (value: number) => Math.max(0, Math.min(1, value));
          const firstOpacity = clamp(1 - progress / 0.34);
          const secondOpacity = clamp((progress - 0.18) / 0.12) * clamp((0.72 - progress) / 0.14);
          const finalOpacity = clamp((progress - 0.66) / 0.17);

          return (
          <div className="hero-layer">
            <div
              className="hero-stage hero-stage-one"
              style={{ opacity: firstOpacity, transform: `translate3d(0, ${progress * -70}px, 0) scale(${1 - progress * 0.045})`, pointerEvents: firstOpacity > 0.25 ? "auto" : "none" }}
              aria-hidden={firstOpacity < 0.05}
            >
              <div className="hero-rating"><span aria-hidden="true">★</span>{siteConfig.reputation.rating} no Google <i /> {siteConfig.reputation.reviewCount} avaliações</div>
              <p className="eyebrow">{siteConfig.copy.hero.kicker}</p>
              <h1>{siteConfig.copy.hero.title}</h1>
              <p className="hero-support">{siteConfig.copy.hero.support}</p>
              <div className="hero-actions">
                <a className="button button-primary" href={siteConfig.whatsappHref} target="_blank" rel="noreferrer" tabIndex={firstOpacity > 0.35 ? 0 : -1}>{siteConfig.copy.hero.primaryCta} <span aria-hidden="true">↗</span></a>
              </div>
            </div>

            <div
              className="hero-stage hero-stage-two"
              style={{ opacity: secondOpacity, transform: `translate3d(0, ${(0.46 - progress) * 58}px, 0)`, pointerEvents: "none" }}
              aria-hidden={secondOpacity < 0.05}
            >
              <p className="eyebrow">{siteConfig.copy.hero.secondKicker}</p>
              <h2>{siteConfig.copy.hero.secondTitle}</h2>
              <p className="hero-support">{siteConfig.copy.hero.secondSupport}</p>
            </div>

            <div
              className="hero-stage hero-stage-three"
              style={{ opacity: finalOpacity, transform: `translate3d(0, ${(1 - finalOpacity) * 38}px, 0)`, pointerEvents: finalOpacity > 0.35 ? "auto" : "none" }}
              aria-hidden={finalOpacity < 0.05}
            >
              <p className="eyebrow">{siteConfig.copy.hero.finalKicker}</p>
              <h2>{siteConfig.copy.hero.finalTitle}</h2>
              <p className="hero-support">{siteConfig.copy.hero.finalSupport}</p>
              <div className="hero-actions">
                <a className="button button-primary" href={siteConfig.whatsappHref} target="_blank" rel="noreferrer" tabIndex={finalOpacity > 0.35 ? 0 : -1}>{siteConfig.copy.hero.primaryCta} <span aria-hidden="true">↗</span></a>
                <a className="button button-ghost" href="#clinica" tabIndex={finalOpacity > 0.35 ? 0 : -1}>{siteConfig.copy.hero.secondaryCta}</a>
              </div>
            </div>
            <div className="hero-progress" aria-hidden="true">
              <span style={{ transform: `scaleX(${Math.max(0.03, progress)})` }} />
            </div>
            <p className="scroll-cue"><span /> Role para entrar</p>
          </div>
          );
        }}
      </FrameSequence>

      <section className="trust-rail" id="clinica" aria-label="Sinais de confiança">
        <div><strong>{siteConfig.reputation.rating}</strong><span>no Google</span></div>
        <div><strong>{siteConfig.reputation.reviewCount}</strong><span>avaliações</span></div>
        <div><strong>{siteConfig.reputation.years} anos</strong><span>de DuoDent</span></div>
        <div><strong>Humano</strong><span>em cada atendimento</span></div>
      </section>

      <section className="intro-section section-shell">
        <div className="section-heading intro-heading">
          <p className="section-index">01 — Boas-vindas</p>
          <div>
            <p className="eyebrow dark">{siteConfig.copy.intro.kicker}</p>
            <h2>{siteConfig.copy.intro.title}</h2>
          </div>
        </div>
        <div className="clinic-feature">
          <figure>
            <img src="/media/clinic/recepcao-detalhe.webp" alt="Detalhe da recepção da nova DuoDent" width="900" height="1049" loading="lazy" />
          </figure>
          <div>
            <p className="eyebrow dark">{siteConfig.copy.intro.featureKicker}</p>
            <h3>{siteConfig.copy.intro.featureTitle}</h3>
            <p>{siteConfig.copy.intro.featureText}</p>
          </div>
        </div>
        <div className="intro-details">
          <p className="intro-lead">{siteConfig.copy.intro.lead}</p>
          <div className="intro-pillars">
            <article><span>01</span><h3>Tradição</h3><p>Uma história de 11 anos construída em Votuporanga.</p></article>
            <article><span>02</span><h3>Tecnologia</h3><p>Recursos a serviço de decisões clínicas cuidadosas.</p></article>
            <article><span>03</span><h3>Acolhimento</h3><p>Atendimento humano desde a primeira conversa.</p></article>
          </div>
        </div>
      </section>

      <section className="needs-section section-shell" id="tratamentos">
        <div className="needs-heading">
          <p className="section-index">02 — Possibilidades de cuidado</p>
          <p className="eyebrow dark">{siteConfig.copy.needs.kicker}</p>
          <h2>{siteConfig.copy.needs.title}</h2>
          <p>{siteConfig.copy.needs.support}</p>
        </div>

        <div className="needs-stack">
          {siteConfig.needs.map((need, index) => {
            const isSelected = selectedNeed === index;
            return (
              <article
                className={`need-card ${isSelected ? "is-selected" : ""}`}
                key={need.title}
                style={{ "--card-index": index } as CSSProperties}
              >
                <button
                  type="button"
                  aria-expanded={isSelected}
                  aria-controls={`need-panel-${index}`}
                  onClick={() => setSelectedNeed(isSelected ? -1 : index)}
                >
                  <span className="need-number">0{index + 1}</span>
                  <span className="need-title">{need.title}</span>
                  <span className="need-toggle" aria-hidden="true">{isSelected ? "−" : "+"}</span>
                </button>
                <div className="need-panel" id={`need-panel-${index}`}>
                  <p className="need-label">{need.label}</p>
                  <p>{need.text}</p>
                  <small>A indicação depende de avaliação individual.</small>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <FrameSequence
        id="jornada"
        className="corridor-sequence"
        desktopCount={32}
        mobileCount={18}
        desktopPath="/media/corridor-desktop"
        mobilePath="/media/corridor-mobile"
        desktopPoster="/media/corridor-desktop/frame-001.webp"
        mobilePoster="/media/corridor-mobile/frame-001.webp"
        fallbackVideo="/media/video/corredor.mp4"
        ariaLabel="Percurso pelo corredor da clínica DuoDent"
      >
        {(progress) => {
          const activePrinciple = Math.min(2, Math.floor(progress * 3));
          return (
            <div className="corridor-layer">
              <div className="corridor-topline">
                <p>03 — Caminho do cuidado</p>
                <span>{String(activePrinciple + 1).padStart(2, "0")} / 03</span>
              </div>
              <div className="corridor-principles" aria-live="polite">
                {siteConfig.copy.corridor.principles.map((principle, index) => (
                  <p className={activePrinciple === index ? "is-active" : ""} key={principle}>{principle}</p>
                ))}
              </div>
              <blockquote className={progress > 0.75 ? "is-visible" : ""}>
                “{siteConfig.copy.corridor.quote}”
              </blockquote>
              <div className="corridor-progress" aria-hidden="true">
                <span style={{ transform: `scaleX(${Math.max(0.02, progress)})` }} />
              </div>
            </div>
          );
        }}
      </FrameSequence>

      <section className="professionals-section section-shell" id="profissionais">
        <div className="section-heading professionals-heading">
          <p className="section-index">04 — Profissionais</p>
          <div>
            <p className="eyebrow dark">{siteConfig.copy.professionals.kicker}</p>
            <h2>{siteConfig.copy.professionals.title}</h2>
          </div>
        </div>

        <div className="professionals-layout">
          <figure className="couple-portrait">
            <img src="/media/people/casal-doutores.jpg" alt="Dra. Daniela e Dr. Vitor no corredor da DuoDent" width="1080" height="1350" loading="lazy" />
            <figcaption>11 anos de DuoDent</figcaption>
          </figure>

          <div className="doctor-profile">
            <div className="doctor-tabs" role="tablist" aria-label="Escolha um profissional">
              {siteConfig.professionals.map((professional, index) => (
                <button
                  id={`doctor-tab-${index}`}
                  key={professional.id}
                  type="button"
                  role="tab"
                  aria-selected={selectedDoctor === index}
                  aria-controls="doctor-panel"
                  tabIndex={selectedDoctor === index ? 0 : -1}
                  onClick={() => setSelectedDoctor(index)}
                  onKeyDown={changeDoctorWithKeyboard}
                >
                  {professional.name.replace("Dr. ", "").replace("Dra. ", "")}
                </button>
              ))}
            </div>

            <div className="doctor-card" id="doctor-panel" role="tabpanel" aria-labelledby={`doctor-tab-${selectedDoctor}`}>
              <div className="doctor-art">
                <img src={doctor.image} alt={`Retrato de ${doctor.name}`} width="349" height="526" loading="lazy" />
              </div>
              <div className="doctor-content">
                <p className="eyebrow dark">Atuação em</p>
                <h3>{doctor.name}</h3>
                <p className="cro">{doctor.cro}</p>
                <ul>
                  {doctor.areas.map((area) => <li key={area}>{area}</li>)}
                </ul>
                <a href={siteConfig.whatsappHref} target="_blank" rel="noreferrer">Agendar uma avaliação <span aria-hidden="true">↗</span></a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="stories-section" id="historias">
        <div className="stories-copy">
          <p className="section-index light">05 — Histórias reais</p>
          <p className="eyebrow">{siteConfig.copy.stories.kicker}</p>
          <h2>{siteConfig.copy.stories.title}</h2>
          <p>{siteConfig.copy.stories.consentNote}</p>
        </div>
        {siteConfig.mediaConsent.patientMediaAuthorized ? (
          <div className="stories-mosaic patient-mosaic" aria-label="Histórias de pacientes da DuoDent">
            {siteConfig.patientStories.map((story) => (
              <figure key={story.image}>
                <img src={story.image} alt={story.alt} width="720" height="1000" loading="lazy" style={{ "--patient-position": story.position } as CSSProperties} />
                <figcaption>{story.caption}</figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div className="stories-mosaic" aria-label="Detalhes do ambiente da DuoDent">
            <figure className="story-large">
              <img src="/media/hero-desktop/frame-051.webp" alt="Recepção iluminada da clínica DuoDent" width="1600" height="900" loading="lazy" />
              <figcaption>Ambiente que acolhe</figcaption>
            </figure>
            <figure>
              <img src="/media/corridor-desktop/frame-016.webp" alt="Linhas de luz no corredor da DuoDent" width="1600" height="900" loading="lazy" />
              <figcaption>Caminhos pensados com cuidado</figcaption>
            </figure>
            <figure>
              <img src="/media/hero-desktop/frame-030.webp" alt="Detalhes arquitetônicos da clínica DuoDent" width="1600" height="900" loading="lazy" />
              <figcaption>Presença em cada detalhe</figcaption>
            </figure>
          </div>
        )}
      </section>

      <section className="reviews-section section-shell" id="avaliacoes">
        <div className="reviews-score">
          <p className="section-index">06 — Avaliações no Google</p>
          <strong>{siteConfig.reputation.rating}</strong>
          <div aria-label="5 estrelas">★★★★★</div>
          <p>{siteConfig.reputation.reviewCount} avaliações informadas</p>
        </div>
        <div className="reviews-content">
          <p className="eyebrow dark">{siteConfig.copy.reviews.kicker}</p>
          <h2>{siteConfig.copy.reviews.title}</h2>
          <div className="review-list">
            {siteConfig.reviews.map((review, index) => (
              <article key={review}>
                <span>“</span>
                <p>{review}</p>
                <small>Tema recorrente nas avaliações</small>
                <i>0{index + 1}</i>
              </article>
            ))}
          </div>
          <p className="reviews-note">A quantidade de avaliações pode mudar e deve ser atualizada nas informações do site.</p>
        </div>
      </section>

      <section className="faq-section section-shell" id="faq">
        <div className="faq-heading">
          <p className="section-index">07 — Antes da sua visita</p>
          <p className="eyebrow dark">{siteConfig.copy.faq.kicker}</p>
          <h2>{siteConfig.copy.faq.title}</h2>
        </div>
        <div className="faq-list">
          {siteConfig.faqs.map((item, index) => (
            <details key={item.question} open={index === 0}>
              <summary><span>0{index + 1}</span>{item.question}<i aria-hidden="true">+</i></summary>
              <div><p>{item.answer}</p></div>
            </details>
          ))}
        </div>
      </section>

      <section className="contact-section" id="contato">
        <div className="contact-orbit" aria-hidden="true"><span /></div>
        <div className="contact-main">
          <p className="eyebrow">{siteConfig.copy.contact.kicker}</p>
          <h2>{siteConfig.copy.contact.title}</h2>
          <div className="contact-actions">
            <a className="button button-light" href={siteConfig.whatsappHref} target="_blank" rel="noreferrer">Conversar no WhatsApp <span aria-hidden="true">↗</span></a>
            <a className="button button-outline" href={siteConfig.directions} target="_blank" rel="noreferrer">Como chegar</a>
            <a className="button button-outline" href={siteConfig.instagram} target="_blank" rel="noreferrer">Ver Instagram</a>
          </div>
        </div>
        <div className="contact-details">
          <div><span>Endereço</span><p>{siteConfig.address}</p></div>
          <div><span>Contato</span><a href={siteConfig.phoneHref}>{siteConfig.phone}</a><a href={siteConfig.whatsappHref} target="_blank" rel="noreferrer">{siteConfig.whatsapp}</a></div>
          <div><span>Horários</span><p>Consulte os horários atualizados pelo WhatsApp.</p></div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-brand"><a className="wordmark" href="#top"><span>Duo</span>Dent</a><p>Odontologia Especializada</p></div>
        <div><strong>Visite</strong><p>{siteConfig.address}</p></div>
        <div><strong>Converse</strong><a href={siteConfig.whatsappHref} target="_blank" rel="noreferrer">{siteConfig.whatsapp}</a><a href={siteConfig.phoneHref}>{siteConfig.phone}</a><a href={siteConfig.instagram} target="_blank" rel="noreferrer">Instagram</a></div>
        <div><strong>Profissionais</strong>{siteConfig.professionals.map((professional) => <p key={professional.id}>{professional.name}<br />{professional.cro}</p>)}</div>
        <p className="footer-bottom">© {new Date().getFullYear()} DuoDent. Comunicação informativa, sem promessa de resultados.</p>
      </footer>

      <div className="mobile-booking-bar">
        <a href={siteConfig.whatsappHref} target="_blank" rel="noreferrer">Agendar avaliação <span aria-hidden="true">↗</span></a>
      </div>
    </main>
  );
}
