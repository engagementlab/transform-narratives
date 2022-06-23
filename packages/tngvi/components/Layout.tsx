import React, { ReactNode } from 'react'
// import { NextSeo } from 'next-seo'
import { motion } from 'framer-motion'

type Props = {
    children: ReactNode
    // title: string
    // description: string
}

const variants = {
    hidden: { opacity: 0, },
    enter: { opacity: 1, },
    exit: { opacity: 0, },
}

const Layout = ({ children }: Props): JSX.Element => (
    <div>
        {/* <NextSeo title={title} description={description} openGraph={{ title, description }} /> */}
        <motion.main
            initial="hidden"
            animate="enter"
            exit="exit"
            variants={variants}
            transition={{ type: 'linear' }}
        >
            {children}
        </motion.main>
    </div>
)

export default Layout