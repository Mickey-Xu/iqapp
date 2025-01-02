import React from "react";
import { Button, Typography, Dialog, DialogContent, DialogTitle, AppBar, Divider, IconButton, Toolbar, Checkbox, List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';

const CheckboxListSecondary = ({ templateForm, handleToggle, checked }) => {
    return (
        <List >
            {templateForm?.form["settings"]["tagUniverse"].map((item, idx) => {
                const labelId = `checkbox-list-secondary-label-${item}`;
                return (
                    <div key={idx}>
                        <ListItem style={{ margin: "6px 0" }} button onClick={handleToggle(item)}>
                            <ListItemText primary={`
                             ${item.name === "Tag_Triangle" ?
                                    "三角项" :
                                    item.name === "Tag_Square" ?
                                        "方块项" :
                                        item.name}`} />
                            <ListItemIcon>
                                <Checkbox
                                    edge="start"
                                    checked={checked.indexOf(item) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{ 'aria-labelledby': labelId }}
                                />
                            </ListItemIcon>
                        </ListItem>
                        <Divider component="p" />
                    </div>
                );
            })}
        </List>
    );
}

const Index = ({ open, setOpen, templateForm, handleToggle, checked, confirmFilter }) => {
    return (
        <div>
            <Dialog
                fullScreen
                open={open}
                keepMounted
                onClose={() => setOpen(false)}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <AppBar style={{ backgroundColor: "rgb(220, 2, 2)" }}>
                    <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
                        <IconButton onClick={() => setOpen(false)} edge="start" color="inherit" aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" component="h2">
                            Filter
                        </Typography>
                        <Button autoFocus color="inherit" onClick={() => confirmFilter()} >
                            save
                        </Button>
                    </Toolbar>
                </AppBar>
                <DialogTitle id="alert-dialog-slide-title">{"Use Google's location service?"}</DialogTitle>
                <DialogContent>
                    <CheckboxListSecondary templateForm={templateForm} handleToggle={handleToggle} checked={checked} />
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default Index