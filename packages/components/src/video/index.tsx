// import '../styles.css';

import Image, { ImageLoaderProps } from 'next/image'
import React from 'react';
import { useState } from 'react';
// import Script from 'next/script'
import create from 'zustand';

type VideoProps = {
  thumbUrl: string,
  videoUrl: string,
  videoLabel: string,
};
type VideoState = {
    videoOpen: boolean;
    toggleOpen: (open: boolean) => void
}

const thumbLoader = ({ src, width, quality }: ImageLoaderProps) => {
  return src.replace
  ('_1920x1080?r=pad', `_${width}x1080?r=pad`);
}
export const Video = ({
    thumbUrl,
    videoUrl,
    videoLabel,
}: VideoProps) => {
    // Create store with Zustand
    const [useStore] = useState(() =>
      create<VideoState>(set => ({
          videoOpen: false,
          toggleOpen: (open: boolean) => set({ videoOpen:open }),
      })
    ));
    const toggleOpen = useStore(state => state.toggleOpen);
    const videoOpen = useStore(state => state.videoOpen);
    return (
      <div className='relative video w-full h-full lg:mb-8'>

        {videoOpen ? '' : (
          <a href='#' onClick={(e) =>{ toggleOpen(true); e.preventDefault() }}>
            <Image alt={`Thumbnail image for video with title "${videoLabel}"`} src={thumbUrl} width={1920} height={1080} layout='responsive' unoptimized={true}/>

            <span className='absolute' style={{top: 'calc(50% - 75px)', left: 'calc(50% - 75px)'}}>
                <svg viewBox="0 0 151 151" width="151" height="151">
                    <circle style={{strokeWidth: '0.8px', stroke: '#B571E9', fill: 'rgba(141, 51, 210, .6)'}} cx="49.467" cy="49.467" r="49.467" transform="matrix(1.521806, 0, 0, 1.510012, 0, 0)"></circle>
                    <path style={{strokeWidth: '0.8px', stroke: '#B571E9', fill: 'rgba(237, 234, 229, .8)'}} d="M 214.012 155.256 L 252.117 221.256 L 175.907 221.256 L 214.012 155.256 Z" data-bx-shape="triangle 175.907 155.256 76.21 66 0.5 0 1@b1f3cbc1" transform="matrix(-0.000024, 1, -1, -0.000024, 268.262054, -141.660278)" data-bx-origin="0.53481 0.565042"></path>
                </svg>
            </span>
          </a>
        )}

        {!videoOpen ? '' : (
          <div id="video-embed"> 
            <div className='relative' style={{padding:'49.27% 0 0 0'}}>
              <iframe src={`${videoUrl}?h=e72038724e&color=bf9eda&byline=0&portrait=0&autoplay=1`}
               style={{position:'absolute',top:0,left:0,width:'100%',height:'100%'}} frameBorder="0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen></iframe></div>
              {/* <Script src="https://player.vimeo.com/api/player.js"></Script>  */}
          </div>
        )}
      </div>
    );
  }