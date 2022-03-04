import React, { Component } from 'react';
import { useRouter } from 'next/router';
import Image from './Image';
import Link from 'next/link';

const links = [
  [`/report`, `Report`],
  [`/guide`, `Guide`],
  [`/about`, `About`],
  [`/team`, `Team`],
];

function ActiveLink(href: string) {
    const router = useRouter()
    const style = {
      marginRight: 10,
      color: router.asPath === href ? 'red' : 'black',
    }
  
    return style;
  }
  
class Header extends Component {
  // eslint-disable-next-line class-methods-use-this
  render() {
    return (
      <div className="flex justify-center">
        <nav className="w-full xl:mx-20 my-7 mb-24 flex flex-col md:flex-row">
          <div className="w-full flex justify-center md:justify-start">
            <Link href="/">
              <Image
                id="logo"
                imgId="logo.png"
                alt="Logo"
                width={305}
                lazy={false}
              />
            </Link>
          </div>
          <div className="px-4 mt-4 w-full flex items-center">
            <ul className="flex justify-between w-full list-none">
                {links.map((link) => {
                    return (
                        <li key={link[0]} className="uppercase">
                            <Link href={link[0]} passHref>
                                {link[1]}
                            </Link>
                        </li>
                    );
                })}
            </ul>
          </div>
        </nav>
      </div>
    );
  }
}

export default Header;
