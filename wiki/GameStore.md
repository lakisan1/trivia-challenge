"games": [{
			"active": "Yes" ("No"),
			"gameCode": <random 6 digit alphanumeric>,
			"gameName": <name picked by creator>
			"mode": "timed", // other options "All Answered", "All with Time Limit"
			"timeLimitPerQuestion": <w>, // in seconds
			"timeLimitForGame": <z>, // in minutes
			"addedBy": Meteor.users.findOne(this.userId).username,
			"addedOn": new Date(),
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
					"allCorrectTeams": ["team-a", "team-b"],
				},
				{
					"question": "Which Apollo mission was the first one to land on the Moon?",
					"correct_answer": "Apollo 11",
					"incorrect_answers": ["Apollo 10", "Apollo 9", "Apollo 13"],
					"firstCorrectTeam": <team name>,
					"allCorrectTeams": ["team-a", "team-b"],
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
