import { useLoading } from "../context/LoadingContext";
import Loading from "./loading";

const Button = ({ callback, text, background = "bg-green-500", icon }) => {
  const { loading } = useLoading();
  console.log(loading);

  return (
    <>
      {loading ? (
        <div className="flex justify-center">
          <button
            type="button"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            <Loading color="white" />
          </button>
        </div>
      ) : (
        <button
          onClick={callback}
          className={` ${background} text-white px-4 py-2 rounded`}
        >
          <div className="flex gap-2 items-center">
            {icon}
            {text}
          </div>
        </button>
      )}
    </>
  );
};
export default Button;
