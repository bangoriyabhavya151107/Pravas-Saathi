import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Parallax({
  children,
  strength = 80,
  className = '',
}) {
  const elementRef = useRef(null)

  useEffect(() => {
    const element = elementRef.current

    if (!element) return

    const animation = gsap.to(element, {
      y: strength,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })

    return () => {
      animation.kill()
    }
  }, [strength])

  return (
    <div
      ref={elementRef}
      className={className}
    >
      {children}
    </div>
  )
}