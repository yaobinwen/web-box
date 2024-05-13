// 3rd-party
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LockIcon from "@mui/icons-material/Lock";
import WifiIcon from "@mui/icons-material/Wifi";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { Avatar } from "@mui/material";
import { Button } from "@mui/material";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { Divider } from "@mui/material";
import { List, ListItem } from "@mui/material";
import { Paper } from "@mui/material";
import React, { useState } from "react";

function WiFiNetworkRow() {
  return (
    <ListItem disablePadding>
      <Accordion disableGutters style={{ minWidth: 500 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Avatar>
            <WifiIcon />
          </Avatar>
          <LockIcon style={{ fontSize: 30 }} />
          <Button>Hello</Button>
        </AccordionSummary>
        <AccordionDetails>
          <Paper elevation={0}>
            <Button>Disconnect</Button>
            <Button>Forget</Button>
          </Paper>
        </AccordionDetails>
      </Accordion>
    </ListItem>
  );
}

function DemoAccordionList() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleClickButtonOpenDialog = () => {
    setDialogOpen(!dialogOpen);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <Button onClick={handleClickButtonOpenDialog}>Open Dialog</Button>
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Dialog</DialogTitle>
        <Divider />
        <DialogContent>
          <List disablePadding style={{ minWidth: 500 }}>
            <WiFiNetworkRow />
            <WiFiNetworkRow />
          </List>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default DemoAccordionList;
