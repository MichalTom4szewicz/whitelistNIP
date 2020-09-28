const {ipcMain}  = require('electron')
const fs = require('fs');
const crypto = require('crypto')
const readline = require('readline');

const processLineByLine = async (path) => {
  const fileStream = fs.createReadStream(path);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let linesArray = []
  for await (const line of rl) {
    // console.log(line)
    // linesArray.push(line)

    const decryptedLine = decrypt(line)
    linesArray.push(decryptedLine)
    console.log(`Line from file: ${decryptedLine}`);
  }

  return linesArray
}

const enKey = crypto.createCipher('aes-128-cbc', 'dupa');
const deKey = crypto.createDecipher('aes-128-cbc', 'dupa');

const encrypt = (data) => {
  let mystr = enKey.update(data, 'utf8', 'hex')
  mystr += enKey.final('hex');

  return mystr
}

const decrypt = (data) => {
  let str = deKey.update(data, 'hex', 'utf8')
  str += deKey.final('utf8');

  return str
}


const appendToFile = (path, data) => {
  // console.log('start appending')
  let lines = Array.from(processLineByLine(path))
  lines.push(data)
  console.log('tablica', lines)

  const encryptedData = encrypt(Buffer.from(lines))

  fs.writeFile(path, Buffer.from(lines), function (err) {
    if (err) return console.log(err);
  });

  // console.log(lines)
}


ipcMain.on('data', (event, arg) => {
  // console.log('mamaaaaaaaa data', arg)

  const date = new Date()
  const year = date.getFullYear()

  let month = date.getMonth()+1
  if(month.toString().length === 1) {
    month = '0'+month.toString()
  }
  let day = date.getDate()
  if(day.toString().length === 1) {
    day = '0'+day.toString()
  }

  let hour = date.getHours()
  let minutes = date.getMinutes()
  if(minutes.toString().length === 1) {
    minutes = '0'+minutes.toString()
  }

  let data = arg
  data.date = day+'-'+month+'-'+year+' '+hour+':'+minutes;

  const finalString = data.nip+','+data.two+','+data.four+','+data.account+','+data.result+','+data.date+'\n'

  appendToFile(`${month}-${year}_WHResults.txt`, finalString )

})