'use client'

// 3rd-party
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import IconButton from "@mui/material/IconButton";
import Link from "next/link"
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React, { useRef, useState } from "react";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

const TopBar = () => {
  const menuIconRef = useRef();
  const [menuOpen, setMenuOpen] = useState(false)

  const onClickMenuButton = () => {
    setMenuOpen(!menuOpen)
  };

  const onCloseMenu = () => {
    setMenuOpen(false)
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            ref={menuIconRef}
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={onClickMenuButton}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="demo-menu"
            anchorEl={menuIconRef.current}
            open={menuOpen}
            onClose={onCloseMenu}
          >
            <MenuItem
              key={`menu-item-example`}
              onClick={onCloseMenu}
            >
              <ListItemIcon>
                <DoubleArrowIcon />
              </ListItemIcon>
              <ListItemText>
                <Link href="/example">Example222</Link>
              </ListItemText>
            </MenuItem>
          </Menu>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Next.js Box
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default TopBar;
