import { redirect } from "react-router";
import { backend_request } from "../../lib/backend";

export async function clientAction({request}) {

    const response_json = await backend_request('/auth/recipient/logout', {
        method: 'DELETE',
        credentials: 'include'
    });

    if(response_json.success)
        return redirect("/recipient/login");
    
}

export default function AccountPage(){
    return <>
        <h1>Account Page</h1>
    </>;
}