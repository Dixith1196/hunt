const express = require('express')
const { Model } = require('mongoose')
const api = express.Router()

const bodyParser = require('body-parser');
api.use(bodyParser.json())
api.use(bodyParser.urlencoded({ extended: true }));
const TeamModel = require('../../models/team')
// const LOG = require('../../utils/logger')

// GET to this controller 

api.get('/getTeam', async (req,res)=>{
  console.log(`Handling GET / ${req}`)
   await TeamModel.find({},(err,data)=>{
        if (err) {
            return res.end('error on create')
        }
        res.locals.teams = data
        console.log(res.locals.teams, "teams are here")
        res.render('team/details', {title: 'team', res})
    })
})


// GET /delete/:id

api.post('/delete/:id', (req, res) => {
  console.log(req.params,'delete hits')
  // LOG.info(`Handling DELETE request ${req}`)
  const id = parseInt(req.params.id)
  // LOG.info(`Handling REMOVING ID=${id}`)
  TeamModel.remove({ teamid: id }).setOptions({ single: true }).exec((err, deleted) => {
    if (err) { return res.end("URL NOT found") }
    console.log(`Permanently deleted item ${JSON.stringify(deleted)}`)
    return res.redirect('/team/getTeam')
  })
})


// GET one

api.post('/edit/:teamid', (req, res) => {
  console.log(` update request ${req.body}`)
  const tId = parseInt(req.params.teamid)
  // console.log(`Handling SAVING ID:${id}`)
  TeamModel.find({ teamid: tId }, (err, results) => 
  {
    if (err) { return res.end('could not find') }
    console.log(results) 
    const tName = results[0].teamname;
      res.render('team/edit.ejs',{ tId, tName})
    })

    })
  


  // POST new

  api.post('/save',(req,res)=>{
      const body = req.body
      const team = new TeamModel(body)
      console.log(team,"body is here")
      team.save((err) => {
          if(err){
              return res.status().json({"msg": err})
            //   return res.end('ERROR: Team couldnot be saved')
          }else{
            // console.log("successful----", team)
            return res.json({
                "error": false,
                data: team
            })
          }
        
        //   LOG.info(`Saving new Team ${JSON.stringify(team1)}`)
        //   return res.redirect('/teamController')
      })
  })

// POST update with id
api.post('/update/:id', (req, res) => {
  console.log(`Handling update request ${req}`)
    const tid = parseInt(req.params.id)
    console.log(`Handling SAVING ID:${tid}`)
    TeamModel.updateOne({teamid: tid },
      { 
        // use mongoose field update operator $set
        $set: {
          teamname: req.body.teamname,
        }
      },
      (err, item) => {
        if (err) { return res.end(`Record item not found`) }
        console.log(`ORIGINAL VALUES ${JSON.stringify(item)}`)
        console.log(`UPDATED VALUES: ${JSON.stringify(req.body)}`)
        console.log(`SAVING UPDATED team ${JSON.stringify(item)}`)
        return res.redirect('/team/getTeam')
      })
  })

  // DELETE id (uses HTML5 form method POST)
api.post('/delete/:id', (req, res) => {
  console.log(`Handling DELETE request ${req}`)
    const id = parseInt(req.params.id)
    console.log(`Handling REMOVING ID=${id}`)
    TeamModel.remove({ teamid: id }).setOptions({ single: true }).exec((err, deleted) => {
      if (err) { return res.end(`Id not found`) }
      console.log(`Permanently deleted item ${JSON.stringify(deleted)}`)
      return res.redirect('/teamController')
    })
  })

module.exports = api