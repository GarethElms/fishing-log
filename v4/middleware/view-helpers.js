function zeroPad(value, length) {
    if(!length) length=2;
    value = "0" + value;
    return value.substring(value.length - length);
};
function formatDate(date) {
  if(!date) date = new Date();
  return zeroPad(date.getDate()) + "/" + zeroPad(date.getMonth() + 1) + "/" + date.getFullYear() + " "
       + zeroPad(date.getHours()) + ":" + zeroPad(date.getMinutes()) + ":" + zeroPad(date.getSeconds());
};
module.exports = function(req, res, next) {
  res.locals.title = "";
  res.locals.getTitle =
    function() {
      if(this.title) return "- " + this.title;
      return "";
    };
  res.locals.today = function() {
    return formatDate();
  };
  next();
};