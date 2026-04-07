import {Form, Link} from "react-router";
import RootNavigaion from "./root_navigation";
import styles from "./styles/auth.module.css";

export default function LogIn({title, registerURL}){
    return <div>
        <h1>{title}</h1>
        <Form method="POST" className={styles.auth_form}>
            <label for="username">Username</label>
            <input name="username" type="text" required/>
            <label for="password">Password</label>
            <input name="password" type="password" required/>
            <button type="submit">Submit</button>
        </Form>
        <p>Don't have an account? <Link to={registerURL}>Register</Link></p>
        <RootNavigaion />
    </div>
}