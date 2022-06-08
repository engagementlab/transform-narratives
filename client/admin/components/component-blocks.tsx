/* eslint-disable @next/next/no-img-element */
import React, { ComponentType, Fragment, useEffect, useState } from 'react';
import { NotEditable, component, fields } from '@keystone-6/fields-document/component-blocks';
import { FormField, HydratedRelationshipData } from '@keystone-6/fields-document/dist/declarations/src/DocumentEditor/component-blocks/api';

import { FieldContainer, FieldLabel, TextArea } from '@keystone-ui/fields';
import { css as emCss } from '@emotion/css';
import Select, { GroupBase, OptionProps } from 'react-select'
// import { IconButton, ImageList, ImageListItem, ImageListItemBar, Modal, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Box, Grid, IconButton, InputLabel, MenuItem, Pagination, Select as MUISelect, TextField } from '@mui/material';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';

import create from 'zustand';
import axios from 'axios';

type ImageGridState = {
  id: string;
  alt: string;
  data: any[];
  index: number;
  waiting: boolean;

  toggleWaiting: () => void
  setId: (id: string) => void
  setAlt: (id: string) => void
  setData: (imgData: any[]) => void
  setIndex: (imgIndex: number) => void
}   

const videoData = require('../../videoData');
const imageData = require('../../imageData');

interface RelatedImage {
  publicId: null | string;
  alt?: null | string;
}

interface RelatedVideo {
  label: string;
  videoUrl: string;
  thumbSm: string;
  caption?: string;
}

const styles = {
  form: {
    field: emCss`
      align-items: center;
      width: 100%;
      margin: 1rem 0 0 0;
    `,
    label: emCss`
      width: 10%;
    `,
    input: emCss`
      width: 90%;
    `,
    button: emCss`
      margin: .4rem;
    `,
    select: emCss`
      position: relative;
      z-index: 100;
      min-width: 100%;
    `,
    option: emCss`
      display: flex!important;
      flex-direction: row;
      padding: 1rem;
      cursor: pointer;
      p {
        width: 50%;
      }
      img {
        border: 2px solid white;
      }
      &:hover {
        background: #2D3130;
        color: white;
      }
    `
  }
};
  
