import { Box, Typography } from "@mui/material";

export default function Footer(){
    return(
        <Box sx={{display: "flex", position: "fixed", bottom: 0, height: 30, justifyContent: "center", placeContent: "center", width: "100%"}}>
            <Typography >Powered by Way Education</Typography>
        </Box>
    )
}