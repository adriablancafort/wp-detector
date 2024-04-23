export const detectBrowser = () => {
  const userAgent = navigator.userAgent;

  if (userAgent.match(/Chrome/i)) {
    return "chrome";
  } else if (userAgent.match(/Firefox/i)) {
    return "firefox";
  } else if (userAgent.match(/Safari/i)) {
    return "safari";
  } else if (userAgent.match(/Edge/i)) {
    return "edge";
  } else {
    return "unknown";
  }
};