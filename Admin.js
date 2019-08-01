let inquirer = require('inquirer');
let fs = require('fs');

function adminUserFunc() {
	inquirer
		.prompt([
			/* Pass your questions in here */
			{
				type: 'input',
				name: 'name',
				message: 'Please Input your name',
				filter: String
			},
			{
				type: 'password',
				name: 'login',
				message: 'Please Input your admin id',
				mask: true
			}
		])
		.then((adminUser) => {
			const admin = new Admin(adminUser.name);
			admin.chooseATMOperation();
		});
}

class Admin {
	constructor(name) {
		this.name = name;
		this.adminDeposit = 0;
		this.candispenseCash = true;
	}
	chooseATMOperation() {
        // console.clear()
        console.log(
            '\x1b[31m',
            `NB: please make sure that you exit application through the exit button in the application (don't use ctrl c), so as for your changes to be saved`
        );
		inquirer
			.prompt([
				/* Pass your questions in here */
				{
					type: 'list',
					name: 'reply',
					message: 'Hello ' + this.name + ',' + ' please select the kind of Operation you want to perform',
					choices: [
						'Add Money to ATM',
						'Remove Money from ATM',
						'Check ATM balance',
						'Disable/Enable ATM',
						'Exit'
					]
				}
			])
			.then((answer) => {
				if (answer.reply === 'Add Money to ATM') {
					this.addMoneyToATM();
				} else if (answer.reply === 'Remove Money from ATM') {
					this.RemoveMoneyFromATM();
				} else if (answer.reply === 'Check ATM balance') {
					this.checkATMBalance();
				} else if (answer.reply === 'Disable/Enable ATM') {
					this.disableOrEnableMachine();
				} else {
					this.exit();
				}
			});
	}
	addMoneyToATM() {
		console.clear();
		inquirer
			.prompt([
				{
					type: 'input',
					name: 'amount',
					message: 'Please Input amount, maximum of 1 million naira (#)',
					validate: function(value) {
						if (value > 0 && value <= 1000000) {
							console.log('\n');
							console.log('Amount was succesfully added to the ATM');
							return true;
						} else {
							return 'Please Input a valid amount, maximum of 1 million naira';
						}
					}
				},
				{
					type: 'confirm',
					name: 'moreMoney',
					message: 'Would you like to? add more MOney to ATM'
				}
			])
			.then((answer) => {
				answer.amount = Number(answer.amount);
				this.adminDeposit += answer.amount;
				if (answer.moreMoney == true) {
					this.addMoneyToATM();
				} else {
					this.chooseATMOperation();
				}
			});
	}
    RemoveMoneyFromATM() {
        console.clear();
        if(this.adminDeposit > 0) {
        let atmBalance = this.adminDeposit;
		inquirer
			.prompt([
				{
					type: 'input',
					name: 'amount',
					message: 'Please Input amount you would like to remove from machine (#)',
					validate: function(value) {
						if (value > 0 && value <= atmBalance) {
							console.log('\n');
							console.log('Amount was succesfully removed from the ATM');
							return true;
						} else {
							return `Please Input a valid amount, amount must be less than total money in atm, which is currently ${atmBalance} naira`;
						}
					}
				},
				{
					type: 'confirm',
					name: 'removeMoney',
					message: 'Would you like to? remove more Money from ATM'
				}
			])
			.then((answer) => {
				answer.amount = Number(answer.amount);
				this.adminDeposit -= answer.amount;
				if (answer.removeMoney == true) {
					this.RemoveMoneyFromATM();
				} else {
					this.chooseATMOperation();
				}
            });
        } else {
            console.log(`There is currently no money in this ATM, please add money before trying to remove`);
            this.chooseATMOperation();
        }
	}
	checkATMBalance() {
		console.clear();
		console.log(`The total amount in this ATM is ${this.adminDeposit} naira`);
		inquirer
			.prompt([
				/* Pass your questions in here */
				{
					type: 'list',
					name: 'step',
					choices: [ 'Go back', 'exit' ],
					filter: String
				}
			])
			.then((answer) => {
				if (answer.step === 'Go back') {
					this.chooseATMOperation();
				} else {
					this.exit();
				}
			});
	}
	disableOrEnableMachine() {
		console.clear();
		inquirer
			.prompt([
				/* Pass your questions in here */
				{
					type: 'list',
					name: 'decide',
					message: 'Would uou like to disable or Enable machine?',
					choices: [ 'Disable', 'Enable' ],
					filter: String
				}
			])
			.then((answer) => {
				if (answer.decide === 'Disable') {
					this.candispenseCash = false;
					console.log(
						'\x1b[35m',
						`This ATM has been Succesfully Disabled, Users will not be able to use this machine, until you Enable`
					);
				} else {
					this.candispenseCash = true;
					console.log('\x1b[35m', `This ATM has been Succesfully Enabled`);
				}
				this.chooseATMOperation();
			});
	}
	exit() {
		let obj = { amountInATM: this.adminDeposit, atmCanDispense: this.candispenseCash };
		let data = JSON.stringify(obj);
        fs.writeFileSync('./ATM.json', data, 'utf-8', { flags: 'w+' });
        console.log(`You changes have been saved, Thanks Chief`)
		process.exit();
	}
}

module.exports = adminUserFunc;
