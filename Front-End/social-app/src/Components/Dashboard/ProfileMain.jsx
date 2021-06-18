import React, { useState, useEffect } from "react"
import { useHistory } from "react-router-dom";
import axios from "axios";
// redux
import { useSelector, useDispatch } from "react-redux";
import saveUser from "../../actions/saveUser"


const ProfileMain = () => {
    // redux stuff
    const LoggedUser = useSelector((state) => {
        return state.User;
    })
    console.log(LoggedUser);
    const dispatch = useDispatch();

    // history hook
    let history = useHistory();
    // setting loading true when we request add new  in database
    let [isLoading, setLoading] = useState(false);

    let [allCurrentData, setAllCurrentData] = useState({
        fname: "",
        lname: "",
        email: "",
        username: "",
        password: "",
        PicUrl: ""
    });
    console.log(allCurrentData);
    useEffect(() => {
        setLoading(true);
        let token = localStorage.getItem("token");
        const urlProfileDetails = "http://localhost:5000/api/dashboard/profile";
        axios.post(urlProfileDetails, { token: token })
            .then((data) => {
                console.log(data);
                setAllCurrentData(data.data);
                // redux storing the user for all usecases
                dispatch(saveUser(data.data));
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
                history.push("/sign");
            })
    }, []);


    return (
        <>
            {
                isLoading ? <h1>Loading ..... </h1> :
                    <div>
                        <img src={allCurrentData.PicUrl} alt="profile-pic"></img>
                        <h1>First Name :{allCurrentData.fname}</h1>
                        <h1>First Name :{allCurrentData.lname}</h1>
                        <h1>First Name :{allCurrentData.email}</h1>
                        <h1>First Name :{allCurrentData.username}</h1>
                    </div>
            }
        </>
    )
}
export default ProfileMain;
