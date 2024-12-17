import { useContext, useEffect, useState } from "react";
import reviewImg from "../assets/review.jpg";
import { appContext } from "../AppContext";
import StatsChart from "../Components/StatsChart";
import { splitDate } from "../utils/helpers";

export const Review = () => {
  const { reviewId, setReviewId, fileData, setFileData } =
    useContext(appContext);

  const [reviewData, setReviewData] = useState([""]);

  const handleSelectFile = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      const file = files[0]; // Get the first file
      try {
        const fileContent = await handleReadFile(file); // Ensure it's awaited
        setFileData(fileContent);
      } catch (error) {
        console.error("File read error:", error);
      }
    } else {
      console.error("No file selected");
    }
  };

  const handleReadFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!(file instanceof Blob)) {
        return reject(new Error("Invalid file type"));
      }

      const fileReader = new FileReader();

      fileReader.onloadend = () => {
        if (fileReader.result) {
          resolve(fileReader.result as string);
        } else {
          reject(new Error("File could not be read"));
        }
      };

      fileReader.onerror = () => reject(new Error("Error reading file"));

      fileReader.readAsText(file); // Correct argument
      setReviewId(file.name); // Avoid side-effects in Promise
    });
  };

  useEffect(() => {
    const parseData = (input: string) => {
      // Split the input by the padding separator
      const entries = input.split(/_+\$\$\$,/);

      // Remove padding from each entry
      const cleanEntries = entries.map((entry) =>
        entry.replace(/_+\$\$\$/, "").trim()
      );

      // Parse each cleaned entry into a JSON object
      const dataArray = cleanEntries
        .filter((entry) => entry !== "") // Remove empty strings
        .map((entry) => {
          try {
            return JSON.parse(entry);
          } catch (error) {
            console.error("Invalid JSON:", entry);
            return null;
          }
        })
        .filter((item) => item !== null); // Remove null entries

      return dataArray;
    };
    const cleanedData = parseData(fileData);
    setReviewData(cleanedData);
  }, [fileData]);

  console.log(reviewData.length);

  return (
    <main className="flex min-h-[calc(100vh-64px)] items-center justify-center text-white">
      {/* BACKGROUND */}
      <div
        className="relative flex flex-col items-center w-full h-[80vh] bg-cover"
        style={{ backgroundImage: `url(${reviewImg})` }}
      >
        {/* CENTERED CONTENT */}
        {/* BUTTON */}
        {reviewId === "" && (
          <div className="flex w-full h-full justify-center items-center">
            <label className="cursor-pointer" htmlFor="browse">
              <div className="flex flex-col bg-black/80 rounded-[10px] border-[1px] border-[transparent] group p-2 transition duration-300 ease-in-out hover:border-[1px] hover:border-[white] hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                <input
                  type="file"
                  onChange={handleSelectFile}
                  hidden
                  id="browse"
                />
                <span className="text-[50px] text-center">Review session</span>
                <span className="text-[20px] text-center group-hover:underline decoration-black underline-offset-[5px]">
                  Press to select file
                </span>
              </div>
            </label>
          </div>
        )}
        {/* BACKGROUND OVERLAY */}
        {reviewId !== "" && (
          <div className="bg-black/50 w-[110vw] min-h-[80vh] fixed z-10  "></div>
        )}
        {/* COMPONENTS */}
        {reviewId !== "" && reviewData.length > 0 && reviewData[0] !== "" && (
          <div className="flex flex-col z-20 gap-20 my-[30px]">
            <div className="relative w-[80vw]">
              <StatsChart data={reviewData} />
            </div>
            {/* Render the activity data */}
            <div className="flex flex-col  w-[80vw]">
              {/* <h1 className="text-[30px]">Activity Logger</h1> */}
              <div className="flex overflow-y-hidden w-full ">
                <table className="flex flex-col w-full ">
                  <thead>
                    <tr className="flex gap-5 w-full no-wrap whitespace-nowrap text-center">
                      <th className="w-1/5 ">Date</th>
                      <th className="w-1/5 ">Time (UTC)</th>
                      <th className="w-1/5 ">CPU usage:</th>
                      <th className="w-1/5 ">Memory usage:</th>
                      <th className="w-1/5 ">Actions:</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...reviewData]
                      .slice(-10)
                      .reverse()
                      .map((data, index) => (
                        <tr
                          key={index}
                          className="flex gap-5 w-full no-wrap text-center"
                        >
                          <td className="w-1/5 ">
                            {splitDate("date", data.timestamp)}
                          </td>
                          <td className="w-1/5">
                            {splitDate("time", data.timestamp)}
                          </td>
                          <td className="w-1/5">{data.cpuUsage}</td>
                          <td className="w-1/5">
                            {data.memoryUsage.toFixed(0)}
                          </td>
                          <td className="w-1/5">{data.actions.toFixed(0)}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
