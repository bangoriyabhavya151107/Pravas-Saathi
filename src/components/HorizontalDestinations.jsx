import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const destinations = [
  {
    name: 'Ahmedabad',
    region: 'Gujarat',
    description:
      'Heritage, architecture, food and stories from the heart of Gujarat.',
  },
  {
    name: 'Udaipur',
    region: 'Rajasthan',
    description:
      'Lakes, palaces and slow evenings surrounded by Aravalli landscapes.',
  },
  {
    name: 'Jaipur',
    region: 'Rajasthan',
    description:
      'The Pink City — forts, markets, architecture and Rajasthani culture.',
  },
  {
    name: 'Goa',
    region: 'West Coast',
    description:
      'Beaches, nature, local food and a slower coastal rhythm.',
  },
  {
    name: 'Kerala',
    region: 'South India',
    description:
      'Backwaters, greenery, culture and unforgettable landscapes.',
  },
  {
    name: 'Manali',
    region: 'Himachal Pradesh',
    description:
      'Mountains, adventure and peaceful Himalayan escapes.',
  },
]

export default function HorizontalDestinations() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current

    if (!section || !track) return

    const context = gsap.context(() => {
      const getDistance = () => {
        return Math.max(
          0,
          track.scrollWidth -
            window.innerWidth +
            window.innerWidth * 0.08
        )
      }

      gsap.to(track, {
        x: () => -getDistance(),
        ease: 'none',

        scrollTrigger: {
          trigger: section,

          start: 'top top',

          end: () => `+=${getDistance()}`,

          pin: true,

          scrub: 1,

          anticipatePin: 1,

          invalidateOnRefresh: true,
        },
      })
    }, section)

    return () => {
      context.revert()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="horizontal-section"
    >
      <div className="horizontal-header">
        <span className="eyebrow">
          02 / EXPLORE
        </span>

        <h2>
          Every place
          <br />
          has a story.
        </h2>

        <p>
          Scroll to explore destinations.
        </p>
      </div>

      <div
        ref={trackRef}
        className="destination-track"
      >
        {destinations.map(
          (destination, index) => (
            <article
              className="destination-panel"
              key={destination.name}
            >
              <div className="destination-number">
                {String(index + 1).padStart(2, '0')}
              </div>

              <div>
                <span>
                  {destination.region}
                </span>

                <h3>
                  {destination.name}
                </h3>

                <p>
                  {destination.description}
                </p>

                <button type="button">
                  Discover →
                </button>
              </div>
            </article>
          )
        )}
      </div>
    </section>
  )
}