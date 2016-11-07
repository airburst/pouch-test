export const hexEncode = (text) => {
    return text.split('').map(letter => {
        return letter.charCodeAt(0).toString(16)
    }).join('')
}

export const hexDecode = (code) => {
    return code.match(/(..?)/g).map(char => {
        return String.fromCharCode(parseInt(char, 16))
    }).join('')
}

// es5 versions for testing
// var hexEncode = function(text) {
//     return text.split('').map(function(letter) {
//         return letter.charCodeAt(0).toString(16)
//     }).join('')
// }

// var hexDecode = function(code) {
//     return code.match(/(..?)/g).map(function(char) {
//         return String.fromCharCode(parseInt(char, 16))
//     }).join('')
// }