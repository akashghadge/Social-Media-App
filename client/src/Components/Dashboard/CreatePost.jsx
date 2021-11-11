import React, { useState, useEffect } from "react"
import GetAuth from "../../helper/auth.helper";
import SnackBarCustom from "../SmallComponents/SnackBarCustom"
import ReactLoading from "react-loading"
const CreatePost = () => {
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
        if (user.id == undefined || user.id == null) {
            setSnackbarObj({ text: "Please Sign To Create Post", backgroundColor: "red" });
            setOpen(true);
            return;
        }
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
            <div className="container-main-dash p-3">
                <div className="container-dash">
                    <div>
                        <h1 className="heading-dash">Create Post</h1>
                        <span className="text-dash">Upload Image</span>
                        <label for="postPic" class="input-file-dash">
                            Upload Image
                        </label>
                        <input type="file" id="postPic" className="input-file-dash" onChange={fileInputChange} accept="image/*">
                        </input>
                        <br></br>
                        <span className="text-dash" >Description</span>
                        <input type="text" className="input-field-dash" id="desc" onChange={inputChange} value={allCurrentData.desc} required></input>
                        <br></br>
                        {

                            (isLoading) ?
                                <>
                                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                        <ReactLoading type={"bubbles"} color={"black"} height={"10%"} width={"10%"}></ReactLoading>
                                    </div>
                                </> :
                                <button className="btn-success btn" type="submit" onClick={SendPost}>SendPost</button>
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
