import { useEffect, useState } from 'react'

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function updateProgress() {
      const scrollTop = window.scrollY

      const documentHeight =
        document.documentElement.scrollHeight -
        window.innerHeight

      if (documentHeight <= 0) {
        setProgress(0)
        return
      }

      setProgress(
        Math.min(
          100,
          Math.max(
            0,
            (scrollTop / documentHeight) * 100
          )
        )
      )
    }

    updateProgress()

    window.addEventListener(
      'scroll',
      updateProgress,
      { passive: true }
    )

    window.addEventListener(
      'resize',
      updateProgress
    )

    return () => {
      window.removeEventListener(
        'scroll',
        updateProgress
      )

      window.removeEventListener(
        'resize',
        updateProgress
      )
    }
  }, [])

  return (
    <div className="scroll-progress">
      <div
        className="scroll-progress-bar"
        style={{
          transform: `scaleX(${progress / 100})`,
        }}
      />
    </div>
  )
}