import LogIn from "../../components/login";
import { redirect } from "react-router";
import { backend_request } from "../../lib/backend";

export async function clientAction({request}) {
    const form_data = await request.formData();
    const request_json = JSON.stringify(Object.fromEntries(form_data));

    const response_json = await backend_request(
        '/auth/recipient/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: request_json,
            credentials: 'include'
        }
    );
    
    if(response_json.success)
        return redirect("/recipient/account");
    
    
}
export default function LoginPage(){
    return <LogIn title="Recipient Log In" registerURL="/recipient/register"/>
}