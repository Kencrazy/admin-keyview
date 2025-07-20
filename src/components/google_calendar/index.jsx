import { SnackProvider } from "./snack_provider";
import DemoWrapper from "./demo_wrapper";
export default function CalendarLayout({event,setEvents}){
    return(
        <SnackProvider>
            <DemoWrapper event={event} setEvents={setEvents}/>
        </SnackProvider>
    )
}