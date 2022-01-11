import { Box, Typography } from "@mui/material";
import Navbar from "../Components/Navbar";

export default function TermsConditions(){
    return(
        <>
            <Navbar />
            <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh"}}>
                <Box sx={{bgcolor:"white", borderRadius: 3, p:3, m:1, my:{xs:9, sm:0}, maxWidth: {md: 600}}}>
                    <Typography sx={{fontSize: 25, textAlign: "center", fontWeight: 600}} >Terms and Conditions</Typography>
                    <ul className="terms">
                        <li>Exam will be of 20 questions.</li>
                        <li>Time provided for the exam will be 20 minutes.</li>
                        <li>You have to finish the whole exam in 20 minutes.</li>
                        <li>The fastest and accurate answer is required to secure RANK in the contest for the scholarship.</li>
                        <li>Minimum passing marks to secure the RANK is 35% i.e. you have to give at least 7 right answer.</li>
                        <li>Once we declared the winner, student (winner) have to fill detailed the Form to get his scholarship.</li>
                    </ul>
                </Box>
            </Box>
        </>
    )
}