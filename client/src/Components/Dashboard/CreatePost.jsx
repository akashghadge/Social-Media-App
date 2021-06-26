import React, { useState, useEffect } from "react"
import GetAuth from "../../helper/auth.helper";
import SnackBarCustom from "../SmallComponents/SnackBarCustom"
import { Button } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import ReactLoading from "react-loading"
const useStyles = makeStyles((theme) => ({
    profileButtonFollow: {
        color: "#00ff00",
        backgroundColor: "white",
        border: "solid 1px #00ff00",
        '&:hover': {
            color: "white",
            backgroundColor: "#22ff22",
        },
    }

}));
const CreatePost = () => {
    const classes = useStyles();
    let [snackbarObj, setSnackbarObj] = useState({
        text: "hello world",
        backgroundColor: "black"
    });
    let [open, setOpen] = useState(false);
    function handleClickCloseSnackBar() {
        setOpen(false);
    }

    // setting loading true when we request add new  in database
    let [isLoading, setLoading] = useState(false);
    let [user, setUser] = useState({});
    useEffect(() => {
        GetAuth()
            .then((data) => {
                setUser(data);
            })
            .catch((err) => {
                console.log(err);
            })
    }, []);


    let [allCurrentData, setAllCurrentData] = useState({
        photo: "",
        desc: "",
        postedById: ""
    });
    function inputChange(event) {
        const { id, value } = event.target
        // console.log(id, value);
        setAllCurrentData((prev) => {
            return {
                ...prev,
                [id]: value
            }
        })
    }


    let [photo, setPhoto] = useState(null);
    function fileInputChange(e) {
        setPhoto(e.target.files[0]);
    }
    function SendPost(e) {
        if (allCurrentData.desc.length == 0) {
            // notification
            setSnackbarObj({ text: "Post Must Contain description", backgroundColor: "red" });
            setOpen(true);
            return;
        }
        const urlUploadCloud = "https://api.cloudinary.com/v1_1/asghadge/image/upload";
        const urlServerUploadPost = "/api/post/new";
        let formdata = new FormData();
        formdata.append("file", photo);
        formdata.append("upload_preset", "social-media");
        formdata.append("cloud_name", "asghadge");
        setLoading(true);
        fetch(urlUploadCloud,
            {
                method: "post",
                body: formdata
            })
            .then((res) => res.json())
            .then((data) => {
                let postData = {
                    postedById: user.id,
                    photo: data.url,
                    desc: allCurrentData.desc
                }
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(postData)
                };
                fetch(urlServerUploadPost, requestOptions)
                    .then((res) => res.json())
                    .then((data) => {
                        // notification
                        setSnackbarObj({ text: "Post Created", backgroundColor: "green" });
                        setOpen(true);
                        setLoading(false);
                    })
                    .catch((err) => {
                        // notification
                        setSnackbarObj({ text: "Post Not created", backgroundColor: "red" });
                        setOpen(true);
                        setLoading(false);
                    })
            })
            .catch((err) => {
                // notification
                setSnackbarObj({ text: "Post Not created", backgroundColor: "red" });
                setOpen(true);
                setLoading(false);
            })
    }
    return (
        <>
            <div className="createPostParentMain">
                <div className="createPostParent">
                    <div className="createPostContainer">
                        <h1 style={{ marginBottom: "2rem" }}>Create Post</h1>
                        <span className="createPostTexts">Upload Image</span>
                        <label for="postPic" class="createPostInputFile">
                            Upload Image
                        </label>
                        <input type="file" id="postPic" className="createPostInputFile" onChange={fileInputChange} accept="image/*">
                        </input>
                        <br></br>
                        <span className="createPostTexts" >Description</span>
                        <input type="text" className="createPostInputText" id="desc" onChange={inputChange} value={allCurrentData.desc} required></input>
                        <br></br>
                        {

                            (isLoading) ?
                                <>
                                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                        <ReactLoading type={"bubbles"} color={"black"} height={"10%"} width={"10%"}></ReactLoading>
                                    </div>
                                </> :
                                <Button className={classes.profileButtonFollow} type="submit" onClick={SendPost}>SendPost</Button>
                        }
                    </div>
                </div>
            </div>

            {/* snackbar */}
            <SnackBarCustom vertical="top" horizontal="right" backgroundColor={snackbarObj.backgroundColor} color="white" open={open}
                text={snackbarObj.text} handleClickCloseSnackBar={handleClickCloseSnackBar} />
        </>)
}
export default CreatePost;
