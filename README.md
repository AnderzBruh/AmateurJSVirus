This virus works by luring in someone with a tic tac toe game with an algorithm made by me built in a google sheet.

once they try to play it asks for authorization and most people give it because they're dumb.

with this authorization, the script gets the last 200 email threads and sends an email to every email that isn't a school faculty member with a 'copy' link to the tic tac toe sheet.

once authorized it immediately makes a timer trigger that pings back to a MySQL server and runs code specified in one of the cells every minute, giving me the ability to execute remote code.

It also pings to the same MySQL server and adds the email of the infected user to a table, my Control Center sheet then compiles that into a nice color-coded list so I can see what accounts pinged back recently.

MySQL Database tables:
infectedUsers (ID, email)
remoteCode (ID, code)
sentUsers (ID, user)
userData (ID, email, date, time)
