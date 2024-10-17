import moment from "moment"

const DateFormate = (date) => {
    return moment(date).format("H:mm a, MM Do YY");
}

export { DateFormate };