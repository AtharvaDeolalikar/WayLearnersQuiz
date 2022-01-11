import { useParams } from "react-router-dom";

export default function Result() {
  const { examID } = useParams();
  console.log(examID);
  return (
    <embed
      src={`/${examID}.pdf#toolbar=0`}
      className="embeddedPdf"
      type="application/pdf"
    />
  );
}
