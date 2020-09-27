const {ipcMain}  = require('electron')
const fs = require('fs');

ipcMain.on('data', (event, arg) => {
  console.log('mamaaaaaaaa data', arg)

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

  fs.appendFile(`${month}-${year}_WHResults.txt`, finalString, function (err) {
    if (err) return console.log(err);
  });
})