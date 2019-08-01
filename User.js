let inquirer = require('inquirer');
const fs = require('fs');

let min = 50000,
	max = 500000;
let totalAmountInAtm;
fs.readFile('./ATM.json', 'utf8', (err, data) => {
	if (err) {
		console.error(err);
		return;
	}
	totalAmountInAtm = JSON.parse(data);
});
function normalUserFunc() {
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
				message: 'Please Input your pin',
				mask: true
			}
		])
		.then((normalUser) => {
			const user = new User(normalUser.name);
			user.chooseATMOperation();
		});
}

class User {
	constructor(name) {
		this.name = name;
		this.userAccountBalance = Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);
	}
	chooseATMOperation() {
		// console.clear()
		if (totalAmountInAtm['atmCanDispense']) {
			inquirer
				.prompt([
					/* Pass your questions in here */
					{
						type: 'list',
						name: 'reply',
						message: `Hello ${this.name} please select the kind of transation you want to perform`,
						choices: [ 'WithDrawal', 'Buy Airtime', 'Check Account balance','Check ATM balance', 'Exit' ]
					}
				])
				.then((answer) => {
					console.log(answer);
					if (answer.reply === 'WithDrawal') {
						this.withDrawFromATM();
					} else if (answer.reply === 'Buy Airtime') {
						this.buyAirtimeFromATM();
                    }else if(answer.reply ==='Check Account balance'){
						this.checkAccountBalance();
					} 
                     else if(answer.reply ==='Check ATM balance'){
						this.checkATMBalance();
					} else {
                        console.log('Goodbye')
                        process.exit()
                    }
				});
		} else {
			console.log('Sorry this ATM is currently disabled, please Contact an admin');
			process.exit();
		}
    }
    buyAirtimeFromATM(){
        inquirer
				.prompt([
					/* Pass your questions in here */
					{
						type: 'input',
						name: 'amount',
						message: `Please Enter recepient amount to top up`,
                    },
                    {
						type: 'input',
						name: 'phoneNum',
						message: `Please Enter recepient phone number`,
                    },
                    {
						type: 'confirm',
						name: 'decide',
						message: `Would you like to perform another transaction`,
                    }
                    
				])
				.then((answer) => {
					console.log(`TopUp was succesful`);
					if (answer.decide === true) {
						this.chooseATMOperation();
					} else {
                        console.log('Goodbye')
                        process.exit()
                    }
				});
    }
	withDrawFromATM() {
		console.clear();
		console.log(
			'\x1b[35m',
			`This atm has a total of ${totalAmountInAtm['amountInATM']} naira and you have a total of ${this
				.userAccountBalance} naira in your bank account\nAny transaction above these amount will fail, Contact the Admin to add more money if you need to withdraw more`
		);
		inquirer
			.prompt([
				{
					type: 'input',
					name: 'amountToWithdraw',
					message: 'Please Input amount you would like to withdraw (#)'
				}
			])
			.then((answer) => {
				if (
					answer.amountToWithdraw < totalAmountInAtm['amountInATM'] &&
					answer.amountToWithdraw < this.userAccountBalance
				) {
					answer.amountToWithdraw = Number(answer.amountToWithdraw);
					totalAmountInAtm['amountInATM'] -= answer.amountToWithdraw;
					this.userAccountBalance -= answer.amountToWithdraw;
					console.log(answer.amountToWithdraw);
					console.log('Withdrawal succesful');
				} else if (answer.amountToWithdraw > this.userAccountBalance) {
					console.log('\x1b[31m', `Insufficient fund in your bank account`);
				} else if (answer.amountToWithdraw > totalAmountInAtm['amountInATM']) {
					console.log(
						'\x1b[31m',
						`This ATM cannot dispense this amount, please reduce amount or contact the admin to add more money`
					);
				} else {
					console.log(
						'\x1b[31m',
						`Insufficent fund in account and withdrawal amount is higher than amount in ATM,`
					);
					console.log(
						'\x1b[31m',
						` please reduce amount you withdrawing or contact the admin to add more money`
					);
				}
				this.chooseATMOperation();
			});
	}
	checkAccountBalance() {
		console.clear();
		console.log(` Your accoun balance is ${this.userAccountBalance}`);
		inquirer
			.prompt([
				/* Pass your questions in here */
				{
					type: 'confirm',
					name: 'decide',
					message: 'would you like to perform another Transaction?',
				}
			])
			.then((answers) => {
				if (answers.decide == true) {
					this.chooseATMOperation();
				} else {
                    console.log("GoodBye")
                    process.exit()
				}
			});
    }
    checkATMBalance() {
		console.clear();
		console.log(` The total money in this atm is ${totalAmountInAtm['amountInATM']}`);
		inquirer
			.prompt([
				/* Pass your questions in here */
				{
					type: 'confirm',
					name: 'decide',
					message: 'would you like to perform another Transaction?',
				}
			])
			.then((answers) => {
				if (answers.decide == true) {
					this.chooseATMOperation();
				} else {
                    console.log("GoodBye")
                    process.exit()
				}
			});
	}
	// checkATMDepositHistory(){
	// }
}

module.exports = normalUserFunc;
