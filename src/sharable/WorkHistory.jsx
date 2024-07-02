
import Rating from "./Rating";
const WorkHistory = ({ workHistory }) => (
  <div className="my-4">
    <h3 className="text-lg font-semibold  border-b border-gray-200 mb-4">
      Work History
    </h3>
    {workHistory.map((work, index) => (
      <div key={index} className="mb-4 p-4 bg-gray-100 rounded-md shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-semibold text-primary">{work.title}</h4>
            <div className="flex justify-between items-center">
              <p className="text-gray-600">{work.date}</p>
              <Rating rating={work?.review?.rating} />
            </div>
            <p className="text-gray-600">{work.review.comment}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-600">{work.price}</p>
            <p className="text-gray-600">{work.rate}</p>
            <p className="text-gray-600">{work.hours} hours</p>
          </div>
        </div>
      </div>
    ))}
  </div>
);
export default WorkHistory;
