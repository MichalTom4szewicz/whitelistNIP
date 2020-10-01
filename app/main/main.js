const {ipcMain}  = require('electron-better-ipc')
const fs = require('fs');
const crypto = require('crypto')
const readline = require('readline');

const os = require('os')

const computerName = os.hostname()

const encrypt = (text) => {
  const enKey = crypto.createCipher('aes-128-cbc', 'dupa');
  let encrypted = enKey.update(text, 'utf8', 'hex')
  encrypted += enKey.final('hex');

  return encrypted
}

const decrypt = (encrypted) => {
  try {
  const deKey = crypto.createDecipher('aes-128-cbc', 'dupa');
  let text = deKey.update(encrypted, 'hex', 'utf8')
  text += deKey.final('utf8');

  return text
  }catch(e) {
    ipcMain.sendToRenderers('wrong', ':)')
    return false
  }
}

const createFileWithData = (fileName, data) => {
  fs.writeFile(fileName, data, function (err) {
    if (err) return console.log(err);
    console.log('saved')
  });
}

const sendDataToDisplay = data => {
  ipcMain.sendToRenderers('data-to-display', data)
}

ipcMain.on('data', (event, arg) => {

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

  const finalString = data.nip+';'+data.two+';'+data.four+';'+data.account+';'+data.result+';'+data.date+';'+computerName

  fs.readFile(`${month}-${year}_WHResults.txt`, 'utf8' , (err, data) => {

    if(err) {
      fs.writeFile(`${month}-${year}_WHResults.txt`, '', function (err) {
        if (err) return console.log(err);

        let d = []
        d.push(finalString)
        console.log(d)
        sendDataToDisplay(d)

        const enc = encrypt(d.toString())
        createFileWithData(`${month}-${year}_WHResults.txt`, enc)
      });
    } else {
      let dec = decrypt(data)
      let d =  dec ? Array.from(dec.split(',')) : null
      if(d){
        // for(let i =0; i<10000; i++) {
          d.push(finalString)
        // }
        console.log(d)
        sendDataToDisplay(d)

        const enc = encrypt(d.toString())
        createFileWithData(`${month}-${year}_WHResults.txt`, enc)
      }

    }
  })
})
