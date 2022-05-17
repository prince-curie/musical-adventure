import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';

function ActionAreaCard({name, image, description}) {
  return (
    <Card color='primary' sx={{ maxWidth: 345, margin: '1rem' }}>
        <CardActionArea>
            <CardMedia
                component="img"
                height="140"
                image={image}
                alt={name}
                style={{objectFit: 'contain'}}
            />
            <CardContent color='primary'>
                <Typography gutterBottom variant="h5" component="div">
                    {name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {description}  
                </Typography>
            </CardContent>
        </CardActionArea>
    </Card>
  );
}

export default function ViewNfts({ nfts }) {
    return (
        <>
            <Typography variant='h6' component="div" style={{ 
                margin: '1rem 0', 
                padding: 0, 
                display: 'flex', 
                flexDirection: 'row', 
                flexWrap: 'wrap', 
                justifyContent: 'center' }}
            >
                Your Initially Minted NFTs   
            </Typography>
            {nfts.length > 0 &&
                <ul style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly', padding:0 }}>
                    { nfts.map(( {name, image, description}, index ) => <ActionAreaCard 
                        key={index}
                        name={name} 
                        image={image} 
                        description={description} 
                    /> )}
                </ul>
            }
        </>
    )
}
