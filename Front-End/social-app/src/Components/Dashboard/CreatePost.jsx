import React, { useState, useEffect } from "react"
import GetAuth from "../../helper/auth.helper";
const CreatePost = () => {
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
        setLoading(true);
        const urlUploadCloud = "https://api.cloudinary.com/v1_1/asghadge/image/upload";
        const urlServerUploadPost = "http://localhost:5000/api/post/new";
        let formdata = new FormData();
        formdata.append("file", photo);
        formdata.append("upload_preset", "social-media");
        formdata.append("cloud_name", "asghadge");
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
                        console.log(data);
                        setLoading(false);
                    })
                    .catch((err) => {
                        console.log(err)
                        setLoading(false);
                    })
            })
            .catch((err) => {
                setLoading(false);
                console.log(err);
            })
    }
    return (
        <>
            {
                (isLoading) ? <h1>Loading ....</h1> :
                    <div>
                        <h1>Create Post</h1>
                        <br></br>
                        <div className="">
                            <label >Description : </label>
                            <input type="text" className="" id="desc" onChange={inputChange} value={allCurrentData.desc} required></input>
                            <br></br>
                            <lable>Post Photo : </lable>
                            <input type="file" id="postPic" onChange={fileInputChange} accept="image/*"></input>
                            <br></br>
                            <button type="submit" onClick={SendPost}>SendPost</button>
                        </div>
                    </div>
            }
        </>)
}
export default CreatePost;
