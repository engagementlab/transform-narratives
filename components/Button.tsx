import Link from "next/link";

type ButtonProps = {
  className?: string,
  hoverColor?: string,
  link: string,
  label: string,
  margin?: string,
};
const Button = ({
    className,
    hoverColor,
    link,
    label,
    margin
}: ButtonProps) => {
    return (
      <Link href={link} passHref>
        <button 
        className={`${className} ${
            hoverColor ? hoverColor : `hover:bg-strawberry`
        } ${
            margin !== undefined ? margin : `my-10`
        } inline-block rounded-large px-10 py-7 uppercase bg-purple text-white transition-all`}
      >
        {label}</button>
        </Link>
    );
  }

export default Button;
