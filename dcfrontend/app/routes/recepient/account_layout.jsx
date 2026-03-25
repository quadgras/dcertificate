import { redirect } from "react-router";
import AccountLayout from "../../components/accountlayout.jsx";
import { backend_url } from "../../config.js";

export async function clientLoader({ params }) {
    const response = await fetch(`${backend_url}/recepient/account-details`, {
        method: 'GET',
        credentials: 'include'
    });

    const responsejson = await response.json();

    if (!response.ok) return redirect('/recepient/login');
    return responsejson.data;
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

export default function AccountLayoutPage({ loaderData }) {
    return <AccountLayout nav_items={{
        "Account": "/recepient/account",
        "Certificates": "/recepient/certificates"
    }} title="Recepient" username={loaderData.display_name}
        logoutHandlerURL="/recepient/account" />
}