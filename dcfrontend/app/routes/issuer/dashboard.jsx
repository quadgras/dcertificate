import { redirect } from "react-router";
import DashboardLayout from "../../components/dashboard_layout.jsx";
import { backend_request } from "../../lib/backend.js";

export async function clientLoader({ params }) {
    // const response_json = await backend_request('/issuer/account-details', {
    //     method: 'GET',
    //     credentials: 'include'
    // });

    // if(response_json.success)
    //     return response_json;
    // else
    //     return redirect('/issuer/login');
    return {data:{display_name:'Not Implemented'}};
}

export default function Dashboard({ loaderData }) {
    return <DashboardLayout nav_items={{
        Account: "/issuer/account",
        Certificates: "/issuer/certificates",
        Certifications: "/issuer/certifications",
        Approvals: "/issuer/approvals"
    }} title="Issuer" username={loaderData.data.display_name}
        logoutHandlerURL="/issuer/account" />
}