import { useEffect, useState } from 'react';
import { PageContainer } from '@keystone-6/core/admin-ui/components';

import create from 'zustand';
import {useDropzone} from 'react-dropzone';

import { Box, Button, ButtonBase, Card, CardActions, CardContent, Fab, Grid, IconButton, Pagination, Paper, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

import Image from '../../components/Image';

import * as localData from '../../imageData'
import axios from 'axios';

type NavState = {
    waiting: boolean
    data: any[]
    index: number
    toggleWaiting: () => void
    setData: (imgData: any[]) => void
    setIndex: (imgIndex: number) => void
} 
export default function Media () {  
    const {
        acceptedFiles,
        fileRejections,
        getRootProps,
        getInputProps
      } = useDropzone({
        accept: {
          'image/jpeg': [],
          'image/png': []
        },
      });
    
      const acceptedFileItems = acceptedFiles.map(file => (
        <li key={file.path}>
          {file.path} - {file.size} bytes
        </li>
      ));
    
      const fileRejectionItems = fileRejections.map(({ file, errors }) => (
        <li key={file.path}>
          {file.path} - {file.size} bytes
          <ul>
            {errors.map(e => (
              <li key={e.code}>{e.message}</li>
            ))}
          </ul>
        </li>
      ));
    
    const upload =  () => {
        const reader = new FileReader()
        reader.onabort = () => console.log('file reading was aborted')
        reader.onerror = () => console.log('file reading has failed')
        reader.onload = () => {
      
            var formData = new FormData();
            formData.appendIndex('img', reader.result as string);
            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/media/upload', true);
            xhr.onprogress = function(e) { console.log(e) };
        
            xhr.sendIndex(formData);
            
        }
        reader.readAsDataURL(acceptedFiles[0])
    }
    // Create store with Zustand
    const [useStore] = useState(() =>
        create<NavState>(set => ({
            waiting: true,
            data: [],
            index: 0,
            toggleWaiting: () => set((state) => { 
                return { waiting: !state.waiting }; 
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

    const data = useStore(state => state.data);
    const waiting = useStore(state => state.waiting);
    const index = useStore(state => state.index);
    const beginIndex = index * 30;
    const endIndex = beginIndex + 30;

    const toggleWaiting = useStore(state => state.toggleWaiting);
    const setData = useStore(state => state.setData);
    const setIndex = useStore(state => state.setIndex);

    useEffect(() => {
        if(data && data.length > 1) return;
          axios.get('/media/get/upload').then((response) =>{
            //   setData(localData);
              setData(response.data);
              toggleWaiting();
        }); 
    })

    return (
        <PageContainer header="Media Library">     
{/* 
            <section className="container">
                <div {...getRootProps({ className: 'dropzone' })}>
                    <input {...getInputProps()} />
                    <p>Drag and drop some images here, or click to select some.</p>
                    <em>(Only *.jpeg and *.png images will be accepted)</em>
                </div>
                <aside>
                    <h4>Accepted files</h4>
                    <ul>{acceptedFileItems}</ul>
                </aside>
                <Button variant="contained" color="success" onClick={() =>{ upload();} }>Done</Button>
            </section> */}

            {
            !waiting ?
            <div>
            <Fab color="primary" aria-label="add">
                <AddIcon />
            </Fab>

            <Pagination count={Math.floor(data.length / 30)} page={index} onChange={((e, pg) => { setIndex(pg) })} />
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    {data.slice(beginIndex, endIndex).map(d => {
                        return (
                            <Grid item xs={4}>
                                <Card sx={{ maxWidth: 345 }}>
                                    <CardContent>
                                        <Image id='x' alt='hi' imgId={d.public_id} width={300} transforms='f_auto,dpr_auto,c_crop,g_center,q_50' lazy={false} aspectDefault={true} />
                                    </CardContent>
                                    {/* <CardActions disableSpacing>
                                        <IconButton aria-label="add to favorites">
                                            <DeleteIcon />
                                        </IconButton>
                                    </CardActions> */}
                                </Card>
                            </Grid>
                        )
                    })}
                </Grid>
            </Box>
            </div>
            :
            <></>
            }
        </PageContainer>
    )

}