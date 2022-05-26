import { useEffect, useState } from 'react';
import { PageContainer } from '@keystone-6/core/admin-ui/components';

import axios from 'axios';

import create from 'zustand';
import { Box, ButtonBase, Grid, IconButton, Paper, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import Image from '../../components/Image';

type NavState = {
    waiting: boolean
    data: any[]
    toggleWaiting: () => void
    setData: (imgData: any[]) => void
} 
export default function Media () {  
// Create store with Zustand
const [useStore] = useState(() =>
    create<NavState>(set => ({
        waiting: true,
        data: [],
        toggleWaiting: () => set((state) => { 
            return { waiting: !state.waiting }; 
        }),
        setData: (imgData: any[]) => set((state) => {
            return {
                ...state,
                data: imgData,
            }
        })
    })
));

    const toggleWaiting = useStore(state => state.toggleWaiting);
    const setData = useStore(state => state.setData);
    const data = useStore(state => state.data);
    const waiting = useStore(state => state.waiting);

    const localData = [
        {
            "asset_id": "c09912d5f6b655077155a083381dcf28",
            "public_id": "tngvi/about/cl1ux26vz00000wbghb699uwc",
            "format": "png",
            "version": 1649693743,
            "resource_type": "image",
            "type": "upload",
            "created_at": "2022-04-11T16:15:43Z",
            "bytes": 1400,
            "width": 500,
            "height": 300,
            "folder": "tngvi/about",
            "url": "http://res.cloudinary.com/engagement-lab-home/image/upload/v1649693743/tngvi/about/cl1ux26vz00000wbghb699uwc.png",
            "secure_url": "https://res.cloudinary.com/engagement-lab-home/image/upload/v1649693743/tngvi/about/cl1ux26vz00000wbghb699uwc.png"
        },
        {
            "asset_id": "9fe9048f5b6eec57da6a5ddf7de2244c",
            "public_id": "tngvi/about/cl23znomc0000jpps2v5g6bpe",
            "format": "png",
            "version": 1650242300,
            "resource_type": "image",
            "type": "upload",
            "created_at": "2022-04-18T00:38:20Z",
            "bytes": 460648,
            "width": 2732,
            "height": 2048,
            "folder": "tngvi/about",
            "url": "http://res.cloudinary.com/engagement-lab-home/image/upload/v1650242300/tngvi/about/cl23znomc0000jpps2v5g6bpe.png",
            "secure_url": "https://res.cloudinary.com/engagement-lab-home/image/upload/v1650242300/tngvi/about/cl23znomc0000jpps2v5g6bpe.png"
        },
        {
            "asset_id": "35e6f7248a23849d42a488813214a6ce",
            "public_id": "tngvi/about/cl23zv29s0001jppsebz13xcf",
            "format": "png",
            "version": 1650242645,
            "resource_type": "image",
            "type": "upload",
            "created_at": "2022-04-18T00:44:05Z",
            "bytes": 486552,
            "width": 2732,
            "height": 2048,
            "folder": "tngvi/about",
            "url": "http://res.cloudinary.com/engagement-lab-home/image/upload/v1650242645/tngvi/about/cl23zv29s0001jppsebz13xcf.png",
            "secure_url": "https://res.cloudinary.com/engagement-lab-home/image/upload/v1650242645/tngvi/about/cl23zv29s0001jppsebz13xcf.png"
        },
        {
            "asset_id": "dd93b322deab5980ffa3ebe1539afbc1",
            "public_id": "tngvi/about/cl23zyqwu0002jpps35bzf0lp",
            "format": "png",
            "version": 1650242817,
            "resource_type": "image",
            "type": "upload",
            "created_at": "2022-04-18T00:46:57Z",
            "bytes": 883937,
            "width": 2732,
            "height": 2048,
            "folder": "tngvi/about",
            "url": "http://res.cloudinary.com/engagement-lab-home/image/upload/v1650242817/tngvi/about/cl23zyqwu0002jpps35bzf0lp.png",
            "secure_url": "https://res.cloudinary.com/engagement-lab-home/image/upload/v1650242817/tngvi/about/cl23zyqwu0002jpps35bzf0lp.png"
        },
        {
            "asset_id": "63096cdba1c334ec1203c81c193f43a4",
            "public_id": "tngvi/about/cl252mzn30002utxlduy07i7k",
            "format": "png",
            "version": 1650307773,
            "resource_type": "image",
            "type": "upload",
            "created_at": "2022-04-18T18:49:33Z",
            "bytes": 460648,
            "width": 2732,
            "height": 2048,
            "folder": "tngvi/about",
            "url": "http://res.cloudinary.com/engagement-lab-home/image/upload/v1650307773/tngvi/about/cl252mzn30002utxlduy07i7k.png",
            "secure_url": "https://res.cloudinary.com/engagement-lab-home/image/upload/v1650307773/tngvi/about/cl252mzn30002utxlduy07i7k.png"
        },
        {
            "asset_id": "8c6b82943021d17481986d743ca1d537",
            "public_id": "tngvi/about/cl252nhog0003utxl5zrc1d6d",
            "format": "png",
            "version": 1650307797,
            "resource_type": "image",
            "type": "upload",
            "created_at": "2022-04-18T18:49:57Z",
            "bytes": 883937,
            "width": 2732,
            "height": 2048,
            "folder": "tngvi/about",
            "url": "http://res.cloudinary.com/engagement-lab-home/image/upload/v1650307797/tngvi/about/cl252nhog0003utxl5zrc1d6d.png",
            "secure_url": "https://res.cloudinary.com/engagement-lab-home/image/upload/v1650307797/tngvi/about/cl252nhog0003utxl5zrc1d6d.png"
        },
        {
            "asset_id": "7f4cde7ab2ae25327650332cd383d405",
            "public_id": "tngvi/about/cl252nwd80004utxl1jxxbhfa",
            "format": "png",
            "version": 1650307817,
            "resource_type": "image",
            "type": "upload",
            "created_at": "2022-04-18T18:50:17Z",
            "bytes": 486552,
            "width": 2732,
            "height": 2048,
            "folder": "tngvi/about",
            "url": "http://res.cloudinary.com/engagement-lab-home/image/upload/v1650307817/tngvi/about/cl252nwd80004utxl1jxxbhfa.png",
            "secure_url": "https://res.cloudinary.com/engagement-lab-home/image/upload/v1650307817/tngvi/about/cl252nwd80004utxl1jxxbhfa.png"
        },
        {
            "asset_id": "5ff220011b63d3c6a9db90619e4b2b7a",
            "public_id": "tngvi/about/cl252x7r80005utxlhhlb8aml",
            "format": "png",
            "version": 1650308251,
            "resource_type": "image",
            "type": "upload",
            "created_at": "2022-04-18T18:57:31Z",
            "bytes": 349027,
            "width": 1344,
            "height": 1268,
            "folder": "tngvi/about",
            "url": "http://res.cloudinary.com/engagement-lab-home/image/upload/v1650308251/tngvi/about/cl252x7r80005utxlhhlb8aml.png",
            "secure_url": "https://res.cloudinary.com/engagement-lab-home/image/upload/v1650308251/tngvi/about/cl252x7r80005utxlhhlb8aml.png"
        },
        {
            "asset_id": "a78d2fdc43e942ffb3bbd990f9023e7a",
            "public_id": "tngvi/about/cl252x9us0006utxl9x21ag6e",
            "format": "png",
            "version": 1650308253,
            "resource_type": "image",
            "type": "upload",
            "created_at": "2022-04-18T18:57:33Z",
            "bytes": 285330,
            "width": 812,
            "height": 877,
            "folder": "tngvi/about",
            "url": "http://res.cloudinary.com/engagement-lab-home/image/upload/v1650308253/tngvi/about/cl252x9us0006utxl9x21ag6e.png",
            "secure_url": "https://res.cloudinary.com/engagement-lab-home/image/upload/v1650308253/tngvi/about/cl252x9us0006utxl9x21ag6e.png"
        },
        {
            "asset_id": "1e2b7aa682963ea3816cb0c386ee8a9a",
            "public_id": "tngvi/about/cl252xltr0007utxlg25tc0nh",
            "format": "png",
            "version": 1650308269,
            "resource_type": "image",
            "type": "upload",
            "created_at": "2022-04-18T18:57:49Z",
            "bytes": 353010,
            "width": 1105,
            "height": 997,
            "folder": "tngvi/about",
            "url": "http://res.cloudinary.com/engagement-lab-home/image/upload/v1650308269/tngvi/about/cl252xltr0007utxlg25tc0nh.png",
            "secure_url": "https://res.cloudinary.com/engagement-lab-home/image/upload/v1650308269/tngvi/about/cl252xltr0007utxlg25tc0nh.png"
        }
    ];

    useEffect(() => {
        if(data && data.length > 1) return;
        //   axios.get('/media/get/upload').then((response) =>{
              setData(localData);
            //   setData(response.data.resources);
              toggleWaiting();
        // }); 
    })
   
    return (
        <PageContainer header="Media Library">
                           
            {
            !waiting ?

            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                {data.map(d => {
                    return (
                        <Grid item xs={4}>
                            <Image id='x' alt='hi' imgId={d.public_id} width={350} />
                            <IconButton aria-label="delete">
                                <DeleteIcon />
                            </IconButton>
                        </Grid>
                        )
                })}
            </Grid>

          </Box>
            :
            <></>
            }
        </PageContainer>
    )

}