const VideoOptionComponent = (props: OptionProps) => {
  return (
    <div>        
          <div
            className={props.cx(
              {
                option: true,
              },
              props.className
            ) + ' ' + styles.form.option}
            ref={props.innerRef}
            aria-disabled={props.isDisabled}
            {...props.innerProps}
          >
            <p>
              {props.children}
            </p>
            <img alt={`Thumbnail image for video with title "${props.label}"`} src={(props.data as any).thumbSm} />
          </div>
    </div>
    
  )
}
function videoSelect({
  label,
  current,
  defaultValue = {
    label: 'PICK VIDEO',
    videoUrl: '',
    thumbSm: '',
  }
}: {
  label: string;
  current?: RelatedVideo;
  defaultValue: RelatedVideo;
}): FormField<RelatedVideo, undefined> {
  
  return {
    kind: 'form',

    Input({ value, onChange, autoFocus }) {
      return (
        <FieldContainer>
            <Select
            id='video'
            isClearable
            autoFocus={autoFocus}
            options={videoData}
            isDisabled={onChange === undefined}
            onChange={event => {
              onChange(event as RelatedVideo)
            }}
            value={value}
            className={styles.form.select}
            components={{Option: VideoOptionComponent as ComponentType<OptionProps<RelatedVideo, boolean, GroupBase<RelatedVideo>>>}}

          />        
      </FieldContainer>
      )
    },
    options: undefined,
    defaultValue,
    validate(value) {
      return typeof value === 'object';
    },
  };
}
function imageSelect({
  label,
  current,
  defaultValue = {
    publicId: '',
    alt: '',
  }
}: {
  label: string;
  current?: RelatedImage;
  defaultValue: RelatedImage;
}): FormField<RelatedImage, undefined> {
  
  return {
    kind: 'form',

    Input({ value, onChange, autoFocus }) {
    // Create store with Zustand
    const [useStore] = useState(() => 
        create<ImageGridState>(set => ({
          waiting: true,
          data: [],
          index: 0,
          id: value?.publicId || '',
          alt: value?.alt || '',
          toggleWaiting: () => set((state) => { 
              return { waiting: !state.waiting }; 
          }),
          setId: (id: string) => set((state) => {
              return {
                  ...state,
                  id,
              }
          }),
          setAlt: (alt: string) => set((state) => {
            return {
                ...state,
                alt,
            }
          }),
          setData: (imgData: any[]) => set((state) => {
              return {
                  ...state,
                  data: imgData,
              }
          }),
          setIndex: (imgIndex: number) => set((state) => {
              return {
                  ...state,
                  index: imgIndex,
              }
          })
        })
    ));

    const setId = useStore(state => state.setId);
    const setAlt = useStore(state => state.setAlt);
    const toggleWaiting = useStore(state => state.toggleWaiting);
    const setData = useStore(state => state.setData);
    const setIndex = useStore(state => state.setIndex);

    const currentId = useStore(state => state.id);
    const currentAlt = useStore(state => state.alt);
    const data = useStore(state => state.data);
    const waiting = useStore(state => state.waiting);
    const index = useStore(state => state.index);
    const beginIndex = index * 15;
    const endIndex = beginIndex + 15;
    const dataLength = Math.floor(data.length / 15)+1;

    useEffect(() => {
      if(data && data.length > 1) return;
        axios.get('/media/get/upload').then((response) =>{
          //   setData(localData);
            setData(response.data);
            toggleWaiting();
      }); 
    })

    return (
      <FieldContainer>
        <div style={{display: 'flex', flexDirection: 'row'}}>
          <IconButton aria-label="go to last page" disabled={index === 0} onClick={((val) => { setIndex(index-1) })}>
            <ArrowCircleLeftOutlinedIcon fontSize='large' />
          </IconButton>
            <MUISelect
              value={index}
              label="Page"
              onChange={((val) => { setIndex(!val ? 0 : val.target.value as number) })}
              >
              {[...new Array(dataLength)].map((v, i) => (
            <MenuItem value={i}>{i+1}</MenuItem>
            ))}
          </MUISelect>
          <IconButton aria-label="go to right page" disabled={index === dataLength-1} onClick={((val) => { setIndex(index+1) })}>
            <ArrowCircleRightOutlinedIcon fontSize='large' />
          </IconButton>
        </div>
        
        <hr style={{borderTopWidth: '2px', borderColor: '#f6a536'}} />

        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            {data.slice(beginIndex, endIndex).map((item) => (
              <Grid item xs={3}>
                <a style={{ position: 'relative'}}
                  onClick={(e) => {
                    setId(item.public_id); 
                    onChange({publicId: item.public_id});
                    // document.getElementById('alt-field').focus();
                  }}>
                  <div style={{position: 'absolute', top: 0, left: 0}}>
                    {item.public_id === currentId && <CheckCircleOutlineIcon fontSize='large' htmlColor='#f6a536' />}
                  </div>
                  <img
                    src={`https://res.cloudinary.com/engagement-lab-home/image/upload/f_auto,dpr_auto,w_100/v${item.version}/${item.public_id}`}
                    style={{opacity: item.public_id === currentId ? .5 : 1}}
                  />
                </a>
              </Grid>
            ))}
          </Grid>
        </Box>

        <TextField id="alt-field" label="Alt Text" variant="standard" value={currentAlt} onChange={(e) => {setAlt(e.target.value); onChange({publicId: currentId, alt: e.target.value})}}/>
      </FieldContainer>
    )
    },
    options: undefined,
    defaultValue,
    validate(value) {
      return typeof value === 'object';
    },
  };
}

