const {ipcMain}  = require('electron')
const fs = require('fs');
const crypto = require('crypto')
const readline = require('readline');


const enKey = crypto.createCipher('aes-128-cbc', 'dupa');
const deKey = crypto.createDecipher('aes-128-cbc', 'dupa');

const encrypt = (text) => {
  let encrypted = enKey.update(text, 'utf8', 'hex')
  encrypted += enKey.final('hex');

  return encrypted
}

const decrypt = (encrypted) => {
  let text = deKey.update(encrypted, 'hex', 'utf8')
  text += deKey.final('utf8');

  return text
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

  const finalString = data.nip+';'+data.two+';'+data.four+';'+data.account+';'+data.result+';'+data.date

  fs.readFile(`${month}-${year}_WHResults.txt`, 'utf8' , (err, data) => {

    // console.log('enc',data, typeof(data))

    let dec = decrypt(data.replace(/[^\x20-\x7E]/g, ''))

    // console.log(dec)

    let d = Array.from(dec.split(','))

    d.push(finalString.toString())
    console.log(d)
    const enc = encrypt(d.toString())

    // console.log('enc', enc , typeof(enc))

    fs.writeFile(`${month}-${year}_WHResults.txt`, enc, function (err) {
      if (err) return console.log(err);
      console.log('saved')
    });


  })

  // fs.readFile(`${month}-${year}_WHResults.txt`, 'utf8' , (err, data) => {

  //   if(err) {
  //     fs.writeFile(`${month}-${year}_WHResults.txt`, '', function (err) {
  //       if (err) return console.log(err);
  //       console.log('created')

  //       let d = []

  //       d.push(finalString)
  //       console.log(d)

  //       const enc = encrypt(d.toString())

  //       fs.writeFile(`${month}-${year}_WHResults.txt`, enc, function (err) {
  //         if (err) return console.log(err);
  //         console.log('saved')
  //       });
  //     });
  //   } else {
  //     let dec = decrypt(data)

  //     // console.log(dec)

  //     let d = Array.from(dec.split(','))

  //     d.push(finalString)
  //     console.log(d)
  //     console.log('str', d.toString())

  //     const enc = encrypt(d.toString())

  //     // console.log('enc', enc , typeof(enc))

  //     fs.writeFile(`${month}-${year}_WHResults.txt`, enc, function (err) {
  //       if (err) return console.log(err);
  //       console.log('saved')
  //     });
  //   }
  // })
})


// fs.readFile('enDupa.txt', 'utf8' , (err, data) => {

//   console.log('enc',data, typeof(data))

//   let dec = decrypt(data)

//   console.log(dec)

//   let d = Array.from(dec.split(','))

//   d.push('kurde;bele')

//   const enc = encrypt(d.toString())

//   console.log('enc', enc , typeof(enc))

//   fs.writeFile('enDupa.txt', enc, function (err) {
//     if (err) return console.log(err);
//     console.log('saved')
//   });

