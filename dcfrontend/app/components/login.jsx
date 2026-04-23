import { Form, Link } from "react-router";
import RootNavigaion from "./root_navigation";
import styles from "./styles/auth.module.css";
import PasswordInput from "./password_input";

export default function LogIn({ title, registerURL }) {

    return <div>
        <h1>{title}</h1>
        <Form method="POST" className={styles.auth_form}>
            <label for="username">Username</label>
            <input name="username" type="text" required />
            <label for="password">Password</label>
            <PasswordInput name='password' />
            <button type="submit">Submit</button>
        </Form>
        <p>Don't have an account? <Link to={registerURL}>Register</Link></p>
        <RootNavigaion />
    </div>
}