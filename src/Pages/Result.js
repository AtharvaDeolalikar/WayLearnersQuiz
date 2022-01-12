import { useParams } from "react-router-dom";
import Navbar from "../Components/Navbar";
import resultImage from "../result.jpg";

export default function Result() {
  const { examID } = useParams();
  console.log(examID);
  return (
    <>
      <Navbar />
      <div className="resultContainer">
        <img
          src={resultImage}
          className="embeddedImage"
          type="application/pdf"
        />
      </div>
    </>
  );
}
