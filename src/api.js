import axios from "axios";

export const getRequest = async (endpoint) => {
  const url = "https://cpj4ezhdll.execute-api.ap-south-1.amazonaws.com/dev";
  return await axios.request({
    method: "GET",
    url: `${url}/${endpoint}`,
  });
};

export const imageSender = async (link, data) => {
  console.log({ link, data });
  return await axios({
    method: "PUT",
    url: link,
    data,
    headers: {
      "Content-Type": "image/png",
    },
  });
};
