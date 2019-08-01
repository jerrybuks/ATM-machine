let inquirer = require('inquirer');
let fs = require('fs')
let util = require('util')
function adminUserFunc(){
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
        const admin = new Admin(adminUser.name)
        admin.chooseATMOperation()
	});
}

class Admin{
    constructor(name){
        this.name = name;
        this.adminDeposit = 0;
        this.candispenseCash = true;
    }
    chooseATMOperation(){
        console.clear()
        inquirer
        .prompt([
            /* Pass your questions in here */
            {
                type: 'list',
                name: 'reply',
                message: 'Hello ' + this.name + ',' + ' please select the kind of Operation you want to perform',
                choices: [ 'Add Money to ATM', 'Remove Money from ATM', 'Check ATM balance', 'Exit' ],
            }
        ]).then((answer) => {
            console.log(answer)
            if(answer.reply === 'Add Money to ATM'){
                this.addMoneyToATM()
            } else if(answer.reply === 'Remove Money from ATM'){
                this.RemoveMoneyFromATM()
            } else if(answer.reply= 'Check ATM balance'){
                this.checkATMBalance()
            } else {
                this.exit()
            }
        })
    }
    addMoneyToATM(){
        console.clear()
        inquirer
        .prompt([
            {
                type: 'input',
                name: 'amount',
                message: 'Please Input amount, maximum of 1 million naira (#)',
                validate: function( value ) {
                    if (value > 0 && (value< 1000000) ) {
                        console.log("\n")
                        console.log("Amount was succesfully added to the ATM")
                      return true;
                    } else {
                      return "Please Input a valid amount, maximum of 1 million naira";
                    }
                  },
            },
            {
                type: 'confirm',
                name: 'moreMoney',
                message: 'Would you like to? add more MOney to ATM',
            }
        ]).then((answer) => {
            answer.amount = Number(answer.amount)
            this.adminDeposit += answer.amount
            if(answer.moreMoney == true) {
                this.addMoneyToATM()
            } else {
                this.chooseATMOperation()
            }
        })
    }

    checkATMBalance(){
        console.clear()
        console.log(this.adminDeposit)
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
            if(answer.step === 'Go back'){
                this.chooseATMOperation()
            }else {
                this.exit()
            }
        });
    }
    exit(){
        let obj = {amountInATM: this.adminDeposit, atmCanDispense: this.candispenseCash}
        let data = JSON.stringify(obj)
        fs.writeFileSync('./ATM.json',data, 'utf-8',{'flags': 'w+'})
        console.log("Thanks Chief")
        process.exit()
    }
}

module.exports = adminUserFunc