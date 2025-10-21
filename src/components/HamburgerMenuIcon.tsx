import type { SVGProps } from "react"

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={40}
    height={40}
    viewBox="0 0 32 32"
    {...props}
  >
    <path 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.6"
      d="M7 10h18M7 16h18M7 22h18" 
    />
  </svg>
)

export default SvgComponent
