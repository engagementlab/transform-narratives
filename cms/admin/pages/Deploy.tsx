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
    done: boolean
    actionsLink: string
    toggleConfirm: () => void
    toggleWaiting: () => void
    toggleDone: () => void
    setActionsLink: (link: string) => void
}   
export default function Deploy () {
    // Create store with Zustand
    const [useStore] = useState(() =>
        create<NavState>(set => ({
            confirmed: false,
            waiting: false,
            done: false,
            actionsLink: '',
            toggleConfirm: () => set((state) => { 
                return { confirmed: !state.confirmed }; 
            }),
            toggleWaiting: () => set((state) => { 
                return { waiting: !state.waiting }; 
            }),
            toggleDone: () => set((state) => { 
                return { done: !state.done }; 
            }),
            setActionsLink: (link: string) => set((state) => {
                return {
                    ...state,
                    actionsLink: link,
                }
            })
        })
    ));

    const toggleConfirm = useStore(state => state.toggleConfirm);
    const toggleWaiting = useStore(state => state.toggleWaiting);
    const toggleDone = useStore(state => state.toggleDone);
    const setActionsLink = useStore(state => state.setActionsLink);
    const confirmed = useStore(state => state.confirmed);
    const waiting = useStore(state => state.waiting);
    const done = useStore(state => state.done);
    const actionsLink = useStore(state => state.actionsLink);

    const deployFetch = async () => {
            toggleWaiting();
            const response = await axios.get('/prod-deploy',
            );
            setActionsLink(`https://github.com/engagementlab/${response.data.repo}/actions/runs/${response.data.id}?check_suite_focus=true`);
            toggleDone();
    }
   
    return (
        <PageContainer header="Deploy to Production">
            <h1>Deployment Center</h1>
                           
            {
            done ?
            <p>The build to production is now being deployed via Github. This can take up to 10 minutes. We are not able
                to monitor the progress of this here but you can view the status <a href={actionsLink}>here</a>.
                    <p>If you see this icon when the build is finished, something is wrong.
                    <svg width="24" height="24" viewBox="0 0 24 24" version="1.1" aria-hidden="true" style={{fill: 'rgb(207, 34, 46)', display: 'block', margin: '1rem'}}>
                        <path fillRule="evenodd"
                            d="M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12zm8.036-4.024a.75.75 0 00-1.06 1.06L10.939 12l-2.963 2.963a.75.75 0 101.06 1.06L12 13.06l2.963 2.964a.75.75 0 001.061-1.06L13.061 12l2.963-2.964a.75.75 0 10-1.06-1.06L12 10.939 9.036 7.976z">
                        </path>
                    </svg>
                    Please find your friendly neighborhood developer. 
                </p>
            </p>
            :
            <>
                <p>This action will copy the content from the current QA build to production.
                </p>
                <p>
                    Before doing this, please ensure the QA build is free of all content issues and any bugs that may be
                    caused by missing or poor-quality content (e.g. images). This action is not easily reversible, and
                    all content from QA will generally be immediately viewable by all users.</p>
                <Switch defaultChecked={false} onClick={()=> { toggleConfirm(); } } /> I Understand
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
                    </LoadingButton>}</>
            }
        </PageContainer>
    )

}