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
        hasNavigation: true,
    },
    {
        id: 2,
        icon: <SearchIcon/>,
        label: 'Search Places',
        route: '/search',
        hasNavigation: false,
    },
    {
        id: 3,
        icon: <LocationOnIcon/>,
        label: 'My Location',
        route: '/location',
        hasNavigation: false,
    },
    {
        id: 4,
        icon: <DirectionsIcon/>,
        label: 'Directions',
        route: '/directions',
        hasNavigation: false,
    },
    {
        id: 5,
        icon: <BookmarkBorderIcon/>,
        label: 'Saved Places',
        route: '/saved',
        hasNavigation: false,
    },
    {
        id: 6,
        icon: <SettingsBackupRestoreIcon/>,
        label: 'History',
        route: '/history',
        hasNavigation: true,
    },
    {
        id: 7,
        icon: <LayersIcon/>,
        label: 'Map Layers',
        route: '/layers',
        hasNavigation: false,
    },
    {
        id: 8,
        icon: <PersonIcon/>,
        label: 'Profile',
        route: '/profile',
        hasNavigation: true,
    },
    {
        id: 9,
        icon: <SettingsIcon/>,
        label: 'Settings',
        route: '/settings',
        hasNavigation: true,
    },
];