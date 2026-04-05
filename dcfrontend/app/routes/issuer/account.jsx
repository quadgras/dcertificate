import { redirect } from "react-router";
import { backend_request } from "../../lib/backend";

export async function clientAction({request}) {

    const response_json = await backend_request('/auth/issuer/logout', {
        method: 'DELETE',
        credentials: 'include'
    });

    if(response_json.success)
        localStorage.removeItem('issuer_display_name');
        localStorage.removeItem('issuer_username');
        return redirect("/issuer/login");
    
}

export default function AccountPage(){
    return <>
        <h1>Issuer Account Page</h1>
    </>;
}