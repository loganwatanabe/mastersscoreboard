import React, {useState, useEffect} from 'react';
import './App.css';
import {mastersAPI} from './apis/mastersapi'
import {CircularProgress, Grid, Tabs, Tab} from '@material-ui/core';
import {DataGrid} from '@material-ui/data-grid'

import firebase from './firebase/index';



function App() {

  const Analytics = firebase.analytics


  const [loading, setLoading] = useState(true);
  const [players, setPlayers] = useState([]);
  const [tab, setTab] = useState(0);
  const [totals, setTotals] = useState([]);

  const pars = [4,5,4,3,4,3,4,5,4,4,4,3,5,4,5,3,4,4]

  const totalPar = 72;

  const handleChange = (event, newValue) => {
    setTab(newValue);
    console.log(players)
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  // Note: the empty deps array [] means
  // this useEffect will run once
  // similar to componentDidMount()
  useEffect(() => {
    mastersAPI((x)=>{
      Analytics.logEvent('visitor!');
      //were gonna do all the data formatting here cuz its too fucking hard with the data grid
      if(x.data){
        //player, total, round totals
        let totes = [Array(18).fill(0),Array(18).fill(0),Array(18).fill(0),Array(18).fill(0)]
        setPlayers(x.data.player.map((p)=>{
          totes.forEach((r,rindex)=>{
            r.forEach((h,hindex)=>{
              let score =  parseInt(getHoleScoreInt(p,rindex+1,hindex+1))
              if(isNaN(score)){
                score = 0
              }
              totes[rindex][hindex] += score
            })
          })
          return p
        }))

        

        setTotals(totes)
        setLoading(false)
      }else{
        console.log("no data")
      }
    })
    }, [])


  const columnCalc = (index) => {

    switch(index){
      case 1:
      case 2:
      case 3:
      case 4:
        return(default_columns.concat(round_columns(tab)));
      default:
        return(default_columns.concat(player_columns));

    }
  }

  function getFullName(params: ValueGetterParams) {
    return `${params.getValue('first_name') || ''} ${
      params.getValue('last_name') || ''
    }`;
  }


  const default_columns = [
    {
      field: 'name',
      headerName: 'Player',
      width: 160,
      valueGetter: getFullName,
    }
  ]

  const player_columns = [
    {
      field: 'total',
      headerName: 'Total Score',
      width: 160,
      // valueGetter: firstRound,
    },
    {
      field: 'topar',
      headerName: 'Total To Par',
      width: 160,
      // valueGetter: firstRound,
    },
    {
      field: "round1.total",
      headerName: 'R1 (72)',
      width: 160,
      valueGetter: (params) => {return getTotalScore(params.data,1)},
    },
    {
      field: "round2.total",
      headerName: 'R2 (72)',
      width: 160,
      valueGetter: (params) => {return getTotalScore(params.data,2)},
    },
    {
      field: "round3.total",
      headerName: 'R3 (72)',
      width: 160,
      valueGetter: (params) => {return getTotalScore(params.data,3)},
    },
    {
      field: "round4.total",
      headerName: 'R4 (72)',
      width: 160,
      valueGetter: (params) => {return getTotalScore(params.data,4)},
    }
  ]

  const getTotalScore = (playa, round)=>{
    if(!playa){return 0}
    let player = playa
    switch(round){
      case 1:
        let strokes1 = parseInt(player.round1.total)
        if(!strokes1){return("")}
        let score1 = strokes1 - totalPar
        let scoreString1 = score1 > 0 ? "+".concat(score1) : score1.toString()
        return(scoreString1.concat(" (",strokes1,")"))
      case 2:
        let strokes2 = parseInt(player.round2.total)
        if(!strokes2){return("")}
        let score2 = strokes2 - totalPar
        let scoreString2 = score2 > 0 ? "+".concat(score2) : score2.toString()
        return(scoreString2.concat(" (",strokes2,")"))
      case 3:
        let strokes3 = parseInt(player.round3.total)
        if(!strokes3){return("")}
        let score3 = strokes3 - totalPar
        let scoreString3 = score3 > 0 ? "+".concat(score3) : score3.toString()
        return(scoreString3.concat(" (",strokes3,")"))
      case 4:
        let strokes4 = parseInt(player.round4.total)
        if(!strokes4){return("")}
        let score4 = strokes4 - totalPar
        let scoreString4 = score4 > 0 ? "+".concat(score4) : score4.toString()
        return(scoreString4.concat(" (",strokes4,")"))
      default:
        return 0;
    }
  }

  const getHoleScore = (playa, round, hole)=>{
    let player = playa
    switch(round){
      case 1:
        let strokes1 = parseInt(player.round1.scores[hole-1])
        if(!strokes1){return("")}
        let score1 = strokes1 - pars[hole-1]
        let scoreString1 = score1 > 0 ? "+".concat(score1) : score1.toString()
        return(scoreString1.concat(" (",strokes1,")"))
      case 2:
        let strokes2 = parseInt(player.round2.scores[hole-1])
        if(!strokes2){return("")}
        let score2 = strokes2 - pars[hole-1]
        let scoreString2 = score2 > 0 ? "+".concat(score2) : score2.toString()
        return(scoreString2.concat(" (",strokes2,")"))
      case 3:
        let strokes3 = parseInt(player.round3.scores[hole-1])
        if(!strokes3){return("")}
        let score3 = strokes3 - pars[hole-1]
        let scoreString3 = score3 > 0 ? "+".concat(score3) : score3.toString()
        return(scoreString3.concat(" (",strokes3,")"))
      case 4:
        let strokes4 = parseInt(player.round4.scores[hole-1])
        if(!strokes4){return("")}
        let score4 = strokes4 - pars[hole-1]
        let scoreString4 = score4 > 0 ? "+".concat(score4) : score4.toString()
        return(scoreString4.concat(" (",strokes4,")"))
      default:
        return 0;
    }
  }

  const formatScore = (num) =>{
    if(num>0){
      let plus = "+"
      return plus.concat(num)
    }else{
      return(num)
    }
  }

  const getHoleScoreInt = (playa, round, hole)=>{
    let player = playa
    switch(round){
      case 1:
        let strokes1 = parseInt(player.round1.scores[hole-1])
        if(!strokes1){return("")}
        let score1 = strokes1 - pars[hole-1]
        return(score1 ?? 0)
      case 2:
        let strokes2 = parseInt(player.round2.scores[hole-1])
        if(!strokes2){return("")}
        let score2 = strokes2 - pars[hole-1]
        return score2 ?? 0
      case 3:
        let strokes3 = parseInt(player.round3.scores[hole-1])
        if(!strokes3){return("")}
        let score3 = strokes3 - pars[hole-1]
        return score3 ?? 0
      case 4:
        let strokes4 = parseInt(player.round4.scores[hole-1])
        if(!strokes4){return("")}
        let score4 = strokes4 - pars[hole-1]
        return score4 ?? 0
      default:
        return 0;
    }
  }

  const round_columns = (round) => {
    return pars.map((p, index)=>{
      let field = index.toString()
      let header = (index+1).toString().concat(" (",p,") ")
      return(
      {
        field: field,
        headerName: header,
        renderHeader: (params: ColParams) => {
          let score = totals[round-1][index]
          return(
          <React.Fragment>
          {header} 
          <span style={score<0 ? {color: 'red'} : score===0 ? {color: 'blue'} : {color: 'black'}}>{formatScore(score)}</span>
          </React.Fragment>
          )
        },
        width: 120,
        valueGetter: (params) => {return getHoleScore(params.data, round, index+1)},
        cellClassName: (params: CellClassParams) => {
          let score = getHoleScoreInt(params.data, round, index+1)
          if(score < 0){
            return('red')
          }else if(score > 0){
            return('black')
          }else{
            return('blue')
          }
        },
      }
      )
    })
  }


  return (
    <div style={{height: "100%"}}>
    <Grid container spacing={0} >
        <Grid item xs={12} style={{textAlign: "center"}}>
          <h1>MASTERS SCORE BOARD*</h1>
          <p>* data is pulled from <a href="https://www.masters.com/en_US/scores/index.html">the Masters site.</a></p>
          <p>i cobbled this together in a night, so save your complaints. positive vibes only, BOL</p>
        </Grid>
        <Grid item xs={12}>
        {loading ? <CircularProgress /> : <Tabs
            value={tab}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="Players" {...a11yProps(0)} tabIndex="1"/>
            <Tab label="Round 1" {...a11yProps(1)} tabIndex="1"/>
            <Tab label="Round 2" {...a11yProps(2)} tabIndex="2"/>
            <Tab label="Round 3" {...a11yProps(3)} tabIndex="3"/>
            <Tab label="Round 4" {...a11yProps(4)} tabIndex="4"/>
          </Tabs>
        }
        </Grid>
        <Grid item xs={12} style={{textAlign: "center", height: "90%"}}>
            <DataGrid rows={players} columns={columnCalc(tab)} pageSize={100} hideFooter autoHeight/>

        </Grid>
    </Grid>
    </div>
  );
}

export default App;
