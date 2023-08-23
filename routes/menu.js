import GroupsIcon from '@mui/icons-material/Groups';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import PersonIcon from '@mui/icons-material/Person';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LinkIcon from '@mui/icons-material/Link';

export const menuSuperAdmin = [
  {
    name: "Dashboard",
    link: "/dashboard",
    icon: <DashboardIcon />,
  },
  {
    name: "ประวัติการเล่นเกม",
    link: "/list",
    icon: <GroupsIcon />,
  },
  {
    name: "ประวัติการเล่นเกม(รายคน)",
    link: "/listTransactionByUsername",
    icon: <PersonIcon />,
  },
  {
    name: "จัดการเกม ",
    link: "/customGame",
    icon: <SportsEsportsIcon />,
  },
  {
    name: "จัดการเอเยนต์",
    link: "/Agents/agent",
    icon: <LinkIcon />,
  },
  {
    name: "รายละเอียดเกม ",
    link: "/listDetail",
    icon: <StickyNote2Icon />,
  },

];

