
//all of this is to visualize the data in the MySQL database more easily in a google spreadsheet.

var yep = 'putAdressHere'
var mHmm = 'putUserHere'
var bruh = 'putUsernameHere'
var trueing = 'putPasswordHere'
var yes = 'putPortHere'
var cool = 'jdbc:mysql://' + yep + ':' + yes + '/' + mHmm
var conn = Jdbc.getConnection(cool, bruh, trueing)
var stmt = conn.createStatement()





stmt.setMaxRows(1000);

function setup() {

  ScriptApp.newTrigger('refreshData')

    .timeBased()
    .everyMinutes(1)
    .create();

}


function refreshData() {

  if (ScriptProperties.getProperty('calculating') == 'no') {
    ScriptProperties.setProperty('attemptfailures', 0)
    ScriptProperties.setProperty('calculating', 'yes')
    Utilities.sleep(Math.random() * 5000)


    var results = stmt.executeQuery('SELECT * FROM `userData`')
    var rowsNum = 0
    while (results.next()) {
      rowsNum++
    }

    var results = stmt.executeQuery('SELECT * FROM `userData`')
    for (var i = 1; i <= rowsNum; i++) {
      results.next()
    }

    console.log('MySQL Database has ' + rowsNum + ' rows')

    while (rowsNum > 0) {

      console.log('found email: ' + results.getString(2))

      var infectedSingleString = []

      for (var i = 2; i <= 4; i++) {
        infectedSingleString.push(results.getString(i))
      }

      var results = stmt.executeQuery('SELECT * FROM `userData`')
      var rowsNum = 0
      var idsToDelete = []
      while (results.next()) {
        if (results.getString(2) == infectedSingleString[0]) {
          idsToDelete.push(results.getString(1))
        } else {
          rowsNum++
        }
      }

      console.log(idsToDelete)

      for (var i = 0; i < idsToDelete.length; i++) {
        console.log('deleted email#  ' + idsToDelete[i])
        stmt.execute('DELETE FROM `userData` WHERE `ID` = ' + idsToDelete[i] + ';')
      }


      var results = stmt.executeQuery('SELECT * FROM `userData`')
      for (var i = 1; i <= rowsNum; i++) {
        results.next()
      }


      for (var i = 8; i <= controlCenter.getLastRow(); i++) {
        if (controlCenter.getRange('A' + i).getValue() == infectedSingleString[0]) {
          controlCenter.deleteRow(i)
        }
      }
      controlCenter.appendRow(infectedSingleString)

    }

    var results = stmt.executeQuery('SELECT * FROM `infectedUsers`')
    var infectedInDB = []
    while (results.next()) {
      infectedInDB.push(results.getString(2))
    }

    console.log('refreshing colors')
    var activeCount = 0
    var infectedUsers = []

    for (var i = 8; i <= controlCenter.getLastRow(); i++) {
      if (new Date().getTime() - controlCenter.getRange('c' + i).getValue() <= 120000) {
        controlCenter.getRange('a' + i + ':C' + i).setBackground('#9ce480')
        var activeCount = activeCount + 1
      } else {
        controlCenter.getRange('a' + i + ':C' + i).setBackground('#ee6d6d')
      }

      if (infectedInDB.includes(controlCenter.getRange('a' + i).getValue()) == false) {
        infectedUsers.push(controlCenter.getRange('a' + i).getValue())
      }

    }




    for (var i = 0; i < infectedUsers.length; i++) {

      var results = stmt.executeQuery('SELECT * FROM `infectedUsers`')
      var lastRowID = 0
      while (results.next()) {
        var lastRowID = parseInt(results.getString(1)) + 1
      }
      stmt.execute('INSERT INTO infectedUsers(ID, email) values("' + lastRowID + '", "' + infectedUsers[i] + '")')
      console.log('new infected: ' + infectedUsers[i])

    }

    controlCenter.getRange('A5').setValue(activeCount)
    controlCenter.getRange('B5').setValue(controlCenter.getLastRow() - 7)
    controlCenter.getRange('C5').setValue(new Date().toLocaleString())

    var results = stmt.executeQuery('SELECT * FROM `remoteCode`')
    results.next()
    controlCenter.getRange('A2').setValue(results.getString(2))

    results.close();
    conn.close()



    ScriptProperties.setProperty('calculating', 'no')
  } else if (parseInt(ScriptProperties.getProperty('attemptfailures')) >= 5) {

    resetAfterIssue()
    console.log('resetting')

  } else {

    ScriptProperties.setProperty('attemptfailures', parseInt(ScriptProperties.getProperty('attemptfailures')) + 1)
    console.log('Failed # ' + ScriptProperties.getProperty('attemptfailures'))

  }

}






function resetAfterIssue() {
  ScriptProperties.setProperty('calculating', 'no')
  console.log('if currently running set to no')
}



function test() {

}
