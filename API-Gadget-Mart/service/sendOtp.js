const axios = require("axios");

const sendOtp = async (phone, otp) => {
  // setting state
  let isSent = false;

  // URL to send otp
  const url = "https://api.managepoint.co/api/sms/send";

  // playload to send
  const payload = {
    apiKey: "78f671b7-ef53-47ce-ad44-e217b7631a0a",
    to: phone,
    message: `Your verification code is ${otp}`,
  };
  try {
    const res = await axios.post(url, payload);
    if (res.status === 200) {
      isSent = true;
    }
  } catch (error) {
    console.log("Error Sending OTP", error.message);
  }
  return isSent;
};

module.exports = sendOtp;

// const axios = require("axios");

// const sendOtp = async (phone, otp) => {
//   // setting state
//   let isSent = false;

//   // url to send otp
//   const url = "https://api.managepoint.co/api/sms/send";

//   // payload to send
//   const payload = {
//     apiKey: "78f671b7-ef53-47ce-ad44-e217b7631a0a",
//     to: phone,
//     message: `Your OTP is ${otp}`,
//   };

//   try {
//     const response = await axios.post(url, payload);
//     if (response.status === 200) {
//       isSent = true;
//     }
//   } catch (error) {
//     console.log("Error in sending OTP", error.message);
//   }
//   return isSent;
// };
// module.exports = sendOtp;
