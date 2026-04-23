import {Form, Link} from "react-router";
import RootNavigation from "./root_navigation";
import styles from "./styles/auth.module.css";
import PasswordInput from "./password_input";

export default function Register({title, loginURL}){
    return <div>
        <h1>{title}</h1>
        <Form method="POST" className={styles.auth_form}>
            <label for="username">Username</label>
            <input name="username" type="text" required />
            <label for="password">Password</label>
            <PasswordInput name="password" />
            <label for="display_name">Display Name</label>
            <input name="display_name" type="text" required />
            <button type="submit">Submit</button>
        </Form>
        <p>Already have an account? <Link to={loginURL}>Log In</Link></p>
        <RootNavigation />
    </div>
}