# Formatting Open Trivia DB to Trivia-Challege

Formatting data from https://opentdb.com/ so that it works in Trivia-Challege.

## Documentation

First, I am a noob and it's likely there's a better solution, but I did it this way:

After getting the questions they are going to be in sets of 50, you can put them all in one json file for convenience. (Make sure you use a token so you don't get duplicate questions).

--------------------------------------------------

"category"

In Trivia-Challege go to Add Category and create:

Entertainment: Film

Science: Computers

General Knowledge

Entertainment: Video Games

Entertainment: Music

History

Geography

Entertainment: Japanese Anime & Manga

Science: Mathematics

Entertainment: Books

Entertainment: Television

Vehicles

Animals

Art

Sports

Entertainment: Cartoon & Animations

Politics

Entertainment: Musicals & Theatres

Entertainment: Board Games

Mythology

Science: Nature

Celebrities

Entertainment: Comics

Science: Gadgets

The Category Description: is not important.

--------------------------------------------------

"type"

Using Notepad ++ open the .json file and pres ctrl+H and fo to Replace.

Step1: In the Find what paste: "type":"multiple" and in the Replace with paste "type":"multipleChoice" and click Replace All

Step2: In the Find what paste: "type":"boolean" and in the Replace with paste "type":"trueFalse" and click Replace All

--------------------------------------------------

"owner"

The "owner" value must be added.

In the Find what paste: "question": and in the Replace with paste "owner":"all","question": and click Replace All

--------------------------------------------------
 
"addedBy" and "timesUsedInAGame":0

Step1: In the Find what paste: ]} and in the Replace with paste ],"addedBy": "YOUR USERNAME","timesUsedInAGame":0}: and click Replace All

Step2: Go to the end of the file and delete an extra ,"addedBy": "YOUR USERNAME","timesUsedInAGame":0} if it is present

###{"response_code":0,"results":

Depending on how you got the questions you might have {"response_code":0,"results": on the begining of a bach of questions.

In the Find what paste: {"response_code":0,"results": and in the Replace with do nothing so it gets deleted and click Replace All

--------------------------------------------------



--------------------------------------------------

"_id":

Now the complicated part, the "_id": needs to string.ascii_lowercase lenght of 16.

Step1: In the Find what paste: "category": and in the Replace with paste "_id": "willBeReplaced","category": and click Replace All

Step2: Make a script to replace willBeReplaced with a random string or find a program that can do that. If there's a demand I will upload or link the script i used (ask in coment or bugs ). I can't do it now because i currently can't find it and would have to make it.

--------------------------------------------------



