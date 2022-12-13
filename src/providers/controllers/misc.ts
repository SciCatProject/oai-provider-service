export const parseParams = (limits: string) => {
    let params = null;
    if (limits) {
      // decode limits string and convert to JSON
      const parts = decodeURIComponent(limits)
        .replace(/[()]/g, "")
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"');
      let partsArr = parts.split(",");
      partsArr.forEach(function (part, index) {
        this[index] = '"' + this[index].replace(/[:]/g, ":") + '"';
      }, partsArr);
  
      params = JSON.parse("{" + partsArr.join(",") + "}");
    }
    return params;
}
