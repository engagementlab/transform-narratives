type Props = {
     href: string
     label: string
}

export default function ExternalLink({ href, label }: Props) {
    return <a href={href} className='text-bluegreen'>
      {label}
      <svg viewBox="4.222 4.222 15.556 15.556" width="15.556" height="15.556" className='inline'>
        <path d="M 13 7 L 18 12 M 18 12 L 13 17 M 18 12 L 6 12" transform="matrix(0.707107, -0.707107, 0.707107, 0.707107, -4.970563, 12)"
        style={{stroke: 'rgb(2, 102, 112)', strokeWidth: '1px'}}>
        </path>
      </svg>
    </a>
}