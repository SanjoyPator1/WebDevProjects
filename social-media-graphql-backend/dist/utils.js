import { format } from "date-fns";
const formatDate = (stamp, givenFormat) => format(stamp, givenFormat);
module.exports = { formatDate };
