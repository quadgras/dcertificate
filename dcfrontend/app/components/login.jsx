import { Form, Link } from "react-router";
import { useState } from "react";
import RootNavigaion from "./root_navigation";
import styles from "./styles/auth.module.css";
import { Eye, EyeOff } from "lucide-react";

export default function LogIn({ title, registerURL }) {
    const [showPassword, setShowPassword] = useState(false);

    function toggle_password_visibility() {
        setShowPassword((last_state)=>!last_state);
    }

    return <div>
        <h1>{title}</h1>
        <Form method="POST" className={styles.auth_form}>
            <label for="username">Username</label>
            <input name="username" type="text" required />
            <label for="password">Password</label>
            <input name="password" type={showPassword ? "text" : "password"} required />
            <button type='button' onClick={toggle_password_visibility}>
                {showPassword ? <Eye /> : <EyeOff />}
            </button>
            <button type="submit">Submit</button>
        </Form>
        <p>Don't have an account? <Link to={registerURL}>Register</Link></p>
        <RootNavigaion />
    </div>
}