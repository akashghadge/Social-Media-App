import React, { useState, useEffect } from "react"
import { useParams } from "react-router";
import axios from "axios"
const PublicProfile = () => {
    let params = useParams();
    let [isLoading, setLoading] = useState(false);

    let [allCurrentData, setAllCurrentData] = useState({
        fname: "",
        lname: "",
        email: "",
        username: "",
        password: "",
        PicUrl: ""
    });
    useEffect(() => {
        setLoading(true);
        const urlPublicUser = "http://localhost:5000/api/user/public-profile";
        const body = {
            id: params.id
        };
        axios.post(urlPublicUser, body)
            .then((data) => {
                console.log(data);
                setAllCurrentData(data.data);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                alert(err);
                setLoading(false);
            })
    }, []);
    return (
        <>
            {
                isLoading ? <h1>Loading ..... </h1> :
                    <div>
                        <img src={allCurrentData.PicUrl} width="100px" height="100px" alt="profile-pic"></img>
                        <h1>First Name :{allCurrentData.username}</h1>
                    </div>
            }
        </>
    )
}
export default PublicProfile;
