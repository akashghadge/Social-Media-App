import React from 'react';
import { Snackbar, SnackbarContent } from "@material-ui/core";
const SnackBarCustom = (props) => {
    function close() {
        props.handleClickCloseSnackBar();
    }
    return (
        <>
            <Snackbar anchorOrigin={{ vertical: props.vertical, horizontal: props.horizontal }} open={props.open} onClick={close} autoHideDuration={1}>
                <SnackbarContent style={{
                    backgroundColor: props.backgroundColor,
                    color: props.color
                }} message={props.text}></SnackbarContent>

            </Snackbar>
        </>
    );
}

export default SnackBarCustom;
