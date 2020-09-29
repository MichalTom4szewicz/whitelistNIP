
import React from 'react';
import { useState, useEffect } from 'react';


const {ipcRenderer} = require('electron-better-ipc')

export default function History(): JSX.Element {

  const [dataArray, setData] = useState([]);


  useEffect(() => {

    ipcRenderer.on('data-to-display', (event, data) => {
      setData(data)
    })

    return(() => {

    })
  }, []);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>L.P.</th>
            <th>NIP</th>
            <th>DWIE</th>
            <th>CZTERY</th>
            <th>RACHUNEK</th>
            <th>STATUS</th>
            <th>DATA</th>
          </tr>
        </thead>

        <tbody>
          {dataArray.map((item, index) => {
            const arr = item.split(';')
            return(
              <tr key={index}>
                <td>{index}</td>
                {arr.map((it, i) => {
                  return(
                    <td key={i}>{it}</td>
                  )
                })}
              </tr>
            )
          })
          }
        </tbody>
      </table>
    </div>
  );
}
