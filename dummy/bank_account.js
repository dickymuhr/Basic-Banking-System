class BankAccount {
    #name
    #balance

    constructor(name, initialBalance = 0) {
        if (this.constructor === BankAccount) {
            throw new Error("Cannot instantiate from Abstract Class");
        }
        this.#name = name;
        this.#balance = initialBalance;
    }

    async checkMinimumBalance(amount) {
        if (this.#balance - amount < 0) {
            throw new Error('Insufficient funds');
        }
        return amount;
    }

    async deposit(amount) {
        await setTimeout(() => {
            this.#balance += amount;
            console.log(`-> Deposit balance\t: ${amount}`);
            console.log(`- Current balance\t: ${this.#balance}`)
        }, 100);
    }

    async withdraw(amount) {
        try {
            let valid_amount = await this.checkMinimumBalance(amount);
            await setTimeout(() => {
                this.#balance -= valid_amount;
                console.log(`-> Withdraw balance\t: ${amount}`);
                console.log(`- Current balance\t: ${this.#balance}`)
            }, 100);
        } catch (err) {
            throw err;
        }
    }

    async display() {
        await setTimeout(() => {
            console.log(`-> Display Account Information\n- Account Name\t: ${this.#name}\n- Balance\t: ${this.#balance}`);
        }, 100);
    }
}

class GoldBankAccount extends BankAccount {
    #maxWithdraw = 10000000;

    constructor(name, initialBalance) {
        super(name, initialBalance);
    }

    async withdraw(amount) {
        if (amount > this.#maxWithdraw) {
            throw new Error('Exceed maximum withdraw amount!');
        } else {
            await super.withdraw(amount);
        }
    }
}
class SilverBankAccount extends BankAccount {
    #maxWithdraw = 2500000;

    constructor(name, initialBalance) {
        super(name, initialBalance);
    }

    async withdraw(amount) {
        if (amount > this.#maxWithdraw) {
            throw new Error('Exceed maximum withdraw amount!');
        } else {
            await super.withdraw(amount);
        }
    }
}



module.exports = { BankAccount, SilverBankAccount, GoldBankAccount };
