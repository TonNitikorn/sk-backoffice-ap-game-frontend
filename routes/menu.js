import GroupsIcon from '@mui/icons-material/Groups';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';

export const menuSuperAdmin = [
  {
    name: "Dashboard",
    link: "/dashboard",
    icon: <GroupsIcon />,
  },
  {
    name: "ประวัติการเล่นเกม",
    link: "/list",
    icon: <GroupsIcon />,
  },
  {
    name: "รายละเอียดการเล่นเกม",
    link: "/listTransactionByUsername",
    icon: <GroupsIcon />,
  },
  {
    name: "จัดการเกม ",
    link: "/customGame",
    icon: <SportsEsportsIcon />,
  },
  {
    name: "รายละเอียดเกม ",
    link: "/listDetail",
    icon: <StickyNote2Icon />,
  },



];

