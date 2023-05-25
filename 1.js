const { highlight } = require('sql-highlight')

const sqlString = "SELECT `id`, `username` FROM `users` WHERE `email` = 'test@example.com'"

const highlighted = highlight(sqlString)

console.log(highlighted)