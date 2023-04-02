import logo from "./logo.svg";
import "./App.css";
import { getRequest, imageSender } from "./api";
import { Header } from "./components/Header";
import { useState } from "react";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState(window.localStorage.getItem("code"));
  const [downloadInput, setDownloadInput] = useState("");
  const [file, setFile] = useState(null);

  // function downloadFile(url, fileName) {
  //   // Create an anchor element
  //   const link = document.createElement("a");

  //   // Set the href attribute to the file URL
  //   link.href = url;

  //   // Set the download attribute to specify the file name for the downloaded file
  //   link.download = fileName;

  //   // Add the link to the DOM (this is needed for Firefox)
  //   document.body.appendChild(link);

  //   // Trigger the click event to start the download
  //   link.click();

  //   // Remove the link from the DOM after the download has started
  //   document.body.removeChild(link);
  // }

  async function downloadFile(url, fileName) {
    try {
      // Fetch the content of the file
      const response = await fetch(url);

      // Check if the request was successful
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get the content as a Blob
      const blob = await response.blob();

      // Create a URL representing the Blob
      const blobUrl = URL.createObjectURL(blob);

      // Create an anchor element
      const link = document.createElement("a");

      // Set the href attribute to the Blob URL
      link.href = blobUrl;

      // Set the download attribute to specify the file name for the downloaded file
      link.download = fileName;

      // Add the link to the DOM (this is needed for Firefox)
      document.body.appendChild(link);

      // Trigger the click event to start the download
      link.click();

      // Remove the link from the DOM after the download has started
      document.body.removeChild(link);

      // Release the Blob URL after the download has completed
      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
      }, 100);
    } catch (error) {
      console.error("Error while downloading the file:", error);
    }
  }

  // Example usage:
  const fileUrl = "https://example.com/path/to/your/file.txt";
  const fileName = "file.txt";
  downloadFile(fileUrl, fileName);

  const handleOutPut = async (data) => {
    // console.log({ data });
    // return;
    setIsLoading(true);
    let random = Math.floor(Math.random() * 10000000 + 1).toString(16);
    let fileName = `${random}.png`;
    try {
      const res = await getRequest(`upload_file?fileName=${fileName}`);
      console.log({ res });
      const { result } = res.data || {};
      if (result) {
        console.log({ result });
        imageSender(result, data)
          .then((resimage) => {
            window.localStorage.setItem("code", random);
            setCode(random);
            console.log({ resimage });
          })
          .catch((err) => {
            console.log("Failed");
          });
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const res = await getRequest(`get_file?fileName=${downloadInput}.png`);
      const { result } = res.data || {};
      console.log({ result });
      downloadFile(result, `${downloadInput}.png`);
      // if (result) setImageUrl({ loader: false, image: result });
    } catch (error) {
      // setImageUrl({ loader: false, image: "" });
      // toast.info("failed to load Image!");
    }
  };

  return (
    <div className="App">
      <Header />
      <input
        type="file"
        accept="image/png"
        id="files"
        className="file-req"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button
        onClick={() => handleOutPut(file)}
        type="submit"
        class="items-center justify-center  px-4 py-3 ml-10 text-base font-semibold text-white transition-all duration-200 bg-blue-600 border border-transparent rounded-md lg:inline-flex hover:bg-blue-700 focus:bg-blue-700"
      >
        Send
      </button>

      <h1 class="my-32 text-xl">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            Code: <span class="font-black">{code}</span>
          </>
        )}
      </h1>

      <div>
        <input
          className="p-2 rounded-md"
          style={{ border: "1px solid #000" }}
          placeholder="enter code to download"
          type="text"
          value={downloadInput}
          onChange={(e) => setDownloadInput(e.target.value)}
        />
        <a
          href="#"
          title=""
          class="items-center justify-center px-4 py-3 ml-10 text-base font-semibold text-white transition-all duration-200 bg-blue-600 border border-transparent rounded-md lg:inline-flex hover:bg-blue-700 focus:bg-blue-700"
          role="button"
          onClick={handleDownload}
        >
          Download
        </a>
      </div>
    </div>
  );
}

export default App;
