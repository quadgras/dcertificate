import LogIn from "../../components/login";
import { redirect } from "react-router";

export async function clientAction({request}) {
    let formData = await request.formData();
    let requestJSON = JSON.stringify(Object.fromEntries(formData));
    //let requestJSON = ;
    // temporarily hard coding the api URL
    // while testing and learning.
    const response = await fetch(
        'https://localhost:5000/auth/recepient/login', {
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
        throw new Error(`Auth failed with: ${responsejson.message}`)
        //return responsejson; // if return is not redirect, the returned json or data can be accessed using useActionData() hook in UI component

    return redirect("/recepient/certificates");
    
    
}
export default function LoginPage(){
    return <LogIn title="Recepient Log In" registerURL="/recepient/register"/>
}