export const componentBlocks = {
  image: component({
     component: (props) => {
      if(!props.image.value) return null;

      const data = (props.image.value as unknown as HydratedRelationshipData).data;
      return (
          <img
            style={{width:'100%'}}
            className="body-image"
            src={data.image?.publicUrlTransformed}
            alt="Document image"
          />
       );
     },
     label: 'Image',
     props: {
       image: fields.relationship<'many'>({
         label: 'Images',
         relationship: 'image',
       }),
     },
   }),
  video: component({
    component: ({video}) => {
      return (
          <div>
            {video.value.label}
            <br />
            <img
              style={{width:'150px'}}
              src={video.value.thumbSm}
              // alt="Document image"
            />
          </div>
       );
     },
     label: 'Video',
     props: {
       video: videoSelect({
        label: 'Video',
        defaultValue: {
          label: 'Click "Edit" and select.',
          videoUrl: '',
          thumbSm: '',
        },
       })
     },
     chromeless: false,
  }),
  cdnImage: component({
    component: ({image}) => {
      return (
          <div>
            {!image.value.publicId ? <span>Click <em>Edit</em></span> 
            :
            <div>
              <img
                  src={`https://res.cloudinary.com/engagement-lab-home/image/upload/f_auto,dpr_auto,w_250/${image.value.publicId}`}
                />
              {image.value.alt && <div><em>(Alt: {image.value.alt})</em></div>}
            </div>
            }
          </div>
       );
     },
     label: 'CDN Image',
     props: {
       image: imageSelect({
        label: 'Image',
        defaultValue: {
          publicId: null,
        }
       })
     },
    //  chromeless: false,
  }),
   button: component({
      component: ({label, link}) => {
        return (      
         <div
           style={{ backgroundColor: 'rgb(247 247 247)', display: 'inline-block', borderRadius: '38px', padding: '1rem'}}
           className='inline-block rounded-full px-8 py-5 uppercase bg-lynx text-bluegreen border-2 border-bluegreen'>
           <div style={{ fontWeight: 'bold', color: '#718096' }}>{label}</div>
           <div style={{ fontStyle: 'italic', color: '#4A5568' }}>
             <NotEditable><svg viewBox="70.001 0.006 10 10" width="10" height="10">
                 <g transform="matrix(0.017858, 0, 0, 0.017858, 68.750916, 0.006137)">
                   <path
                     d="m586.27 43.738c-58.324-58.309-152.88-58.309-211.19 0l-83.328 83.293c6.5977-0.71875 13.262-1.0273 19.961-1.0273 21.086 0 41.594 3.3516 61.008 9.8086l47.219-47.199c16.219-16.234 37.785-25.156 60.719-25.156 22.938 0 44.504 8.9219 60.719 25.156 16.219 16.199 25.137 37.734 25.137 60.699 0 22.934-8.918 44.5-25.137 60.699l-92.383 92.383c-16.219 16.242-37.785 25.16-60.719 25.16-22.969 0-44.5-8.918-60.734-25.152-7.8945-7.8633-14.047-17.023-18.285-27.004-10.527 0.58203-20.371 4.957-27.891 12.473l-24.609 24.641c6.7344 12.473 15.379 24.23 25.906 34.797 58.309 58.312 152.88 58.312 211.2 0l92.398-92.418c58.293-58.305 58.293-152.84 0.003907-211.15z">
                   </path>
                   <path
                     d="m389.27 433.96c-21.121 0-41.832-3.418-61.691-10.152l-47.543 47.543c-16.199 16.234-37.766 25.156-60.699 25.156-22.934 0-44.465-8.918-60.699-25.156-16.234-16.203-25.156-37.766-25.156-60.699 0-22.934 8.9219-44.504 25.156-60.734l92.383-92.383c16.234-16.199 37.766-25.121 60.699-25.121 22.969 0 44.5 8.9219 60.715 25.121 7.8984 7.8945 14.062 17.055 18.32 27.035 10.562-0.54688 20.422-4.957 27.941-12.473l24.574-24.609c-6.7344-12.512-15.398-24.266-25.941-34.828-58.309-58.309-152.88-58.309-211.19 0l-92.383 92.418c-58.34 58.312-58.34 152.84 0 211.19 58.309 58.312 152.84 58.312 211.15 0l83.188-83.191c-6.2031 0.57813-12.473 0.89063-18.797 0.89063z">
                   </path>
                 </g>
               </svg></NotEditable>{link}
           </div>
         </div>
        );
      },
      label: 'Button',
      props: {
        label: fields.child({
          kind: 'inline',
          placeholder: 'Label',
        }),
        link: fields.child({ kind: 'inline', placeholder: '/link/here' }),
      },
      chromeless: true
   }),
 }