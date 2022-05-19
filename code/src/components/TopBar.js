// 3rd-party
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import MenuItem from '@mui/material/MenuItem'
import React from 'react'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'


class TopBar extends React.Component {
  constructor(props) {
    super(props)

    this.menuIconRef = React.createRef()

    this.state = {
      menuOpen: false,
    }
  }

  onClickMenuButton = () => {
    this.setState({
      menuOpen: !this.state.menuOpen
    })
  }

  onCloseMenu = () => {
    this.setState({
      menuOpen: false
    })
  }

  render = () => {
    const menuIconElem = (this.menuIconRef ? this.menuIconRef.current : null)

    return (
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              ref={this.menuIconRef}
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={this.onClickMenuButton}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="demo-menu"
              anchorEl={menuIconElem}
              open={this.state.menuOpen}
              onClose={this.onCloseMenu}
            >
              <MenuItem>
                <ListItemIcon>
                  <DoubleArrowIcon />
                </ListItemIcon>
                <ListItemText>
                  Home
                </ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <DoubleArrowIcon />
                </ListItemIcon>
                <ListItemText>
                  Demo 1
                </ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <DoubleArrowIcon />
                </ListItemIcon>
                <ListItemText>
                  Demo 2
                </ListItemText>
              </MenuItem>
            </Menu>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              React Box
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
    )
  }
}


export default TopBar
