import { redirect } from "react-router";
import DashboardLayout from "../../components/dashboard_layout.jsx";

export async function clientLoader({ params }) {

    const display_name = localStorage.getItem('issuer_display_name');
    if(display_name === null)
        return redirect('/issuer/login');
    else
        return {display_name: display_name};
    
}

export default function Dashboard({ loaderData }) {
    return <DashboardLayout nav_items={{
        Account: "/issuer/account",
        Certifications: "/issuer/certifications",
        Approvals: "/issuer/approvals",
        Revoke: "/issuer/revoke"
    }} title="Issuer" username={loaderData.display_name}
        logoutHandlerURL="/issuer/account" />
}