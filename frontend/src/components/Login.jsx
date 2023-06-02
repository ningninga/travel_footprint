import { Cancel, Room } from "@material-ui/icons";
import axios from "axios";
import { useRef, useState } from "react";
import "./login.css";
import Alert from '@material-ui/lab/Alert';


export default function Login({ setShowLogin, setCurrentUsername, myStorage, setAlertTimeout }) {
    const [error, setError] = useState(false);
    const usernameRef = useRef();
    const passwordRef = useRef();
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [logoutTimeoutId, setLogoutTimeoutId] = useState();


    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = {
            username: usernameRef.current.value,
            password: passwordRef.current.value,
        };
        try {
            const res = await axios.post("users/login", user);
            setCurrentUsername(res.data.username);
            myStorage.setItem('user', res.data.username);
            setLoginSuccess(true);
            
            if(logoutTimeoutId){
                clearTimeout(logoutTimeoutId);
            }

            const newLogoutTimeoutId = setTimeout(() => {
                myStorage.removeItem('user');
                setCurrentUsername(null);
                setAlertTimeout(true);
                
                setTimeout(() => {
                    setAlertTimeout(false);
                }, 2000);
            }, 60 * 60 * 1000); // one hour

            setLogoutTimeoutId(newLogoutTimeoutId);

            setTimeout(() => {
                setLoginSuccess(false);
                setShowLogin(false);
            }, 2000);
        } catch (err) {
            console.log(err)
            setError(true);
        }
    };

    return (
        <>
            <div className="loginContainer">
                <div className="logo">
                    <Room className="logoIcon" />
                    <span>NN Pin</span>
                </div>
                <form onSubmit={handleSubmit}>
                    <input autoFocus placeholder="username" ref={usernameRef} />
                    <input
                        type="password"
                        min="6"
                        placeholder="password"
                        ref={passwordRef}
                    />
                    <button className="loginBtn" type="submit">
                        Login
                    </button>
                    {error && <span className="failure">Something went wrong!</span>}
                    {loginSuccess && <Alert severity="success">Login Successful!</Alert>}

                </form>


                <Cancel className="loginCancel" onClick={() => setShowLogin(false)} />
            </div>

        </>
    );
}