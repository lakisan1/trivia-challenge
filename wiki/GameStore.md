"games": [{
			"active": true (false),
			"gameId": <random 6 digit alphanumeric>,
			"mode": "timed", // other options "All Answered", "All with Time Limit"
			"timeLimitPerQuestion": <w>, // in seconds
			"timeLimitForGame": <z>, // in minutes
			"startDate": new Date(),
			"numberOfQuestions": <y>, // max 50
			"categories": ["Animals", "family", "science" ],
			"type": "trueFalse", // other options "multChoice" or "mixed",
			"difficulty": "easy", other options "medium" or "hard",
			"dateCompleted": new Date(),
			"winningTeam": <team Name>,
			"qAndAs": [
				{
					"question": "The Axolotl is an amphibian that can spend its whole life in a larval state.",
					"correct_answer": "True",
					"incorrect_answers": ["False"],
					"firstCorrectTeam": <team name>,
				},
				{
					"question": "Which Apollo mission was the first one to land on the Moon?",
					"correct_answer": "Apollo 11",
					"incorrect_answers": ["Apollo 10", "Apollo 9", "Apollo 13"],
					"firstCorrectTeam": <team name>,
				},
			],
			"players": [
			{
				"name": "meAndI",
				"points": <count>,
				"questionsCorrect": <count>
			},{
				"name": "themFolks",
				"points": <count>,
				"questionsCorrect": <count>
			},{
				"name": "Blue",
				"points": <count>,
				"questionsCorrect": <count>
			},{
				"name": "Yeppers",
				"points": <count>,
				"questionsCorrect": <count>
			},{
				"name": "Aaron",
				"points": <count>,
				"questionsCorrect": <count>
			},
		},
	]
