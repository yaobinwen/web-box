// 3rd-party
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ContentCut from '@mui/icons-material/ContentCut'
import ContentCopy from '@mui/icons-material/ContentCopy'
import ContentPaste from '@mui/icons-material/ContentPaste'
import React from 'react'
import { Typography } from '@mui/material'


class DemoMenu extends React.Component {
  constructor(props) {
    super(props)

    this.btnRef = React.createRef()

    this.state = {
      menuOpen: false,
    }
  }

  onClick = () => {
    this.setState({
      menuOpen: true,
    })
  }

  onClose = () => {
    this.setState({
      menuOpen: false,
    })
  }

  render = () => {
    const menuItems = [
      {
        name: "Copy",
        icon: (<ContentCopy />),
        shortcut: "⌘C",
      },
      {
        name: "Cut",
        icon: (<ContentCut />),
        shortcut: "⌘X",
      },
      {
        name: "Paste",
        icon: (<ContentPaste />),
        shortcut: "⌘P",
      },
    ]

    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Button
            id="basic-button"
            ref={this.btnRef}
            aria-controls={this.state.menuOpen ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={this.state.menuOpen ? 'true' : undefined}
            onClick={this.onClick}
            size="large"
            variant="contained"
            sx={{
              margin: 10,
            }}
            style={{
              minWidth: 100,
              minHeight: 100,
            }}
          >
            Edit Menu
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={this.btnRef ? this.btnRef.current : null}
            open={this.state.menuOpen}
            onClose={this.onClose}
            sx={{
              "& .MuiPaper-root": {
                width: "300px"
              }
            }}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            {
              menuItems.map((itemDef) => (
                <MenuItem
                  key={itemDef.name}
                  sx={{paddingTop: 2.5, paddingBottom: 2.5}}
                  onClick={this.onClose}
                >
                  <ListItemIcon children={itemDef.icon} />
                  <ListItemText
                    sx={{paddingLeft: 1}}
                    primaryTypographyProps={{variant: "h6"}}
                    primary={itemDef.name}
                  />
                  <Typography variant="h6" color="text.secondary">
                    {itemDef.shortcut}
                  </Typography>
                </MenuItem>
              ))
            }
          </Menu>
        </Grid>
      </Grid>
    )
  }
}

export default DemoMenu
