import type { SVGProps } from 'react'

type FlightFlowerProps = SVGProps<SVGSVGElement> & {
  variant: 'inspin' | 'outspin'
}

const rotations = [0, 90, 180, 270]

export function FlightFlower({ variant, ...props }: FlightFlowerProps) {
  const phase = variant === 'inspin' ? 0 : 45

  return (
    <svg
      viewBox="0 0 240 240"
      fill="none"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <g transform={`rotate(${phase} 120 120)`}>
        {rotations.map((rotation) => (
          <path
            key={rotation}
            d="M120 120C76 106 70 50 120 18C170 50 164 106 120 120Z"
            transform={`rotate(${rotation} 120 120)`}
            fill="currentColor"
            fillOpacity="0.1"
            stroke="currentColor"
            strokeOpacity="0.68"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </g>
    </svg>
  )
}
