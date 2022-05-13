import { useState } from 'react';
import { PageContainer } from '@keystone-6/core/admin-ui/components';

import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';


import axios from 'axios';

import create, {
    Mutate,
    GetState,
    SetState,
    StoreApi,
    UseBoundStore,
    State
} from 'zustand';

type NavState = {
    confirmed: boolean
    waiting: boolean
    toggleConfirm: () => void
    toggleWaiting: () => void
}   
export default function Deploy () {
    // Create store with Zustand
    const [useStore] = useState(() =>
        create<NavState>(set => ({
            confirmed: false,
            waiting: false,
            toggleConfirm: () => set((state) => { 
                return { confirmed: !state.confirmed }; 
            }),
            toggleWaiting: () => set((state) => { 
                return { waiting: !state.waiting }; 
            }),
        })
    ));

    const toggleConfirm = useStore(state => state.toggleConfirm);
    const toggleWaiting = useStore(state => state.toggleWaiting);
    const confirmed = useStore(state => state.confirmed);
    const waiting = useStore(state => state.waiting);

    const deployFetch = async () => {
            const response = await axios.get(
            `${process.env.DEPLOY_API_PATH}?name=transform-narratives`,
            );
            toggleWaiting();
            const resData = response.data;
    }
   
    return (
        <PageContainer header="Deploy to Production">
            <h1>Deployment Center</h1>
            <p>This action will copy the content from the current QA build to production.
            </p>
            <p>
                Before doing this, please ensure the QA build is free of all content issues and any bugs that may be
                caused by missing or poor-quality content (e.g. images). This action is not easily reversible, and
                all content from QA will generally be immediately viewable by all users.</p>

            <Switch defaultChecked={false} onClick={()=>{toggleConfirm()}} /> I Understand

            <br />

            {(confirmed && !waiting) &&
                <Button variant="outlined" onClick={()=>{deployFetch()}}>Deploy</Button>
            }
            {waiting &&
                <LoadingButton
                loading
                loadingPosition="start"
                startIcon={<SaveIcon />}
                variant="outlined"
            >
                Deploy
            </LoadingButton>}
        </PageContainer>
    )

}