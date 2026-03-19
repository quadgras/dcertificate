import { Form, redirect } from "react-router";

export async function clientAction({request}) {

    const response = await fetch("https://localhost:5000/auth/recepient/logout", {
        method:'POST',
        credentials:'include'
    });

    if(!response.ok) throw new Error("Some error occured while logging out.");

    return redirect("/recepient/login");
    
}

export default function AccountPage(){
    return <>
        <h1>Account Page</h1>
    </>;
}