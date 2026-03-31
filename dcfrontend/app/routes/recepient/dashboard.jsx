import { redirect } from "react-router";
import DashboardLayout from "../../components/dashboard_layout.jsx";
import { backend_request } from "../../lib/backend.js";

export async function clientLoader({ params }) {
    const response_json = await backend_request('/recepient/account-details', {
        method: 'GET',
        credentials: 'include'
    });

    if(response_json.success)
        return response_json.data;
    else
        return redirect('/recepient/login');
}

// Maybe, this is a layout page with no URL
// thats why clientAction is not running.
// The Form element needs some route URL to POST to.

// export async function clientAction({request}) {

//     const response = await fetch("https://localhost:5000/auth/recepient/logout", {
//         method:'POST',
//         headers:{'Content-Type': 'application/json'},
//         body:"{}",
//         credentials:'include'
//     });

//     if(!response.ok) throw new Error("Some error occured while logging out.");

//     return redirect("/recepient/login");

// }

export default function Dashboard({ loaderData }) {
    return <DashboardLayout nav_items={{
        "Account": "/recepient/account",
        "Certificates": "/recepient/certificates"
    }} title="Recepient" username={loaderData.display_name}
        logoutHandlerURL="/recepient/account" />
}