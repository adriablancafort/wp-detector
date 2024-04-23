export const detectBrowser = () => {
  const userAgent = navigator.userAgent;

  if ((userAgent.indexOf("Opera") || userAgent.indexOf('OPR')) != -1) {
    return 'opera';
  } else if (userAgent.indexOf("Edg") != -1) {
    return 'edge';
  } else if (userAgent.indexOf("Chrome") != -1) {
    return 'chrome';
  } else if (userAgent.indexOf("Safari") != -1) {
    return 'safari';
  } else if (userAgent.indexOf("Firefox") != -1) {
    return 'firefox';
  } else if ((userAgent.indexOf("MSIE") != -1) || (!!document.documentMode == true)) {
    return 'ie';
  } else {
    return 'unknown';
  }
};