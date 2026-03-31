import Certificate from "../components/certificate.jsx";
import { useNavigate} from "react-router";

export function clientLoader({params}){
    const certificate_no = params.certificate_no

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
            issue_date: '2025-10-10'
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