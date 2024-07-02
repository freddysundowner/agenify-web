import { FaWhatsapp, FaFacebook, FaLinkedin, FaEnvelope } from "react-icons/fa";
const Socialicons = ({ list }) => (
  <div className="flex justify-center mb-4">
    <a
      href={`https://wa.me/${list?.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      className="mr-2"
    >
      <FaWhatsapp className="text-green-500 text-2xl" />
    </a>
    <a
      href={`https://www.facebook.com/${list?.facebook}`}
      target="_blank"
      rel="noopener noreferrer"
      className="mr-2"
    >
      <FaFacebook className="text-blue-500 text-2xl" />
    </a>
    <a
      href={`https://www.linkedin.com/in/${list?.linkedin}`}
      target="_blank"
      rel="noopener noreferrer"
      className="mr-2"
    >
      <FaLinkedin className="text-blue-700 text-2xl" />
    </a>
    <a href={`mailto:${list?.email}`} className="mr-2">
      <FaEnvelope className="text-gray-500 text-2xl" />
    </a>
  </div>
);
export default Socialicons;
