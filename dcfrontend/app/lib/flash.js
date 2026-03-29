export function flash({data}){
    const flash_event = new CustomEvent('flash-event', {
        detail: data,
        bubbles: true
    });

    document.dispatchEvent(flash_event);
}