import Register from "../../components/register.jsx";
import {redirect} from "react-router";

export async function clientAction({request}) {
    let formData = await request.formData();
    let requestJSON = JSON.stringify(Object.fromEntries(formData));
    //let requestJSON = ;
    // temporarily hard coding the api URL
    // while testing and learning.
    const response = await fetch(
        'https://localhost:5000/auth/recepient/register', {
            method:'POST',
            headers:{'Content-Type': 'application/json'},
            body:requestJSON,
            credentials:'include'
        }
    );

    if(!response.ok)
        throw new Error(`Error: ${response.status}`);

    const responsejson = await response.json();

    if(!responsejson.success)
        throw new Error(`Registration failed with: ${responsejson.message}`)
        //return responsejson; // if return is not redirect, the returned json or data can be accessed using useActionData() hook in UI component

    return redirect("/recepient/login");
}

export default function RegisterPage(){
    return <Register loginURL="/recepient/login" title="Recepient Registration" />;
}