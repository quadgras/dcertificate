import { useState } from "react";
import styles from "./styles/detail_list.module.css";
import { ChevronDown, ChevronRight } from "lucide-react";

export default function DetailList({}){
    const content = [
        ["A", <p>Details of A</p>],
        ["B", <p>Details of B</p>],
        ["C", <p>Details of C</p>]
    ];

    const indexed_content = content.map((item, index) => [index, ...item]);

    const [activeKey, setActiveKey] = useState(null);

    function toggle_detail(index){
        if(index === activeKey)
            setActiveKey(null);
        else
            setActiveKey(index);
    }

    return <div className={styles.detail_list}>
        {indexed_content.map(detail => <div className={styles.detail_element}>
            <div className={styles.detail_title} onClick={()=>toggle_detail(detail[0])}>
                {detail[0] === activeKey?<ChevronDown size={20}/>:<ChevronRight size={20}/>}
                {detail[1]}
            </div>
            {(detail[0] === activeKey) && detail[2]}
        </div>)}
    </div>
}