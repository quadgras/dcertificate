import Certificate from "../components/certificate.jsx";
import { useNavigate} from "react-router";
import { backend_request } from "../lib/backend.js";
import { flash } from "../lib/flash.js";
import { Share2, ArrowLeft } from "lucide-react";

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

    async function share_certificate(){
        const share_data = {
            title: loaderData.data.certificate_id,
            url: `${import.meta.env.VITE_FRONTEND_URL}/certificate/${loaderData.data.certificate_id}`
        }
        
        try{
            //await navigator.clipboard.writeText(`${import.meta.env.VITE_FRONTEND_URL}/certificate/${loaderData.data.certificate_id}`);
            //await flash([{type:'info', message:'Certificate link copied to clipboard.'}]);
            await navigator.share(share_data);
        } catch(error) {
            try {
                await navigator.clipboard.writeText(`${import.meta.env.VITE_FRONTEND_URL}/certificate/${loaderData.data.certificate_id}`);
                await flash([{type:'info', message:'Certificate link copied to clipboard.'}]);
            } catch (error) {
                await flash([{type:'error', message:'Some error occured. Cannot share or copy to clipboard.'}]);
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
        return <p>Certificate does not exist.</p>;
    }
}