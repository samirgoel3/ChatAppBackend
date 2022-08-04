const date = require('date-and-time');

const convertMongoDbTimestampToDate = (timestamp) =>{
    return date.parse(timestamp, 'YYYY/MM/DD HH:mm:ss');
}

export default {convertMongoDbTimestampToDate}