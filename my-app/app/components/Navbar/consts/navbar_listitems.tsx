import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DirectionsIcon from '@mui/icons-material/Directions';
import LayersIcon from '@mui/icons-material/Layers';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import MapIcon from '@mui/icons-material/Map';
import StraightenIcon from '@mui/icons-material/Straighten';
import PinDropIcon from '@mui/icons-material/PinDrop';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import InfoIcon from '@mui/icons-material/Info';

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
        icon: <PinDropIcon/>,
        label: 'Add Markers',
        route: '/markers',
        hasNavigation: false,
    },
    {
        id: 5,
        icon: <StraightenIcon/>,
        label: 'Measure Distance',
        route: '/measure',
        hasNavigation: false,
    },
    {
        id: 6,
        icon: <InfoIcon/>,
        label: 'Property Info',
        route: '/property',
        hasNavigation: false,
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
        icon: <MapIcon/>,
        label: 'Map Styles',
        route: '/styles',
        hasNavigation: false,
    },
    {
        id: 9,
        icon: <DirectionsIcon/>,
        label: 'Directions',
        route: '/directions',
        hasNavigation: false,
    },
    {
        id: 10,
        icon: <BookmarkBorderIcon/>,
        label: 'Saved Places',
        route: '/saved',
        hasNavigation: false,
    },
    {
        id: 11,
        icon: <SaveAltIcon/>,
        label: 'Export Map',
        route: '/export',
        hasNavigation: false,
    },
    {
        id: 12,
        icon: <SettingsIcon/>,
        label: 'Settings',
        route: '/pages/Setting',
        hasNavigation: true,
    },
];