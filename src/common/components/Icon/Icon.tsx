import { FC } from "react"
import styles from './Icon.module.sass'
import clsx from 'clsx'

type SVGProps = JSX.IntrinsicElements["svg"]

interface IconProps extends SVGProps {
  icon: AvalIcon
  className?: any
  props?: any
}

type AvalIcon = keyof typeof iconPath

const iconPath = {
  album: "M12 15.2Q13.35 15.2 14.275 14.275Q15.2 13.35 15.2 12Q15.2 10.65 14.275 9.725Q13.35 8.8 12 8.8Q10.65 8.8 9.725 9.725Q8.8 10.65 8.8 12Q8.8 13.35 9.725 14.275Q10.65 15.2 12 15.2ZM12 13Q11.575 13 11.288 12.712Q11 12.425 11 12Q11 11.575 11.288 11.287Q11.575 11 12 11Q12.425 11 12.713 11.287Q13 11.575 13 12Q13 12.425 12.713 12.712Q12.425 13 12 13ZM12 20.7Q10.2 20.7 8.613 20.012Q7.025 19.325 5.85 18.15Q4.675 16.975 3.987 15.387Q3.3 13.8 3.3 12Q3.3 10.2 3.987 8.612Q4.675 7.025 5.85 5.85Q7.025 4.675 8.613 3.987Q10.2 3.3 12 3.3Q13.8 3.3 15.388 3.987Q16.975 4.675 18.15 5.85Q19.325 7.025 20.013 8.612Q20.7 10.2 20.7 12Q20.7 13.8 20.013 15.387Q19.325 16.975 18.15 18.15Q16.975 19.325 15.388 20.012Q13.8 20.7 12 20.7ZM12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12ZM12 20Q15.325 20 17.663 17.663Q20 15.325 20 12Q20 8.675 17.663 6.337Q15.325 4 12 4Q8.675 4 6.338 6.337Q4 8.675 4 12Q4 15.325 6.338 17.663Q8.675 20 12 20Z",
  music_note: "M10.075 19.45Q8.95 19.45 8.163 18.663Q7.375 17.875 7.375 16.75Q7.375 15.625 8.163 14.837Q8.95 14.05 10.075 14.05Q10.65 14.05 11.175 14.275Q11.7 14.5 12.075 14.95V4.55H16.625V6.65H12.775V16.75Q12.775 17.875 11.988 18.663Q11.2 19.45 10.075 19.45Z",
  play: "M9.3 16.65V7.35L16.6 12Z",
  pause: "M14.65 17.7V6.3H17.45V17.7ZM6.55 17.7V6.3H9.35V17.7Z",
  broken: "M8.8 19.7 4.3 15.2V8.8L8.8 4.3H15.2L19.7 8.8V15.2L15.2 19.7ZM9.15 15.35 12 12.5 14.85 15.35 15.35 14.85 12.5 12 15.35 9.15 14.85 8.65 12 11.5 9.15 8.65 8.65 9.15 11.5 12 8.65 14.85ZM9.1 19H14.9L19 14.9V9.1L14.9 5H9.1L5 9.1V14.9ZM12 12Z",
  menu: "M3.65 17.05V16.35H20.35V17.05ZM3.65 12.35V11.65H20.35V12.35ZM3.65 7.65V6.95H20.35V7.65Z",
  search: "M19.45 19.9 13.2 13.65Q12.45 14.3 11.475 14.65Q10.5 15 9.55 15Q7.25 15 5.65 13.4Q4.05 11.8 4.05 9.5Q4.05 7.2 5.65 5.6Q7.25 4 9.55 4Q11.85 4 13.45 5.6Q15.05 7.2 15.05 9.5Q15.05 10.525 14.675 11.5Q14.3 12.475 13.7 13.15L19.95 19.4ZM9.55 14.3Q11.575 14.3 12.963 12.912Q14.35 11.525 14.35 9.5Q14.35 7.475 12.963 6.087Q11.575 4.7 9.55 4.7Q7.525 4.7 6.138 6.087Q4.75 7.475 4.75 9.5Q4.75 11.525 6.138 12.912Q7.525 14.3 9.55 14.3Z",
  empty: "",
  close: "M6.4 18.1 5.9 17.6 11.5 12 5.9 6.4 6.4 5.9 12 11.5 17.6 5.9 18.1 6.4 12.5 12 18.1 17.6 17.6 18.1 12 12.5Z"
}

export const Icon = ({icon, className, ...props} : IconProps) : JSX.Element => {
  return (
    <svg 
      viewBox="0 0 24 24" 
      className={clsx(styles.root, className && className)} 
      {...props}
    >
      <path d={iconPath[icon]}/>
    </svg>
  )
}