export function getBirthdayFromCard(idCard) {
  var birthday = ''
  if (idCard !== null && idCard !== '') {
    if (idCard.length === 15) {
      birthday = '19' + idCard.substr(6, 6)
    } else if (idCard.length === 18) {
      birthday = idCard.substr(6, 8)
    }
    birthday = birthday.replace(/(.{4})(.{2})/, '$1-$2-')
  }
  return birthday
}

export function getSexFromCard(idCard) {
  var sex = ''
  var num = ''
  if (idCard !== null && idCard !== '') {
    if (idCard.length === 15) {
      num = parseInt(idCard.charAt(14))
    } else if (idCard.length === 18) {
      num = parseInt(idCard.charAt(16))
    }

    if (num % 2 === 0) {
      sex = 0
    } else {
      sex = 1
    }
  }
  return sex
}
