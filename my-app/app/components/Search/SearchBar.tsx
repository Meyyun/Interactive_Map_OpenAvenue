'use client'
import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '18px',
  backgroundColor: '#e3f2fd', // Light blue background
  '&:hover': {
    backgroundColor: '#bbdefb', // Darker blue on hover
  },
  marginLeft: 0,
  width: '400px', 
  [theme.breakpoints.up('sm')]: {
    marginLeft: 0,
    width: '350px', 
  },
}));
const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.5, 2, 1.5, 0), // Increased padding for more space
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '20ch', 
      '&:focus': {
        width: '25ch',
      },
    },
  },
}));
export default function SearchBar() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'left',
      padding: '10px 0',
    }}>
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Search for your location"
          inputProps={{ 'aria-label': 'search' }}
        />
      </Search>
    </div>
  );
}
