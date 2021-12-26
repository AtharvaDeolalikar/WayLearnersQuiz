import { Box, Typography } from "@mui/material";
import Navbar from "../Components/Navbar";

export default function About(){
    return(
        <>
            <Navbar />
            <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh"}}>
                <Box sx={{bgcolor:"white", borderRadius: 3, p:3, m:1, my:{xs:9, sm:0}, maxWidth: {md: 600}}}>
                    <Typography sx={{fontSize: 25, textAlign: "center", fontWeight: 600}} >About Us</Typography>
                    <Typography mt={2}>WAY is a well established autonomous institution helping IIT-JEE & NEET aspirants to prepare effectively for these type of Advanced competitive examinations. WAY is one of the most premier organizations which conducts pre-entrance examination practice tests. Candidates are always trying to figure out the best possible ways to perform well in JEE & NEET. We think Proper guidance from experts can be a motivating factor in students' performance.</Typography>
                    <Typography mt={1}>Where Learn & Earn program by Way education initiative pvt.ltd. is trying to motivate students by setting up weekly exam for the students who are preparing for  JEE & NEET. In this program 100% syllabus will be covered and on the basis of ranking students will be rewarded with exciting scholarships. The rank will be calculated on the basis of fastest and accurate answers provided by students.</Typography>
                </Box>
            </Box>
        </>
    )
}