import { useParams } from "react-router-dom";
import resultImage from "../result.jpg";

export default function Result() {
  const { examID } = useParams();
  console.log(examID);
  return (
    <div className="resultContainer">
      <img src={resultImage} className="embeddedImage" type="application/pdf" />
    </div>
  );
}
