import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DirectionsIcon from '@mui/icons-material/Directions';
import LayersIcon from '@mui/icons-material/Layers';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';

export const mainNavbarItems = [
    {
        id: 1,
        icon: <HomeIcon/>,
        label: 'Home',
        route: '/',
    },
    {
        id: 2,
        icon: <SearchIcon/>,
        label: 'Search Places',
        route: '/search',
    },
    {
        id: 3,
        icon: <LocationOnIcon/>,
        label: 'My Location',
        route: '/location',
    },
    {
        id: 4,
        icon: <DirectionsIcon/>,
        label: 'Directions',
        route: '/directions',
    },
    {
        id: 5,
        icon: <BookmarkBorderIcon/>,
        label: 'Saved Places',
        route: '/saved',
    },
    {
        id: 6,
        icon: <SettingsBackupRestoreIcon/>,
        label: 'History',
<<<<<<< Updated upstream:app/components/Navbar/consts/navbar_listitems.tsx
        route: '/history',
=======
        route: '/pages/history',
        hasNavigation: true,
>>>>>>> Stashed changes:my-app/app/components/Navbar/consts/navbar_listitems.tsx
    },
    {
        id: 7,
        icon: <LayersIcon/>,
        label: 'Map Layers',
        route: '/layers',
    },
    {
        id: 8,
        icon: <PersonIcon/>,
        label: 'Profile',
<<<<<<< Updated upstream:app/components/Navbar/consts/navbar_listitems.tsx
        route: '/profile',
=======
        route: '/pages/Profile',
        hasNavigation: true,
>>>>>>> Stashed changes:my-app/app/components/Navbar/consts/navbar_listitems.tsx
    },
    {
        id: 9,
        icon: <SettingsIcon/>,
        label: 'Settings',
<<<<<<< Updated upstream:app/components/Navbar/consts/navbar_listitems.tsx
        route: '/settings',
=======
        route: '/pages/Setting',
        hasNavigation: true,
>>>>>>> Stashed changes:my-app/app/components/Navbar/consts/navbar_listitems.tsx
    },
];