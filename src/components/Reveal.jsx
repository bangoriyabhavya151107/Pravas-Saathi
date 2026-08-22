import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Reveal({
  children,
  className = '',
  delay = 0,
}) {
  const elementRef = useRef(null)

  useEffect(() => {
    const element = elementRef.current

    if (!element) return

    const animation = gsap.fromTo(
      element,
      {
        opacity: 0,
        y: 60,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 88%',
          once: true,
        },
      }
    )

    return () => {
      animation.kill()
    }
  }, [delay])

  return (
    <div
      ref={elementRef}
      className={className}
    >
      {children}
    </div>
  )
}