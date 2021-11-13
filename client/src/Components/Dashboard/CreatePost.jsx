import React, { useState, useEffect } from "react"
import GetAuth from "../../helper/auth.helper";
import SnackBarCustom from "../SmallComponents/SnackBarCustom"
import PageBreadcrumb from "../SmallComponents/PageBreadcrumb"
import ReactLoading from "react-loading"
import { useHistory } from "react-router-dom"
const CreatePost = () => {
    // declarations
    let history = useHistory();
    let [snackbarObj, setSnackbarObj] = useState({
        text: "hello world",
        backgroundColor: "black"
    });
    let [open, setOpen] = useState(false);
    let [allCurrentData, setAllCurrentData] = useState({
        photo: "",
        desc: "",
        postedById: ""
    });
    let [photo, setPhoto] = useState(null);
    // setting loading true when we request add new  in database
    let [isLoading, setLoading] = useState(false);
    let [user, setUser] = useState({});

    // lifecycle
    useEffect(() => {
        setLoading(true);
        GetAuth()
            .then((data) => {
                setUser(data);
                setLoading(false);
            })
            .catch((err) => {
                history.push("/sign");
                setLoading(false);
            })
    }, []);

    // methods
    function handleClickCloseSnackBar() {
        setOpen(false);
    }
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
            <PageBreadcrumb heading="Upload Post" base="Dashboard" url="profile" />
            <div className="container-fluid px-5">
                <div className="card">
                    <div className="card-body row">
                        <h1 className="heading-auth mt-2 mb-4">Create Post</h1>
                        <div className="col-12 col-md-6 mb-3 container-center-all">
                            <span className="text-dash">Share Image</span>
                            <label for="postPic" class="input-file-dash-create-post">
                                Upload Image
                            </label>
                            <input type="file" id="postPic" className="input-file-dash-create-post" onChange={fileInputChange} accept="image/*">
                            </input>
                        </div>
                        <div className="form-floating mb-3 col-12 col-md-6">
                            <textarea type="text" className="form-control" id="desc" placeholder="add description" onChange={inputChange} value={allCurrentData.desc} required></textarea>
                            <label htmlFor="desc" >Description</label>
                        </div>
                        {
                            (isLoading) ?
                                <>
                                    <div className="container-center-all">
                                        <ReactLoading type={"bubbles"} color={"black"} height={"10%"} width={"10%"}></ReactLoading>
                                    </div>
                                </> :
                                <div className="text-center">
                                    <button className="btn-success btn" type="submit" onClick={SendPost}>Share Post</button>
                                </div>
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
