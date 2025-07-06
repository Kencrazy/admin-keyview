import { SnackProvider } from "./snack_provider";
import DemoWrapper from "./demo_wrapper";
export default function CalendarLayout({event}){
    return(
        <SnackProvider>
            <DemoWrapper event={event}/>
        </SnackProvider>
    )
}