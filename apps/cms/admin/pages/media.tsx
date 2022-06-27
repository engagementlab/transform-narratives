import React, { useState, useEffect } from 'react';
import {
    PageContainer
} from '@keystone-6/core/admin-ui/components';
import create from 'zustand';
import {
    useDropzone
} from 'react-dropzone';
import { css as emCss } from '@emotion/css';
import axios from 'axios';

import {
    Alert,
    Box,
    Button,
    ButtonBase,
    Card,
    CardActions,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Fab,
    Grid,
    IconButton,
    ImageList,
    ImageListItem,
    Modal,
    Pagination,
    Paper,
    Snackbar,
    Typography
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import AddIcon from '@mui/icons-material/Add';
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
import FileUploadTwoToneIcon from '@mui/icons-material/FileUploadTwoTone';

import { Image } from '@el-next/components';

type NavState = {
    data: any[]
    deleteConfirmOpen: boolean
    errorOpen: boolean
    imgIdToDelete: string;
    pgIndex: number
    selectedImgId: string;
    waiting: boolean
    uploadOpen: boolean

    toggleWaiting: () => void
    setData: (imgData: any[]) => void
    setId: (id: string) => void
    setImageIdToDelete: (id: string) => void
    setIndex: (imgIndex: number) => void
    setErrorOpen: (open: boolean) => void
    setUploadOpen: (open: boolean) => void
    setConfirmOpen: (open: boolean) => void
}

const styles = {
    item: {
        position: 'relative',
        cursor: 'pointer'
    },
    modal: { 
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 650,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    },
    imgHover: emCss`opacity: .5`,
}
const actionsStyle = {position: 'absolute', bottom: 0, right: 0};

export default function Media() {
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
        maxFiles: 1,
    });
    const acceptedFileItems = acceptedFiles.map(file => (
        <li key={file.name}>
          {file.name}
        </li>
    ));
    // Create store with Zustand
    const [useStore] = useState(() =>
        create < NavState > (set => ({
            data: [],
            errorOpen: false,
            imgIdToDelete: '',
            selectedImgId: '',
            uploadOpen: false,
            deleteConfirmOpen: false,
            waiting: true,
            pgIndex: 0,
            toggleWaiting: () => set((state) => {
                return {
                    waiting: !state.waiting
                };
            }),
            setData: (imgData: any[]) => set((state) => {
                return {
                    ...state,
                    data: imgData,
                }
            }),
            setId: (id: string) => set((state) => {
                return {
                    ...state,
                    selectedImgId: id,
                }
            }),
            setImageIdToDelete: (id: string) => set((state) => {
                return {
                    ...state,
                    imgIdToDelete: id,
                }
            }),
            setIndex: (imgIndex: number) => set((state) => {
                return {
                    ...state,
                    pgIndex: imgIndex,
                }
            }),
            setConfirmOpen: (open: boolean) => set((state) => {
                return {
                    ...state,
                    deleteConfirmOpen: open
                }
            }),
            setErrorOpen: (open: boolean) => set((state) => {
                if(!open)
                    toggleWaiting();

                return {
                    ...state,
                    errorOpen: open
                }
            }),
            setUploadOpen: (open: boolean) => set((state) => {
                return {
                    ...state,
                    uploadOpen: open
                }
            }),
        })));

    const toggleWaiting = useStore(state => state.toggleWaiting);
    const setData = useStore(state => state.setData);
    const setDeleteConfirm = useStore(state => state.setConfirmOpen);
    const setErrorOpen = useStore(state => state.setErrorOpen);
    const setId = useStore(state => state.setId);
    const setImageIdToDelete = useStore(state => state.setImageIdToDelete);
    const setIndex = useStore(state => state.setIndex);
    const setUploadOpen = useStore(state => state.setUploadOpen);

    const confirmOpen = useStore(state => state.deleteConfirmOpen);
    const currentId = useStore(state => state.selectedImgId);
    const errorOpen = useStore(state => state.errorOpen);
    const imgIdToDelete = useStore(state => state.imgIdToDelete);
    const data = useStore(state => state.data);
    const waiting = useStore(state => state.waiting);
    const pgIndex = useStore(state => state.pgIndex);
    const uploadOpen = useStore(state => state.uploadOpen);
    
    const beginIndex = pgIndex * 30;
    const endIndex = beginIndex + 30;
    
    const upload = () => {
        try {
            const reader = new FileReader()
            reader.onabort = () => {
                setErrorOpen(true);
            };
            reader.onerror = () => {
                setErrorOpen(true);
            };
            reader.onload = () => {
                toggleWaiting();
                try {
                    var formData = new FormData();
                    formData.append('img', reader.result as string);

                    var xhr = new XMLHttpRequest();
                    xhr.open('POST', '/media/upload', true);
                    xhr.onprogress = (e) => {
                        if(e.loaded !== e.total) return;
                        setUploadOpen(false);
                        axios.get('/media/get/upload').then((response) => {
                            setData(response.data);
                            toggleWaiting();
                        });
                    };
                    xhr.onabort = () => {
                        setErrorOpen(true);
                    };
                    xhr.onerror = () => {
                        setErrorOpen(true);
                    };
                    xhr.send(formData);
                }
                catch (err) {
                    setErrorOpen(true);
                }
            }
            reader.readAsDataURL(acceptedFiles[0])
        }
        catch (err) {
            setErrorOpen(true);
        }
    }
    const deleteImg = () => {
        try {
            axios.get(`/media/delete?id=${imgIdToDelete}`).then((response) => {
                if(response.data.result === 'ok') {
                    setDeleteConfirm(false);
                    
                    toggleWaiting();
                    axios.get('/media/get/upload').then((response) => {
                        setData(response.data);
                        toggleWaiting();
                    });
                    return;
                }
                setErrorOpen(true);
            }).catch((error) => {
                setErrorOpen(true);
            });
        } catch (err: any) {
            setErrorOpen(true);
        }
    }

    useEffect(() => {
        if (data && data.length > 1) return;
        axios.get('/media/get/upload').then((response) => {
            //   setData(localData);
            setData(response.data);
            toggleWaiting();
        });
    })
    return (
        <PageContainer header="Media Library">  
        
            <Snackbar open={errorOpen} autoHideDuration={6000} onClose={() => setErrorOpen(false)}>
                <Alert onClose={() => setErrorOpen(false)} severity='error' sx={{ width: '100%' }}>
                    Something went wrong.
                </Alert>
            </Snackbar>

            <Modal
            open={uploadOpen}
            onClose={() => {setUploadOpen(false); }}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >  
            <Box sx={styles.modal}>
                <section className="container">
                    <div {...getRootProps({ className: 'dropzone' })}>
                        <input {...getInputProps()} />
                        <p>Drag and drop an image here, or click to select one.</p>
                        <em>(Only *.jpeg and *.png images will be accepted)</em>
                    </div>
                    {acceptedFileItems.length > 0 && (
                        <aside>
                            <h4>Accepted files</h4>
                            <ul>{acceptedFileItems}</ul>
                            <br />
                            
                            <LoadingButton
                                loading={waiting}
                                loadingPosition="start"
                                startIcon={<FileUploadTwoToneIcon />}
                                variant="outlined" color="success" onClick={() =>{ upload();} }>
                                    Done
                            </LoadingButton>
                        </aside>
                    )}
                </section>
            </Box>
            </Modal>
            {
            !waiting ?
            <div>
                <Dialog
                    open={confirmOpen}
                    onClose={() => { setDeleteConfirm(false) }}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {"Are you sure?"}
                    </DialogTitle>
                    <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        This image will be permanently deleted. If it's being used somewhere on this app, bugs/errors may occur.
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={() => { setDeleteConfirm(false) }} autoFocus>Cancel</Button>
                    <Button onClick={() => { deleteImg() }}>
                        Delete
                    </Button>
                    </DialogActions>
                </Dialog>

                <Fab color="secondary" aria-label="add" onClick={() => {setUploadOpen(true); }} style={{margin: '2rem'}}>
                    <AddIcon/>
                </Fab>

                <Pagination count={Math.floor(data.length / 30)+1} page={pgIndex+1} onChange={((e, pg) => { setIndex(pg-1) })} />
                <Box sx={{ flexGrow: 1 }}>
                    <ImageList variant="masonry" cols={4} gap={8}>
                        {data.slice(beginIndex, endIndex).map(d => {
                            return (
                                <ImageListItem key={d.public_id} sx={styles.item} onMouseEnter={()=> {setId(d.public_id)}}
                                    onMouseLeave={() => {setId('')}}>
                                    <Image id={d.public_id} alt={`Image with public ID ${d.public_id}`}
                                        imgId={d.public_id} width={300}
                                        transforms='f_auto,dpr_auto,c_crop,g_center,q_50' lazy={false}
                                        aspectDefault={true} className={d.public_id === currentId ? `${styles.imgHover}` : ''} />
                                  {d.public_id === currentId &&
                                    <IconButton color='warning' size='large' sx={actionsStyle} aria-label="delete image" onClick={() => { setDeleteConfirm(true); setImageIdToDelete(d.public_id); }}>
                                        <DeleteForeverTwoToneIcon fontSize='large' />
                                    </IconButton>}
                                </ImageListItem>
                                )
                        })}
                    </ImageList>
                </Box>
            </div>
            :
            <></>
            }
        </PageContainer>
    )

}