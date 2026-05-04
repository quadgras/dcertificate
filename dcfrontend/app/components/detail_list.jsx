import { useState } from "react";
import styles from "./styles/detail_list.module.css";
import { ChevronDown, ChevronRight } from "lucide-react";

export default function DetailList({ content }) {

    const indexed_content = content.map((item, index) => [index, ...item]);

    const [activeKey, setActiveKey] = useState(null);

    function toggle_detail(index) {
        if (index === activeKey)
            setActiveKey(null);
        else
            setActiveKey(index);
    }

    return <div className={styles.detail_list}>
        {indexed_content.map(detail => <div className={styles.detail_element} onClick={() => toggle_detail(detail[0])}>
            <div className={styles.detail_title}>
                {detail[1]}
                {detail[0] === activeKey ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </div>

            {(detail[0] === activeKey) && <div className={styles.detail_content}>{detail[2]}</div>}
        </div>)}
    </div>
}