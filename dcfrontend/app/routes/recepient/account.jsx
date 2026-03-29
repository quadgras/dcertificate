import { Form, redirect } from "react-router";
import { backend_url } from "../../config";
import { flash } from "../../lib/flash";

export async function clientAction({request}) {

    const response = await fetch(`${backend_url}/auth/recepient/logout`, {
        method:'DELETE',
        credentials:'include'
    });

    if(!response.ok) throw new Error("Some error occured while logging out.");
    
    flash({data: {message:"Logged out successfully."}});

    return redirect("/recepient/login");
    
}

export default function AccountPage(){
    return <>
        <h1>Account Page</h1>
    </>;
}