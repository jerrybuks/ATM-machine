let inquirer = require('inquirer');
let  adminUser = require('./Admin');
let normalUser = require('./User')

console.log('Hi, welcome to General ATM');
inquirer
	.prompt([
		/* Pass your questions in here */
		{
			type: 'list',
			name: 'userType',
			message: 'Please Do you wan to use this ATM as an Admin or normal user',
			choices: [ 'User', 'Admin' ],
			filter: function(val) {
				return val.toLowerCase();
			}
		}
	])
	.then((answers) => {
		// Use user feedback for... whatever!!
		if ((answers.userType == 'user')) {
      normalUser();
		} else {
      // console.log(answers)
			adminUser();
		}
	});