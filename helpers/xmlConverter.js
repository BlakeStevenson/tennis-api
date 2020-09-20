module.exports = (xmlString, stringElement = true) => {
    const decode = require('unescape');
    const parseString = require('xml2js').parseString;
    let result = {}
    parseString(xmlString, { explicitArray: false, ignoreAttrs: true, trim: true }, function (err, res) {
        let decoded;
        if (stringElement) {
            decoded = decode(res.string);
        } else {
            decoded = decode(res);
        }
        console.log(decoded);
        parseString(decoded, { explicitArray: false, ignoreAttrs: true, trim: true}, (err, res) => {
            result = res;
            console.error(err);
        });
    });
    return result;
}