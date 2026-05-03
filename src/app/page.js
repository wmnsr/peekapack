/**
 * 📚 LEARNING NOTE: Landing Page
 * 
 * This is the first page people see when they visit our website!
 * It needs to be exciting, beautiful, and make people want to
 * explore our blind bags. We use lots of animations to make
 * it feel alive and magical.
 * 
 * "use client" is needed because we use browser features like
 * animations and scroll detection.
 */

"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { PRODUCTS, TESTIMONIALS, HOW_IT_WORKS_STEPS } from "@/lib/mockData";
import styles from "./page.module.css";

/**
 * 📚 LEARNING NOTE: Deterministic Particle Positions
 * 
 * We can't use Math.random() directly in the render because the
 * server generates different random numbers than the client.
 * This causes a "hydration mismatch" error. Instead, we use a
 * simple formula based on the index to create pseudo-random but
 * DETERMINISTIC positions — same result every time!
 */
function seededPosition(index, salt) {
  const x = ((index * 137 + salt * 53) % 100);
  return x;
}

export default function HomePage() {
  const featuredProducts = PRODUCTS.filter((p) => p.is_featured).slice(0, 4);

  /**
   * 📚 LEARNING NOTE: Intersection Observer
   * 
   * This watches elements as you scroll. When an element
   * comes into view, we add a "visible" class to trigger
   * its animation. It's how we make things "appear" as
   * you scroll down the page!
   */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.page}>
      {/* ===== HERO SECTION ===== */}
      <section className={styles.hero} id="hero">
        {/* Animated background particles */}
        <div className={styles.particles}>
          {[...Array(20)].map((_, i) => (
            <span
              key={i}
              className={styles.particle}
              style={{
                left: `${seededPosition(i, 7)}%`,
                top: `${seededPosition(i, 13)}%`,
                animationDelay: `${(i * 7) % 5}s`,
                animationDuration: `${3 + (i * 3) % 4}s`,
                fontSize: `${12 + (i * 11) % 20}px`,
              }}
            >
              {["✨", "⭐", "🌟", "💫", "🎀", "🎁", "🎊"][i % 7]}
            </span>
          ))}
        </div>

        <div className={`container ${styles.heroContent}`}>
          <div className={styles.heroBadge}>
            <span>🎀</span> Handcrafted with Love
          </div>
          <h1 className={styles.heroTitle}>
            Discover the Magic <br />
            Inside Every{" "}
            <span className={styles.heroHighlight}>Peek-a-Pack!</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Handmade blind bags filled with tiny treasures and surprises.
            <br />
            Crafted by two creative sisters — just for you! 💕
          </p>
          <div className={styles.heroCTA}>
            <Link href="/products" className="btn btn-primary btn-lg">
              🔍 Peek Inside!
            </Link>
            <Link href="#how-it-works" className="btn btn-secondary btn-lg">
              How It Works
            </Link>
          </div>

          {/* Floating blind bags */}
          <div className={styles.floatingBags}>
            <div className={`${styles.floatingBag} ${styles.bag1}`}>🎁</div>
            <div className={`${styles.floatingBag} ${styles.bag2}`}>🎀</div>
            <div className={`${styles.floatingBag} ${styles.bag3}`}>🛍️</div>
          </div>
        </div>

        {/* Wave divider */}
        <div className={styles.heroWave}>
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path
              d="M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,120 L0,120 Z"
              fill="var(--color-bg)"
            />
          </svg>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className={`section ${styles.howItWorks}`} id="how-it-works">
        <div className="container">
          <h2 className="section-title reveal">How It Works ✨</h2>
          <p className="section-subtitle reveal">
            Getting your surprise is as easy as 1-2-3!
          </p>
          <div className={styles.stepsGrid}>
            {HOW_IT_WORKS_STEPS.map((step, i) => (
              <div
                key={step.step}
                className={`${styles.stepCard} reveal reveal-delay-${i + 1}`}
              >
                <div className={styles.stepNumber}>{step.step}</div>
                <div className={styles.stepEmoji}>{step.emoji}</div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className={`section ${styles.featured}`} id="featured">
        <div className="container">
          <h2 className="section-title reveal">Our Favourite Packs 🌟</h2>
          <p className="section-subtitle reveal">
            Check out our most popular handcrafted blind bags!
          </p>
          <div className={styles.productsGrid}>
            {featuredProducts.map((product, i) => (
              <Link
                href={`/products/${product.id}`}
                key={product.id}
                className={`${styles.productCard} reveal reveal-delay-${i + 1}`}
              >
                <div className={styles.productImageWrap}>
                  <div className={styles.productPlaceholder}>
                    {product.theme === "animals" && "🐠"}
                    {product.theme === "fantasy" && "🧚"}
                    {product.theme === "food" && "🧁"}
                    {product.theme === "space" && "🚀"}
                  </div>
                  <div className={styles.productBadge}>
                    ✨ {product.theme}
                  </div>
                </div>
                <div className={styles.productInfo}>
                  <h3 className={styles.productName}>{product.name}</h3>
                  <p className={styles.productPrice}>
                    From ₹{Math.min(...product.variants.map((v) => v.price))}
                  </p>
                  <div className={styles.productSizes}>
                    {product.variants.map((v) => (
                      <span key={v.id} className={styles.sizeTag}>
                        {v.size[0].toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className={`${styles.viewAllWrap} reveal`}>
            <Link href="/products" className="btn btn-primary btn-lg">
              View All Packs 🎁
            </Link>
          </div>
        </div>
      </section>

      {/* ===== ABOUT US ===== */}
      <section className={`section ${styles.about}`} id="about">
        <div className="container">
          <div className={styles.aboutGrid}>
            <div className={`${styles.aboutImage} reveal`}>
              <div className={styles.aboutPlaceholder}>
                <span>👧🏽</span>
                <span>👧🏽</span>
              </div>
              <div className={styles.aboutDecor1}>🎨</div>
              <div className={styles.aboutDecor2}>✂️</div>
              <div className={styles.aboutDecor3}>🎀</div>
            </div>
            <div className={`${styles.aboutContent} reveal reveal-delay-2`}>
              <h2>Meet the Makers! 🎨</h2>
              <p>
                Hi! We&apos;re twin sisters who love crafting tiny things. 
                This summer, we decided to turn our hobby into something 
                special — handmade blind bags filled with miniature surprises!
              </p>
              <p>
                Every single piece inside our bags is carefully crafted, 
                painted, and packed by us. We put our hearts into each one, 
                and we hope they bring a smile to your face! 💕
              </p>
              <div className={styles.aboutStats}>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>100+</span>
                  <span className={styles.statLabel}>Miniatures Made</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>10</span>
                  <span className={styles.statLabel}>Unique Themes</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>😊</span>
                  <span className={styles.statLabel}>Happy Faces</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== WHAT'S INSIDE TEASER ===== */}
      <section className={`section ${styles.teaser}`}>
        <div className="container">
          <h2 className="section-title reveal">What&apos;s Inside? 🤫</h2>
          <p className="section-subtitle reveal">
            We can&apos;t tell you everything... but here&apos;s a tiny peek!
          </p>
          <div className={styles.teaserGrid}>
            {["🎨 Hand-painted miniatures", "✨ Sparkly accessories", "🌈 Colourful surprises", "🎀 Cute decorations", "💎 Tiny gems & charms", "🌟 Secret bonus items!"].map(
              (item, i) => (
                <div
                  key={i}
                  className={`${styles.teaserItem} reveal reveal-delay-${(i % 4) + 1}`}
                >
                  <span>{item}</span>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className={`section ${styles.testimonials}`} id="testimonials">
        <div className="container">
          <h2 className="section-title reveal">What People Say 💬</h2>
          <p className="section-subtitle reveal">
            Don&apos;t just take our word for it — hear from our happy customers!
          </p>
          <div className={styles.testimonialsGrid}>
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.id}
                className={`${styles.testimonialCard} reveal reveal-delay-${i + 1}`}
              >
                <div className={styles.testimonialEmoji}>{t.emoji}</div>
                <p className={styles.testimonialText}>&ldquo;{t.text}&rdquo;</p>
                <p className={styles.testimonialName}>— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className={`${styles.ctaBanner} reveal`}>
        <div className="container">
          <h2>Ready to Get Surprised? 🎊</h2>
          <p>Browse our collection and find your perfect blind bag!</p>
          <Link href="/products" className="btn btn-primary btn-lg">
            🎁 Peek Inside Now!
          </Link>
        </div>
      </section>
    </div>
  );
}
