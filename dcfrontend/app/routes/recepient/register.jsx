import Register from "../../components/register.jsx";
import {redirect} from "react-router";
import { backend_request } from "../../lib/backend.js";

export async function clientAction({request}) {

    let formData = await request.formData();
    let requestJSON = JSON.stringify(Object.fromEntries(formData));

    const response_json = await backend_request(
        '/auth/recepient/register', {
            method:'POST',
            headers:{'Content-Type': 'application/json'},
            body:requestJSON,
            credentials:'include'
        }
    );

    if(response_json.success)
        return redirect("/recepient/login");
}

export default function RegisterPage(){
    return <Register loginURL="/recepient/login" title="Recepient Registration" />;
}