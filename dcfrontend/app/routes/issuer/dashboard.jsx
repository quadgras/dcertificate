import { redirect } from "react-router";
import DashboardLayout from "../../components/dashboard_layout.jsx";
import { backend_request } from "../../lib/backend.js";

export async function clientLoader({ params }) {
    const response_json = await backend_request('/issuer/account-details', {
        method: 'GET',
        credentials: 'include'
    });

    if(response_json.success)
        return response_json.data;
    else
        return redirect('/issuer/login');
}

export default function Dashboard({ loaderData }) {
    return <DashboardLayout nav_items={{
        "Account": "/recipient/account",
        "Certificates": "/recipient/certificates"
    }} title="Recipient" username={loaderData.display_name}
        logoutHandlerURL="/recipient/account" />
}