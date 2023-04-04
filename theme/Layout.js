import React, { useEffect, useState } from "react";
import {
  Box,
  Divider,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Grid,
  Button, AppBar, Drawer, Toolbar, Collapse
} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { menuSuperAdmin } from "../routes/menu";
import { useAppDispatch } from "../store/store";
import Router, { useRouter } from "next/router";
import { signOut } from "../store/slices/userSlice";
import Image from "next/image";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Logout from "@mui/icons-material/Logout";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import axios from "axios";
import hostname from "../utils/hostname";
import logo_angpao from "../assets/logo_ap.png"
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from '@mui/icons-material/Logout';

const drawerWidth = 260;

function Layout({ children, page }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const openAcc = Boolean(anchorEl);
  const [dataProfile, setDataProfile] = useState([]);
  const [open, setOpen] = useState(false);


  const handleClickAcc = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseAcc = () => {
    setAnchorEl(null);
  };

  const handleClick = (id) => {
    if (id === "member") {
      setOpen({
        member: !open.member,
      });
    }
    if (id === "point") {
      setOpen({
        point: !open.point,
      });
    }
    if (id === "report") {
      setOpen({
        report: !open.report,
      });
    }
    if (id === "rank") {
      setOpen({
        rank: !open.rank,
      });
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`, height: 80 }}
      >
        <Toolbar>
          <Grid container justifyContent="space-between">
            <Typography variant="h6" component="div">

            </Typography>
          </Grid>

        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: "#eee",
          },
          "& .MuiListItemButton-root": {
            "&:hover": {
              backgroundColor: "#41A3E3",
              borderRadius: "6px",
            },
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Grid justifyContent="center" alignItems="center" sx={{ pl: 9, pt: 1 }}>
          <Image
            src={logo_angpao}
            alt="scb"
            width={120}
            height={65}
          />
        </Grid>
        <Divider />

        <List>
          {menuSuperAdmin.map((item) => (
            <>
              {item.type === "collapse" ? (
                <>
                  <ListItemButton onClick={() => handleClick(item.id)}>
                    <ListItemIcon>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.name} />

                    {item.id === "member" ? open.member ? <ExpandLess /> : <ExpandMore /> :
                      item.id === "point" ? open.point ? <ExpandLess /> : <ExpandMore /> :
                        item.id === "report" ? open.report ? <ExpandLess /> : <ExpandMore /> :
                          item.id === "rank" ? open.rank ? <ExpandLess /> : <ExpandMore /> : ''}
                  </ListItemButton>

                  <Collapse in={open.member} timeout="auto" unmountOnExit>
                    {item.member?.map((e) => (
                      <List component="div" disablePadding>
                        <ListItemButton
                          sx={{
                            pl: 4,
                            borderRadius: "6px",
                            backgroundColor: typeof window !== "undefined" ? window.location.pathname === `${e.link}` ? "#41A3E3" : '#eee' : ''
                          }} onClick={() => router.push(e.link)}>
                          <ListItemIcon>
                            {e.icon}
                          </ListItemIcon>
                          <ListItemText primary={e.name} />
                        </ListItemButton>
                      </List>
                    ))}
                  </Collapse>
                  <Collapse in={open.point} timeout="auto" unmountOnExit>
                    {item.point?.map((e) => (
                      <List component="div" disablePadding>
                        <ListItemButton sx={{ pl: 4 }} onClick={() => router.push(e.link)}>
                          <ListItemIcon>
                            {e.icon}
                          </ListItemIcon>
                          <ListItemText primary={e.name} />
                        </ListItemButton>
                      </List>
                    ))}
                  </Collapse>
                  <Collapse in={open.report} timeout="auto" unmountOnExit>
                    {item.report?.map((e) => (
                      <List component="div" disablePadding>
                        <ListItemButton sx={{ pl: 4 }} onClick={() => router.push(e.link)}>
                          <ListItemIcon>
                            {e.icon}
                          </ListItemIcon>
                          <ListItemText primary={e.name} />
                        </ListItemButton>
                      </List>
                    ))}
                  </Collapse>
                </>
              ) : (
                <ListItem key={item} disablePadding>
                  <ListItemButton onClick={() => router.push(item.link)}
                    sx={{
                      borderRadius: "6px",
                      backgroundColor: typeof window !== "undefined" ? window.location.pathname === `${item.link}` ? "#41A3E3" : '#eee' : ''
                    }}
                  >
                    <ListItemIcon >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.name} />
                  </ListItemButton>
                </ListItem>
              )}
            </>


          ))}
        </List>

        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => router.push('/profile')}
              sx={{
                borderRadius: "6px",
                backgroundColor: typeof window !== "undefined" ? window.location.pathname === '/profile' ? "#41A3E3" : '#eee' : ''
              }}>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="โปรไฟล์" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={async () => {
                await dispatch(signOut());
                localStorage.clear();
                router.push("/auth/login");
              }}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="ออกจากระบบ" />
            </ListItemButton>
          </ListItem>
        </List>


      </Drawer>

      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, mt: 2 }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}

export default Layout