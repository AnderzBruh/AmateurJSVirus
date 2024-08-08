This virus works by luring in someone with a tic tac toe game with an algorithm made by me built in a google sheet.

Once they try to play it asks for authorization and most people give it because they dont pay it too much attention.

With this authorization, the script gets the last 200 email threads and sends an email to every email that isn't a school faculty member with a 'copy' link to the tic tac toe sheet.

Once authorized it immediately makes a timer trigger that pings back to a MySQL server and runs code via eval() specified in one of the cells every minute, giving me the ability to execute remote code, effectively giving me complete control over their entire Gmail and Google Drive.

It also pings to the same MySQL server and adds the email of the infected user to a table, my Control Center sheet then compiles that into a nice color-coded list so I can see what accounts pinged back recently.

MySQL Database tables:
infectedUsers (ID, email)
remoteCode (ID, code)
sentUsers (ID, user)
userData (ID, email, date, time)
