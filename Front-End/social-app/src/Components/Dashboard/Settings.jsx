import React, { useEffect, useState } from "react"
import axios from "axios";
import { useHistory } from "react-router-dom";
import { Save } from "@material-ui/icons";
import SnackBarCustom from "../SmallComponents/SnackBarCustom"
const Settings = () => {
    let [snackbarObj, setSnackbarObj] = useState({
        text: "hello world",
        backgroundColor: "black"
    });
    let [open, setOpen] = useState(false);
    function handleClickCloseSnackBar() {
        setOpen(false);
    }
    let history = useHistory();
    let [isLoading, setLoading] = useState(false);
    let [allCurrentData, setAllCurrentData] = useState({
        fname: "",
        lname: "",
        email: "",
        username: "",
        password: "",
        PicUrl: "",
        _id: ""
    });
    let token = localStorage.getItem("token");
    useEffect(() => {
        setLoading(true);
        const urlProfileDetails = "http://localhost:5000/api/dashboard/profile-edit";
        axios.post(urlProfileDetails, { token: token })
            .then((data) => {
                console.log(data.data);
                setAllCurrentData(data.data);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                history.push("/sign");
            })
    }, []);


    // radio varibles
    function inputChange(event) {
        const { id, value } = event.target
        // console.log(id, value);
        setAllCurrentData((prev) => {
            return {
                ...prev,
                [id]: value
            }
        })
        console.log(allCurrentData);
    }
    console.log(allCurrentData);
    function updateUser(e) {
        if (allCurrentData.fname.length < 3 || allCurrentData.lname.length < 3) {
            setSnackbarObj({ text: "First and Last name must have atleast 3 letters", backgroundColor: "red" });
            setOpen(true);
        }
        else {

            setLoading(true);
            const urlUpdateUser = "http://localhost:5000/api/dashboard/edit";
            const updateData = {
                id: allCurrentData._id,
                update: allCurrentData,
                token: token
            };
            axios.post(urlUpdateUser, updateData)
                .then((data) => {
                    console.log(data);
                    setSnackbarObj({ text: "Profile Updated", backgroundColor: "green" });
                    setOpen(true);
                    setLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    setSnackbarObj({ text: "No Update", backgroundColor: "red" });
                    setOpen(true);
                    setLoading(false);
                })
        }
    }
    return (
        <>
            <h1>Settings</h1>
            {
                isLoading ? <h1>Loading ..... </h1> :
                    <div>
                        <input type="text" id="fname" value={allCurrentData.fname} onChange={inputChange}></input>
                        <br></br>

                        <input type="text" id="lname" value={allCurrentData.lname} onChange={inputChange}></input>
                        <br></br>
                        <br></br>
                        {/* 
                        <input type="password" id="password" value={allCurrentData.password} onChange={inputChange}></input>
                        <br></br> */}
                        <button className="submitButton" onClick={updateUser}><Save></Save></button>
                    </div>
            }
            {/* snackbar */}
            <SnackBarCustom vertical="top" horizontal="right" backgroundColor={snackbarObj.backgroundColor} color="white" open={open}
                text={snackbarObj.text} handleClickCloseSnackBar={handleClickCloseSnackBar} />
        </>
    )
}
export default Settings;
