# my notes for this project

## Randomizing the questions pulled.

1. I need to first pull the collection available based on the selections the user makes for the type, difficulty, and category.
2. Next I need to get a count of those question documents that match the criteria.
3. Now, on the next screen break that number of records into 10 possible options in a drop down ist.
    a. Basically take the count divide by 10, and set the nearest whole number as the step value between options up to or less than the count value itself.
4. Now the user can only choose a 'random' number of the available matching records.
5. Create an array of the myindex values and using a random number generator, loop through the array the chosen number of times.
    a. When a random number is generated, select that myIndex as a question, then remove it from the array.
    b. Now that you've removed the value from the array, you won't duplicate it by accident.
    c. You have to reset the random number max each time through the loop to the new length of the array, or you may end up selecting an index that is now out of range at the max end.
    
Now, you should be able to get your full list of questions without re-running the question generator so many times.
