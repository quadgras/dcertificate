import Certificate from "../components/certificate.jsx";
import { useNavigate} from "react-router";
import { backend_request } from "../lib/backend.js";
import { flash } from "../lib/flash.js";
import { Share2, ArrowLeft } from "lucide-react";

export async function clientLoader({params}){
    const certificate_no = params.certificate_id

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

    async function share_certificate(){
        const share_data = {
            url: `${import.meta.env.VITE_FRONTEND_URL}/certificate/${loaderData.data.certificate_id}`
        }
        
        try{
            await navigator.share(share_data);
        } catch(error) {
            try {
                await navigator.clipboard.writeText(share_data.url);
                await flash([{type:'info', message:'Certificate link copied to clipboard.'}]);
            } catch (error) {
                await flash([{type:'error', message:'Some error occured. Cannot share or copy.'}]);
            }
        }
    }

    if(loaderData && loaderData.success){
        return <>
            <Certificate data={loaderData.data} />
            <button onClick={()=>navigate(-1)}><ArrowLeft /></button>
            <button onClick={share_certificate}><Share2 /></button>
        </>;
    } else {
        return <>
            <p>Certificate does not exist.</p>
            <button onClick={()=>navigate(-1)}><ArrowLeft /></button>
        </>;
    }
}