import { SnackProvider } from "./snack_provider";
import DemoWrapper from "./demo_wrapper";
export default function CalendarLayout(){
    return(
        <SnackProvider>
            <DemoWrapper/>
        </SnackProvider>
    )
}