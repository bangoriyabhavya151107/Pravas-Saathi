import { Link } from 'react-router-dom'

import Navbar from '../components/Navbar'
import ScrollProgress from '../components/ScrollProgress'
import Reveal from '../components/Reveal'
import Parallax from '../components/Parallax'
import HorizontalDestinations from '../components/HorizontalDestinations'

export default function Landing() {
  return (
    <div className="landing-page">
      <ScrollProgress />

      <Navbar />

      <main>
        <section className="hero-section">
          <div className="hero-content">
            <Reveal>
              <span className="eyebrow">
                YOUR JOURNEY · YOUR STORY
              </span>

              <h1>
                Travel
                <br />
                <em>with purpose.</em>
              </h1>

              <p>
                Discover destinations, design
                meaningful journeys, manage your
                budget and turn every trip into a
                story worth remembering.
              </p>

              <div className="hero-actions">
                <Link to="/signup">
                  Start planning →
                </Link>

                <a href="#discover">
                  Explore journeys
                </a>
              </div>
            </Reveal>
          </div>

          <Parallax
            strength={-70}
            className="hero-visual"
          >
            <div className="hero-glow" />

            <div className="floating-card card-main">
              <span>UPCOMING JOURNEY</span>

              <strong>
                Udaipur
              </strong>

              <small>
                3 days · ₹8,500
              </small>
            </div>

            <div className="floating-card card-secondary">
              <span>TRIP HEALTH</span>

              <strong>
                92%
              </strong>

              <small>
                Balanced itinerary
              </small>
            </div>

            <div className="floating-card card-mini">
              <span>PLANNING</span>
              <strong>✓</strong>
            </div>
          </Parallax>
        </section>

        <section className="statement-section">
          <Reveal>
            <span className="eyebrow">
              THE IDEA
            </span>

            <h2>
              Planning should
              <br />
              feel like part
              <br />
              of the journey.
            </h2>

            <p>
              Pravas Saathi brings destinations,
              activities, itineraries and budgets
              into one connected travel experience.
            </p>
          </Reveal>
        </section>

        <div id="discover">
          <HorizontalDestinations />
        </div>

        <section className="process-section">
          <Reveal>
            <span className="eyebrow">
              03 / THE PROCESS
            </span>

            <h2>
              From idea
              <br />
              to itinerary.
            </h2>
          </Reveal>

          <div className="process-grid">
            <Reveal delay={0}>
              <article>
                <span>01</span>

                <div>
                  <h3>Discover</h3>

                  <p>
                    Find destinations and activities
                    that match the way you want to travel.
                  </p>
                </div>
              </article>
            </Reveal>

            <Reveal delay={0.1}>
              <article>
                <span>02</span>

                <div>
                  <h3>Design</h3>

                  <p>
                    Build your itinerary around
                    your dates, interests and budget.
                  </p>
                </div>
              </article>
            </Reveal>

            <Reveal delay={0.2}>
              <article>
                <span>03</span>

                <div>
                  <h3>Experience</h3>

                  <p>
                    Track your journey, expenses and
                    memories in one place.
                  </p>
                </div>
              </article>
            </Reveal>
          </div>
        </section>

        <section className="final-cta">
          <Reveal>
            <span className="eyebrow">
              YOUR NEXT CHAPTER
            </span>

            <h2>
              Where will
              <br />
              you go next?
            </h2>

            <Link to="/signup">
              Create your journey →
            </Link>
          </Reveal>
        </section>
      </main>

      <footer className="landing-footer">
        <strong>
          Pravas Saathi.
        </strong>

        <span>
          Travel planning, reimagined.
        </span>
      </footer>
    </div>
  )
}