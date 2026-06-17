import { Outlet, NavLink, Form } from "react-router";
import styles from "./styles/dashboard_layout.module.css";


export default function DashboardLayout({ nav_items, title, username, logoutHandlerURL}) {
    return <div className={styles.pagelayout}>
        <div className={styles.content}><Outlet /></div>
        <nav className={styles.navbar}>
            {title} Account
            <h1>{username}</h1>
            {Object.entries(nav_items).map(
                ([key, value]) => <NavLink className={({isActive})=> isActive?styles.active_navlink:styles.navlink}to={value}>{key}</NavLink>
            )}
            <Form method="POST" action={logoutHandlerURL}><button type="submit">Logout</button></Form>
        </nav>
    </div>;
}