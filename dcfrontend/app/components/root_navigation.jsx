import { useState } from "react";
import styles from "./styles/root_navigation.module.css";
import { Link } from "react-router";

export default function RootNavigaion() {
    const [open, set_open] = useState(false);

    function toggle() {
        set_open((last_state) => !last_state);
    }

    return <>
        <button className={styles.toggle} onClick={toggle}>
            {open?'x':'='}
        </button>
        {open &&
            <nav className={styles.root_navigation}>
                <h1>Menu</h1>
                <h2>Recipient</h2>
                <Link to='/recepient/login'>Login</Link> <br/>
                <Link to='/recepient/register'>Register</Link>

                <h2>Issuer</h2>
                <Link to='/issuer/login'>Login</Link> <br/>
                <Link to='/issuer/register'>Register</Link>

                <h2>Other Options</h2>
                <Link to=''>Verify Certificates</Link> <br/> 
                <Link to=''>User Manual</Link> <br/>
                <Link to='/'>Home</Link>
            </nav>
        }
    </>;
}