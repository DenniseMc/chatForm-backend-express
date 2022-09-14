const isDate = ( date ) => {

    if ( !date ) {
        return false;
    };
    return !isNaN(Date.parse(date));

}

module.exports = { isDate };


