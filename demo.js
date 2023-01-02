const jwt = require('jsonwebtoken');
const fs = require('fs');
var privateKey = fs.readFileSync('./key/private.pem');
var token = jwt.sign({ foo: 'bar' }, privateKey, { algorithm: 'RS256' });
console.log(token);

let cert = fs.readFileSync('./key/publickey.crt');  // get public key
let token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJmb28iOiJiYXIiLCJpYXQiOjE2NzI1ODkxNDZ9.imIX1YKlbKY_YFW3g8zjevEV1hGyITdgv9R0oStF2QJfORkepd7VU_F8nZo140R2dUiQOttWtXc5ID-QjAU6GlBmSuw8qOHoJJx6wxuwI06wIbOHejHVF1o-I5wC9Wadz-Pn7mF8bOsk8YARTDIbewNWanXlJ76crg64UnBxPaMMfSPV6iMj6zxg4uOe_3KIYkwKDhB6QM4xF_z4NRKlGjvaHsX6YaRSbKMG2mSwF_fYWH9UKwUZor1TUHqwrZoetbdO0NKPSY6BknqP7nXG6EtyIuMM0S_6e62uNId8MaWDdVlOcFGT6hhHxgQvE0HnVCQhtzHH2Yn-iRxhB-qIcQ'
jwt.verify(token, cert, function (err, decoded) {
    console.log(decoded)
});