'use client'
import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import MenuIcon from '@mui/icons-material/Menu';
import { mainNavbarItems } from './consts/navbar_listitems';
import { useRouter } from 'next/navigation';
export default function Navbar(){
    const router = useRouter();
    const drawerWidth = 220;
    const collapseWidth = 60;
    const [IsOpen,SetIsOpen] = React.useState(false);
    const toggleDrawer = ()=>{
        SetIsOpen(!IsOpen);
    };
    return (
        
        <div className='navbar'>
        <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: IsOpen? drawerWidth:collapseWidth,
            boxSizing: 'border-box',
            backgroundColor: '	#F0F8FF'
          },
        }}
        variant="permanent"
        anchor="left"
        open= {IsOpen}
        onClose ={()=>SetIsOpen(false)}
      >
        {/* Menu Icon at the top */}
        <Box sx={{ display: 'flex', justifyContent: 'left', padding: '10px' }}>
          <IconButton onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
        </Box>
        <Divider />
        {!IsOpen && (
            <List>
                {mainNavbarItems.map((text, index) => (
                <ListItem 
                  key={text.id} 
                  onClick={() => {
                    console.log(`Clicked on: ${text.label}, hasNavigation: ${text.hasNavigation}, route: ${text.route}`);
                    if (text.hasNavigation){router.push(text.route)}
                  }} 
                  disablePadding>
                    <ListItemButton sx={{justifyContent: 'center', px: 2, mb:3,py:0.5,pt:2}}>
                    <ListItemIcon sx={{ minWidth: 'auto'}}>
                        {text.icon && React.cloneElement(text.icon, { 
                        sx: { fontSize: '24px', width: '24px', height: '24px' } 
                        })}
                    </ListItemIcon>
                    </ListItemButton>
                </ListItem>
                ))}
            </List>
        )}

        {IsOpen &&(
            <List>
                {mainNavbarItems.map((text, index) => (
                    <ListItem key={text.id} onClick={() => {
                    console.log(`Clicked on: ${text.label}, hasNavigation: ${text.hasNavigation}, route: ${text.route}`);
                    if (text.hasNavigation){router.push(text.route)}
                  }}  disablePadding>
                    <ListItemButton sx={{ justifyContent: 'center', px: 2, mb:3,py:0.5,pt:2}}>
                        <ListItemIcon>
                         {text.icon && React.cloneElement(text.icon, { 
                        sx: { fontSize: '24px', width: '24px', height: '24px' } 
                        })}
                        </ListItemIcon>
                        <ListItemText primary={text.label} />
                    </ListItemButton>
                    </ListItem>
                ))}
            </List>
        )
        }

      </Drawer>
        </div>
    )
}