export = class {
    private _managers: Array<string>;
    getManagers() {
        return this._managers;
    }

    constructor() {
        LocalContractStorage.defineProperties(this, {
            _managers: null,
        });
    }

    init(managers: Array<string>) {
        if (!Array.isArray(managers))
            throw new Error("managers args should be an array");
        if (managers.length === 0)
            throw new Error("It should be at least one manager");

        this._managers = managers;
    }

    addManager(manager: string) {
        this._verifyManager();
        this._verifyAddress(manager);

        if (this._managers.includes(manager))
            throw new Error("Duplicated");

        this._managers = [...this._managers, manager];
    }
    removeManager(manager: string) {
        this._verifyManager();
        this._verifyAddress(manager);

        if (manager === Blockchain.transaction.from)
            throw new Error("You can't remove yourself");

        const index = this._managers.indexOf(manager);
        if (index === -1)
            throw new Error("Provided manager not exists");

        this._managers = [...this._managers.splice(index)];
    }

    setConfig(contractAddress: string, config: Object) {
        this._verifyManager();

        if (Blockchain.verifyAddress(contractAddress) !== 88)
            throw new Error("Bad contract address");

        const contract = new Blockchain.Contract(contractAddress);

        contract.call("setConfig", config);
    }

    private _verifyManager() {
        if (!this._managers.includes(Blockchain.transaction.from))
            throw ("Permission denied");
    }
    private _verifyAddress(address: string) {
        if (Blockchain.verifyAddress(address) === 0)
            throw new Error("Bad address")
    }
}