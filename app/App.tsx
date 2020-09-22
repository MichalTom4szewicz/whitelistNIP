const { ipcRenderer }  = require('electron')
import React, {useState, useEffect} from 'react';


import styles from './App.css'

import infoService from './services/info'
const App = () => {

  const [response, setResponse]:any = useState({});
  const [response1, setResponse1]:any = useState({})

  const [nip, setNip] = useState('');

  const [bAcc, setBAcc] = useState('');

  const [two, setTwo] = useState('');

  const [four, setFour] = useState('');

  const [message, setMessage] = useState('');

  const handleSubmit = (event:any) => {
    event.preventDefault()

    infoService
    .getByNIP(nip)
    .then(res => {
      setResponse(res.result.subject)

      try {
        setBAcc(res.result.subject.accountNumbers[0])

        const bac = res.result.subject.accountNumbers[0].toString()

        console.log('aaaaa', res.result.subject.requestDateTime)

        infoService
        .getByNIPACC(nip, res.result.subject.accountNumbers[0])
        .then(res => {
          setResponse1(res.result)
        })

        let mes
        if(bac.startsWith(two.toString()) && bac.slice(22) === four.toString()) {
          setMessage('zweryfikowano poprawnie')
          mes = 'poprawnie'
        } else {
          setMessage('niezgodność podanych elementów NRB z otrzymanym zapytaniem z whitelist')
          mes = 'niezgodnosc'
        }
        const object = {
          nip: nip,
          two: two,
          four: four,
          account: res.result.subject.accountNumbers[0],
          result: mes
        }
        ipcRenderer.send('data', object )

      } catch (e) {
        console.log('no accounts')
      }
    })
  }


  const handleSubmit1 = (event:any) => {
    event.preventDefault()

    infoService
    .getByNIPACC(nip, bAcc)
    .then(res => {
      setResponse1(res.result)
    })
  }

  useEffect(() => {
    // ipcRenderer.send('data', ':)' )
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h5 className={styles.con}>wpisz nip</h5>
        <input maxLength={10} placeholder="nip" value={nip} onChange={e => setNip(e.target.value)}></input>

        <button style={nip.length === 10 && two.length === 2 && four.length === 4 ? {display: "inline-block"} : {display: "none"}} type="submit">get record</button>
      </form>

      <form onSubmit={handleSubmit1}>
        <h5 className={styles.con}>wpisz: liczba kontrolna NRB</h5>
        <div className={styles.con}>
          <input className={styles.qw}  maxLength={2} placeholder="xx" value={two} onChange={e => setTwo(e.target.value)}></input>
          <h5 className={styles.qw}>4 ostatnie cyfry NRB</h5>
          <input className={styles.qw} maxLength={4} placeholder="xxxx" value={four} onChange={e => setFour(e.target.value)}></input>
        </div>


        {/* <button style={nip.length === 10 && bAcc.length === 26 ? {display: "inline-block"} : {display: "none"}} type="submit">get response</button> */}
      </form>

      <div style={response.name !== undefined ?{display: "block"} : {display: "none"}}>
        <p>nazwa:{' ' + response.name}</p>
        <p>nip:{' ' + response.nip}</p>
        <p>status vat:{' ' + response.statusVat}</p>
        <p>regon:{' ' + response.regon}</p>
        <p>accounts:</p>
        {response.accountNumbers !== undefined ? response.accountNumbers.map((an:any, i:any) => {
          return (
            <p key={i}>{'   *'+an}</p>
          )
        }) : ''}
      </div>

      <div style={response1.accountAssigned !== undefined ?{display: "block"} : {display: "none"}} >
        <p>odp:{' ' + response1.accountAssigned}</p>

      </div>

      <h1>{message}</h1>

      <h2>9151806303</h2>

      <h2>23105015751000009248349095</h2>

      {/* <h1>{bAcc}</h1> */}
    </div>
  )
}

export default App

