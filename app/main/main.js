const {ipcMain}  = require('electron')
const fs = require('fs');

ipcMain.on('data', (event, arg) => {
  console.log('mamaaaaaaaa data', arg)

  const date = new Date()
  // console.log('date', date)
  const year = date.getFullYear()
  let month = date.getMonth()+1
  if(month.toString().length === 1) {
    month = '0'+month.toString()
  }
  let day = date.getDate()
  if(day.toString().length === 1) {
    day = '0'+day.toString()
  }

  let data = arg
  data.date = day+'-'+month+'-'+year;

  const finalString = data.nip+' '+data.two+' '+data.four+' '+data.account+' '+data.result+' '+data.date+'\n'
  console.log('aaaaaaaaa', finalString)

  fs.appendFile('C:\Users\Michal\Desktop\gry\helloworld.txt', finalString, function (err) {
    if (err) return console.log(err);
    console.log('Hello World > helloworld.txt');
  });
})