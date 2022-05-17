import { useState } from "react";
import { getProvider, getSigner, initializeContract } from "../helpers";
import { create } from "ipfs-http-client"
import { ipfsBaseUrl, ipfsGatewayUrl } from "../constants";
import { Alert, Button, Input, Snackbar, TextField, Typography } from "@mui/material";

function Form({web3ModalRef, walletAddress}) {
    const [metadata, setMetadata] = useState({name: '', description: '', image:''});
    const [alertType, setAlertType] = useState('');
    const [alertContent, setAlertContent] = useState('');
    const [isSnackBarOpen, setSnackBarOpen] = useState(false);
    
    const mint = async(event) => {
        event.preventDefault()

        try {
            const metadataUri = await uploadMetadata()
    
            const web3ModalInstance = await web3ModalRef.current.connect()
        
            const provider = getProvider(web3ModalInstance)
        
            const signer = getSigner(provider)
        
            const contract = initializeContract(signer);
        
            const tx = await contract.safeMint(walletAddress, metadataUri);
        
            await tx.wait()

            showNotification('success', 'NFT minted successfully. Refresh to view minted nfts.');
        } catch (error) {
            showNotification('error', 'Error encountered');
        }
    }

    const showNotification = (alertType, alertMessage) => {
        setAlertType(alertType)
        setAlertContent(alertMessage)
        setSnackBarOpen(true)
    }

    const uploadImage = async(event) => {
        if(metadata.image !== '') {
            setMetadata(metadata => ({
                ...metadata,
                image: ``
            }))
        }

        const file = event.target.files[0]

        const hash = await storeInIpfs(file)

        setMetadata(metadata => ({
            ...metadata,
            image: `${ipfsBaseUrl}${hash}`
        }))
    }

    const uploadMetadata = async() => {
        const blob = new Blob([JSON.stringify(metadata)], {type: 'application/json'})
        
        const hash = await storeInIpfs(blob)

        return `${ipfsBaseUrl}${hash}`;
    }

    const storeInIpfs = async (data) => {
        const ipfsClient = create(ipfsGatewayUrl)

        const response = await ipfsClient.add(data)
        
        return response.path
    }

    return (
        <>
            { isSnackBarOpen && 
                <Snackbar 
                    open={isSnackBarOpen} 
                    autoHideDuration={10000} 
                    onClose={() => {setSnackBarOpen(false); setMetadata({name: '', description: '', image:''}) }} 
                    anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                    key={'top' + 'right'}
                > 
                    <Alert 
                        onClose={() => { setAlertType(''); setAlertContent('') }} 
                        severity={alertType}
                    > 
                        {alertContent} 
                    </Alert> 
                </Snackbar>
            }

            <form style={{display:'flex', flexDirection:'column', width:'100%'}}>
                <Typography variant='h6' component="div" style={{ margin: '1rem auto' }}>
                    Mint NFT   
                </Typography>
                <div style={{
                    width:"10rem", 
                    height:"10rem", 
                    borderWidth:"0.1rem", 
                    borderStyle:"solid", 
                    borderColor:"secondary",
                    borderRadius:'20%',
                    margin: '1rem auto'
                    }}>
                     {metadata.image !== '' &&    
                        <img src={metadata.image} style={{borderRadius:'20%', margin:0, width:"100%", height:"100%", objectFit: "contain"}}></img>
                    }
                </div>
                <div style={{ margin: '1rem auto' }}>
                    <Input
                        type="file" 
                        name="nftImage" 
                        accept="image/*"
                        onChange={uploadImage}
                        required
                        sx={{ display: 'none' }}
                        id="raised-button-file"
                    ></Input>

                    <label htmlFor="raised-button-file">
                    <Button variant="outlined" component="span" color="secondary">
                        Click to select file
                    </Button>
                    </label> 
                </div> 

                <TextField 
                    label="Name" 
                    variant="filled" 
                    value={metadata.name}
                    required
                    onChange={(e) => setMetadata(metadata => ({
                            ...metadata,
                            name: e.target.value
                        }))
                    }
                    style={{ width:'90%', margin: '1rem auto'}}
                />

                <TextField
                    label="Description" 
                    name="description" 
                    variant="filled"
                    rows={5}
                    cols={60} 
                    value={metadata.description}
                    onChange={(e) => setMetadata(metadata => ({
                            ...metadata,
                            description: e.target.value
                        }))
                    }
                    multiline
                    required
                    style={{ width:'90%', margin: '1rem auto'}}
                />

                <Button style={{ width:'90%', margin: '1rem auto'}} 
                    color='primary' 
                    variant="contained" 
                    type="submit" 
                    onClick={mint} 
                    disabled={metadata.name === '' || metadata.description === '' || metadata.image === '' ? true : false}
                >
                    Mint NFT
                </Button>
            </form>
        </>
    );
}

export default Form;