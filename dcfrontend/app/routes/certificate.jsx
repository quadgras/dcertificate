import Certificate from "../components/certificate.jsx";
import { useNavigate} from "react-router";
import { backend_request } from "../lib/backend.js";

export async function clientLoader({params}){
    const certificate_no = params.certificate_no

    const response_json = await backend_request(
        `/certificate/details/${certificate_no}`,
        {
            method: 'GET',
            credentials: 'include'
        }
    );
    
    return response_json;
}

export default function CertificatePage({loaderData}){
    const navigate = useNavigate();

    if(loaderData && loaderData.success){
        return <>
            <Certificate data={loaderData.data} />
            <button onClick={()=>navigate(-1)}>Go to last page</button>
        </>;
    } else {
        return <p>Certificate does not exist.</p>;
    }
}