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

    // following is sample data while developing.
    // use loaded data
    // and if certificate not found
    // show not found message.
    // if expired,
    // show expired message.
    
    return {
        success: true,
        data: {
            username: 'abhijeet',
            'display_name': 'Abhijeet',
            certificate_no: params.certificate_no,
            issuer: 'ABC INC',
            approvals: [],
            issue_date: '2025-10-10',
            pre_subject: 'It is certified that',
            post_subject: 'is virgin and best programmer in university.'
        }
    };
}

export default function CertificatePage({loaderData}){
    const navigate = useNavigate();

    return <>
        <Certificate name={loaderData.data.display_name} cno={loaderData.data.certificate_no}/>
        <p>Share Link: &lt;frontend-host&gt;/certificate/{loaderData.data.certificate_no}</p>
        <button onClick={()=>navigate(-1)}>Go to last page</button>
    </>;
}