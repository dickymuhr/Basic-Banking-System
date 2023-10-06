const { BankAccount, SilverBankAccount, GoldBankAccount } = require('./bank_account.js')

const dicAccount = new SilverBankAccount("Dicky",10000000)

const dicAccount2 = new GoldBankAccount("Dicky2",10000000)

async function performTask(){
    await dicAccount.deposit(1000000)
    await dicAccount.withdraw(2000000)
    await dicAccount.display()


    await dicAccount2.withdraw(5000000)
    await dicAccount2.display()
}

performTask()