export async function flash(notifications){
    const flash_event = new CustomEvent('flash-event', {
        detail: notifications,
        bubbles: true
    });

    document.dispatchEvent(flash_event);
}