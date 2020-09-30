const { ipcRenderer }  = require('electron')
import React, {useState, useEffect} from 'react';
import styles from './App.css'
import infoService from './services/info'

import History from './components/History'

const App = () => {

  const [response, setResponse]:any = useState({});
  const [response1, setResponse1]:any = useState({})

  const [nip, setNip] = useState('');

  const [bAcc, setBAcc] = useState('');

  const [two, setTwo] = useState('');

  const [four, setFour] = useState('');

  const [message, setMessage] = useState('');

  const [mes, setMes] = useState('');

  const [bad, setBad] = useState(false);

  const [click, setClick] = useState(false);

  const listContains =(list, two, four) => {

    console.log('list')
    for(let i=0; i<list.length; i++) {
      console.log(list[i])
      if(list[i].toString().startsWith(two.toString()) && list[i].toString().slice(22) === four.toString()) {
        console.log('dupa')
        return {odp:true, acc: list[i]}
      }
    }
    return false
  }

  const handleSubmit = (event:any) => {
    event.preventDefault()

    setResponse({})
    setResponse1({})
    setMes('')
    setNip('')
    setTwo('')
    setFour('')
    setBad(false)
    setMessage('')

    infoService
    .getByNIP(nip)
    .then(res => {
      setResponse(res.result.subject)

      const ob = res.result.subject

      let bacList= null
      if(ob.accountNumbers.length !== 0) {
        bacList = res.result.subject.accountNumbers
      } else {
        setMes(' brak rachunku')
      }

      let mes
      let object
      if(bacList !== null) {
        const wyn = listContains(bacList, two, four)
        if(typeof(wyn) === 'object') {
          setMessage('zweryfikowano poprawnie')
          mes = 'poprawnie'
          setBad(false)
          object ={
            nip: nip,
            two: two,
            four: four,
            account: bacList === null ? 'brak_NRB' :wyn.acc,
            result:  bacList === null ? 'brak_NRB' :mes
          }
        } else {
          setMessage('niezgodność podanych elementów NRB')
          mes = 'niezgodnosc'
          setBad(true)
          object ={
            nip: nip,
            two: two,
            four: four,
            account: bacList === null ? 'brak_NRB' : res.result.subject.accountNumbers[0],
            result:  bacList === null ? 'brak_NRB' :mes
          }
        }
      }

      // const object =
      ipcRenderer.send('data', object )


    })
    .catch(e => {
      // console.log(e)
      setBad(true)
      setMessage('Błędny NIP lub nie istnieje na liście')
      setTimeout(() => {
        setMessage('')
      }, 10000)
    })
  }


  const handleSubmit1 = (event:any) => {
    event.preventDefault()

    // infoService
    // .getByNIPACC(nip, bAcc)
    // .then(res => {
    //   setResponse1(res.result)
    // })
  }

  useEffect(() => {
    // ipcRenderer.send('data', ':)' )
    ipcRenderer.on('wrong', (event, arg) => {
      window.alert('Naruszona integralnośc pliku')
    })
  }, []);

  return (
    <div className={styles.cont}>
      <form >
        <h5 className={styles.con}>wpisz nip</h5>
        <input maxLength={10} placeholder="nip" value={nip} onChange={e => setNip(e.target.value)}></input>

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

      <button style={nip.length === 10 && two.length === 2 && four.length === 4 ? {display: "inline-block"} : {display: "none"}} onClick={handleSubmit}>Zweryfikuj</button>
      {/* {response.name !== undefined ? '' : <hr></hr>} */}

      <div style={response.name !== undefined ?{display: "block"} : {display: "none"}}>

        <table>
          <tbody>
          <tr>
            <td className={styles.ug}>nazwa</td>
            <td className={styles.uii}>{' ' + response.name}</td>
          </tr>
          <tr>
            <td className={styles.ug}>NIP</td>
            <td className={styles.uii}>{' ' + response.nip}</td>
          </tr>
          <tr>
            <td className={styles.ug}>status VAT</td>
            <td className={styles.uii}>{' ' + response.statusVat}</td>
          </tr>

          <tr>
            <td className={styles.ug}>regon</td>
            <td className={styles.uii}>{' ' + response.regon}</td>
          </tr>

          <tr >
            <td className={styles.ug}>numery rachunków</td>
            <td className={styles.uii}>{mes}</td>
          </tr>
          </tbody>
        </table>

        <ul>
          {response.accountNumbers !== undefined ? response.accountNumbers.map((an:any, i:any) => {
            return (
              <li className={styles.item} key={i}>{an}</li>
            )
          }) : ''}
        </ul>

      </div>

      <div style={response1.accountAssigned !== undefined ?{display: "block"} : {display: "none"}} >
        <p>fdsf:{' ' + response1.accountAssigned}</p>

      </div>

      <hr></hr>
      <h1 style={bad ? {color: "red"}: {color: "lightgreen"}}>{message}</h1>

      <button onClick={() => setClick(c => !c)}>{click ? 'Ukryj plik' : 'Pokaz plik'}</button>

      {/* <h2>9151806303</h2>
      <h2>9130004136</h2>

      <h2>8650003177</h2>

      <h2>23105015751000009248349095</h2> */}


      <div className={styles.his} style={click ? {display: "block"} : {display: "none"}} >
        <History />
      </div>


    </div>
  )
}

export default App

