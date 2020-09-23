import crypto = require("crypto.js");

const enum AddressType {
    Invalid,
    UserWallet = 87,
    Contract = 88,
}

type TokenInfo = {
    contract: IContract,
    symbol: string,
    decimals: number,
}

class Inquiry {
    id: string;
    from: string;
    token: string | null;
    blockHeight: number;

    valueOrAmount?: BigNumber;
    symbol: string;
    decimals: number;

    constructor(arg: any) {
        if (typeof arg !== "string")
            return;

        const obj = JSON.parse(arg);

        this.id = obj.id;
        this.from = obj.from;
        this.token = obj.token;
        this.blockHeight = obj.blockHeight;
    }

    toString() {
        return JSON.stringify(this);
    }
}

const enum OrderType {
    NasToToken = "NAS->Token",
    TokenToNas = "Token->Nas",
}

class Order {
    id: string;
    owner: string;
    type: OrderType;
    trader: string | null;
    token: string;
    value: BigNumber;
    amount: BigNumber;
    blockHeight: number;
    timestamp: number;

    paidValue: BigNumber;
    paidAmount: BigNumber;

    symbol: string;
    decimals: number;

    constructor(arg: any) {
        if (typeof arg !== "string")
            return;

        const obj = JSON.parse(arg);

        this.id = obj.id;
        this.owner = obj.owner;
        this.type = obj.type;
        this.trader = obj.trader;
        this.token = obj.token;
        this.value = new BigNumber(obj.value);
        this.amount = new BigNumber(obj.amount);
        this.blockHeight = obj.blockHeight;
        this.timestamp = obj.timestamp;

        this.paidValue = new BigNumber(obj.paidValue);
        this.paidAmount = new BigNumber(obj.paidAmount);
    }

    toString() {
        return JSON.stringify(this);
    }
}

class Transaction {
    id: string;
    actualValue: BigNumber;
    actualAmount: BigNumber;
    blockHeight: number;
    order: Order;

    constructor(arg: any) {
        if (typeof arg !== "string")
            return;

        const obj = JSON.parse(arg);

        this.id = obj.id;
        this.actualValue = new BigNumber(obj.actualValue);
        this.actualAmount = new BigNumber(obj.actualAmount);
        this.blockHeight = obj.blockHeight;
        this.order = obj.order;
    }

    toString() {
        return JSON.stringify(this);
    }
}

class Node {
    id: string;
    previousId: string | null;
    nextId: string | null;

    constructor(arg: any) {
        if (typeof arg !== "string")
            return;

        const obj = JSON.parse(arg);

        this.id = obj.id;
        this.previousId = obj.previousId;
        this.nextId = obj.nextId;
    }

    toString() {
        return JSON.stringify(this);
    }
}

class Config {
    minValue: BigNumber;
    maxValue: BigNumber;

    minAmount: BigNumber;
    maxAmount: BigNumber;

    ratioProtectRange: number;
    valueProtectRange: number;

    deposit: number;

    fee: BigNumber;
    fee50Receiver: string;
    fee10Receivers: Array<string>;

    constructor(arg: Config | string) {
        if (typeof arg !== "string" && typeof arg !== "object")
            return;

        const obj = typeof arg !== "string" ? arg : JSON.parse(arg);

        if (typeof obj.minValue !== "string")
            throw new Error("Miss minValue property with a string value");
        if (typeof obj.maxValue !== "string")
            throw new Error("Miss maxValue property with a string value");
        if (typeof obj.minAmount !== "string")
            throw new Error("Miss minAmount property with a string value");
        if (typeof obj.maxAmount !== "string")
            throw new Error("Miss maxAmount property with a string value");

        if (typeof obj.ratioProtectRange !== "number")
            throw new Error("Miss ratioProtectRange property with a number value");
        if (typeof obj.valueProtectRange !== "number")
            throw new Error("Miss valueProtectRange property with a number value");

        if (typeof obj.deposit !== "number")
            throw new Error("Miss deposit property with a number value");

        if (typeof obj.fee !== "number")
            throw new Error("Miss fee property with a number value");
        if (typeof obj.fee50Receiver !== "string" || Blockchain.verifyAddress(obj.fee50Receiver) !== AddressType.UserWallet)
            throw new Error("Miss fee50Receiver property with an address");
        if (!Array.isArray(obj.fee10Receivers) || obj.fee10Receivers.length !== 5 ||
            obj.fee10Receivers.some(address => Blockchain.verifyAddress(address) !== AddressType.UserWallet))
            throw new Error("Miss fee10Receivers property with an array with 5 addresses");

        this.minValue = new BigNumber(obj.minValue);
        this.maxValue = new BigNumber(obj.maxValue);

        this.minAmount = new BigNumber(obj.minAmount);
        this.maxAmount = new BigNumber(obj.maxAmount);

        this.ratioProtectRange = obj.ratioProtectRange;
        this.valueProtectRange = obj.valueProtectRange;

        this.deposit = obj.deposit;

        this.fee = obj.fee;
        this.fee50Receiver = obj.fee50Receiver;
        this.fee10Receivers = obj.fee10Receivers;
    }
}

type FeeReceivers = { [key: string]: number }

export = class Contract {
    private _lastInquiryId: string;

    private _inquiries: StorageMap<Inquiry>;
    private _inquiryNodes: StorageMap<Node>;
    private _inquiryMap: StorageMap<string>;

    private _lastOrderId: string;

    private _orders: StorageMap<Order>;
    private _orderNodes: StorageMap<Node>;
    private _orderMap: StorageMap<string>;

    private _lastTransactionId: string;

    private _transactions: StorageMap<Transaction>;
    private _transactionNodes: StorageMap<Node>;

    private _proxy: string;

    private _config: Config;
    getConfig() {
        return this._config;
    }
    setConfig(value: Config) {
        if (Blockchain.transaction.from !== this._proxy)
            throw ("Permission denied");

        this._config = value;
    }

    constructor() {
        LocalContractStorage.defineProperties(this, {
            _lastInquiryId: null,
            _lastOrderId: null,
            _lastTransactionId: null,

            _proxy: null,
            _config: {
                parse(value: string) {
                    return new Config(value);
                },
                stringify(value: Config) {
                    return JSON.stringify(value);
                },
            },
        });
        LocalContractStorage.defineMapProperties(this, {
            _inquiries: {
                parse(value: string) {
                    return new Inquiry(value);
                },
                stringify(value: Inquiry) {
                    return JSON.stringify(value);
                },
            },
            _inquiryNodes: {
                parse(value: string) {
                    return new Node(value);
                },
                stringify(value: Node) {
                    return JSON.stringify(value);
                },
            },
            _inquiryMap: null,

            _orders: {
                parse(value: string) {
                    return new Order(value);
                },
                stringify(value: Order) {
                    return JSON.stringify(value);
                },
            },
            _orderNodes: {
                parse(value: string) {
                    return new Node(value);
                },
                stringify(value: Node) {
                    return JSON.stringify(value);
                },
            },
            _orderMap: null,

            _transactions: {
                parse(value: string) {
                    return new Transaction(value);
                },
                stringify(value: Transaction) {
                    return JSON.stringify(value);
                },
            },
            _transactionNodes: {
                parse(value: string) {
                    return new Node(value);
                },
                stringify(value: Node) {
                    return JSON.stringify(value);
                },
            },
        });
    }
    init(proxy: string, config?: Config) {
        if (Blockchain.verifyAddress(proxy) !== AddressType.Contract)
            throw new Error("Bad proxy address");

        this._proxy = proxy;

        this._lastInquiryId = null;
        this._lastOrderId = null;
        this._lastTransactionId = null;

        this._config = new Config(config);
    }

    addInquiry(token: string | null) {
        if (!token) {
            const balance = new BigNumber(Blockchain.getAccountState(Blockchain.transaction.from).balance);

            if (balance.lt(this._config.minValue))
                throw new Error("You've not enough NAS");
            if (balance.gt(this._config.maxValue))
                throw new Error("You've too much NAS");
        } else {
            if (Blockchain.verifyAddress(token) !== AddressType.Contract)
                throw new Error("Bad contract address");

            const contract = new Blockchain.Contract(token);
            const symbol = contract.call("symbol");
            const balance = new BigNumber(contract.call("balanceOf", Blockchain.transaction.from));

            if (balance.lt(this._config.minAmount))
                throw new Error(`You've not enough ${symbol}`);
            if (balance.gt(this._config.maxAmount))
                throw new Error(`You've too much ${symbol}`);
        }

        if (this._inquiryMap.get(Blockchain.transaction.from))
            throw new Error("You've added this inquiry");

        const id = crypto.sha3256(`${Blockchain.transaction.from}|${token}|${Blockchain.block.height}`);
        const inquiry = <Inquiry>{
            id,
            from: Blockchain.transaction.from,
            token,
            blockHeight: Blockchain.block.height,
        };

        if (this._lastInquiryId)
            this._inquiryNodes.set(this._lastInquiryId, {
                ...this._inquiryNodes.get(this._lastInquiryId),
                nextId: id,
            });

        this._inquiryNodes.set(id, {
            id,
            previousId: this._lastInquiryId,
            nextId: null,
        });
        this._lastInquiryId = id;

        this._inquiries.set(id, inquiry);
        this._inquiryMap.set(Blockchain.transaction.from, id);

        Event.Trigger("addInquiry", {
            inquiry,
        });
    }
    removeInquiry(id: string) {
        const node = this._inquiryNodes.get(id);

        if (node.previousId) {
            if (node.nextId)
                this._inquiryNodes.set(node.nextId, {
                    ...this._inquiryNodes.get(node.nextId),
                    previousId: node.previousId,
                });

            this._inquiryNodes.set(node.previousId, {
                ...this._inquiryNodes.get(node.previousId),
                nextId: node.nextId,
            });
        }

        if (this._lastInquiryId === id)
            this._lastInquiryId = node.previousId;

        this._inquiries.del(id);
        this._inquiryMap.del(Blockchain.transaction.from);

        Event.Trigger("removeInquiry", {
            id,
        });
    }
    removeAllInquiries() {
        const ids = [];

        let id = this._lastInquiryId;
        while (id) {
            const node = this._inquiryNodes.get(id);
            const inquiry = this._inquiries.get(id);

            if (inquiry.from === Blockchain.transaction.from)
                ids.push(id);

            id = node.previousId;
        }

        while (ids.length > 0)
            this.removeInquiry(ids.pop());
    }

    getAllInquiries() {
        const result = [];
        const cached = new Map<string, TokenInfo>();

        let id = this._lastInquiryId;
        while (id) {
            const { previousId } = this._inquiryNodes.get(id);
            const inquiry = this._inquiries.get(id);

            let shouldPush: boolean;

            if (!inquiry.token) {
                inquiry.valueOrAmount = new BigNumber(Blockchain.getAccountState(inquiry.from).balance);
                inquiry.symbol = "NAS";
                inquiry.decimals = 18;

                shouldPush = inquiry.valueOrAmount.gte(this._config.minValue) && inquiry.valueOrAmount.lte(this._config.maxValue);
            } else {
                let tokenInfo = cached.get(inquiry.token);
                if (!tokenInfo) {
                    const contract = new Blockchain.Contract(inquiry.token);
                    const symbol = contract.call("symbol");
                    const decimals = contract.call("decimals");

                    tokenInfo = {
                        contract,
                        symbol,
                        decimals,
                    };
                    cached.set(inquiry.token, tokenInfo);
                }

                inquiry.valueOrAmount = new BigNumber(tokenInfo.contract.call("balanceOf", inquiry.from));
                inquiry.symbol = tokenInfo.symbol;
                inquiry.decimals = tokenInfo.decimals;

                shouldPush = inquiry.valueOrAmount.gte(this._config.minAmount) && inquiry.valueOrAmount.lte(this._config.maxAmount);
            }

            if (shouldPush)
                result.push(inquiry);

            id = previousId;
        }

        return result;
    }

    addOrderWithNas(token: string, value: string | BigNumber, amount: string | BigNumber) {
        if (typeof token !== "string" || Blockchain.verifyAddress(token) !== AddressType.Contract)
            throw new Error("Invalid token contract address");

        if (this._orderMap.get(Blockchain.transaction.from))
            throw new Error("You've added order");

        if (typeof value === "string")
            value = new BigNumber(value);
        if (typeof amount === "string")
            amount = new BigNumber(amount);

        const deposit = value.div(100).times(this._config.deposit);
        if (Blockchain.transaction.value.lt(deposit))
            throw new Error("Value less than deposit");

        const order = this._createOrder(OrderType.NasToToken, token, value, amount);

        this._payOrderWithNas(order);

        this._orderMap.set(Blockchain.transaction.from, order.id);
    }
    payOrderWithNas(id: string) {
        const order = this._orders.get(id);

        let shouldCheckDeposit = false;

        if (order.type === OrderType.NasToToken) {
            if (order.owner !== Blockchain.transaction.from)
                throw new Error("You're not the owner of this order");
        } else {
            if (order.trader && order.trader !== Blockchain.transaction.from)
                throw new Error("Somebody has started trading to this order");

            if (!order.trader) {
                order.trader = Blockchain.transaction.from;
                shouldCheckDeposit = true;
            }
        }

        if (!shouldCheckDeposit) {
            const min = order.value.div(10);

            if (Blockchain.transaction.value.lt(min)) {
                const remaining = order.value.minus(order.paidValue);

                if (remaining.gt(min))
                    throw new Error("You must pay at least 1/10");
                else if (!Blockchain.transaction.value.eq(remaining))
                    throw new Error("You must pay all remaining");
            }
        } else {
            const deposit = order.value.div(100).times(this._config.deposit);

            if (Blockchain.transaction.value.lt(deposit))
                throw new Error("Value less than deposit");
        }

        this._payOrderWithNas(order);
        this._confirmIfBothAllPaid(order);
    }
    private _payOrderWithNas(order: Order) {
        const remaining = order.value.minus(order.paidValue);

        let paid: BigNumber;
        if (Blockchain.transaction.value.lte(remaining))
            paid = Blockchain.transaction.value;
        else {
            paid = remaining;

            if (Blockchain.transaction.value.gt(remaining))
                Blockchain.transfer(Blockchain.transaction.from, Blockchain.transaction.value.minus(remaining));
        }

        order.paidValue = order.paidValue.plus(paid);

        this._saveOrder(order);
    }

    addOrderWithToken(token: string, value: string | BigNumber, amount: string | BigNumber, amountToPay: string | BigNumber) {
        if (typeof token !== "string" || Blockchain.verifyAddress(token) !== AddressType.Contract)
            throw new Error("Invalid token contract address");

        if (this._orderMap.get(Blockchain.transaction.from))
            throw new Error("You've added order");

        if (typeof value === "string")
            value = new BigNumber(value);
        if (typeof amount === "string")
            amount = new BigNumber(amount);
        if (typeof amountToPay === "string")
            amountToPay = new BigNumber(amountToPay);

        const deposit = amount.div(100).times(this._config.deposit);
        if (amountToPay.lt(deposit))
            throw new Error("Amount less than deposit");

        const order = this._createOrder(OrderType.TokenToNas, token, value, amount);

        this._payOrderWithToken(order, amountToPay);

        this._orderMap.set(Blockchain.transaction.from, order.id);
    }
    payOrderWithToken(id: string, amountToPay: string | BigNumber) {
        const order = this._orders.get(id);

        let shouldCheckDeposit = false;

        if (order.type === OrderType.TokenToNas) {
            if (order.owner !== Blockchain.transaction.from)
                throw new Error("You're not the owner of this order");
        } else {
            if (order.trader && order.trader !== Blockchain.transaction.from)
                throw new Error("Somebody has started trading to this order");

            if (!order.trader) {
                order.trader = Blockchain.transaction.from;
                shouldCheckDeposit = true;
            }
        }

        if (typeof amountToPay === "string")
            amountToPay = new BigNumber(amountToPay);

        if (!shouldCheckDeposit) {
            const min = order.amount.div(10);

            if (amountToPay.lt(min)) {
                const remaining = order.amount.minus(order.paidAmount);

                if (remaining.gt(min))
                    throw new Error("You must pay at least 1/10");
                else if (!amountToPay.eq(remaining))
                    throw new Error("You must pay all remaining");
            }
        } else {
            const deposit = order.amount.div(100).times(this._config.deposit);

            if (amountToPay.lt(deposit))
                throw new Error("Value less than deposit");
        }

        this._payOrderWithToken(order, amountToPay);
        this._confirmIfBothAllPaid(order);
    }
    private _payOrderWithToken(order: Order, amountToPay: BigNumber) {
        const contract = new Blockchain.Contract(order.token);

        const remaining = order.amount.minus(order.paidAmount);
        const paid = BigNumber.min(remaining, amountToPay);

        contract.call("transferFrom", Blockchain.transaction.from, Blockchain.transaction.to, paid.toString(10));

        order.paidAmount = order.paidAmount.plus(paid);

        this._saveOrder(order);
    }

    private _createOrder(type: OrderType, token: string, value: BigNumber, amount: BigNumber) {
        this._checkIfOrderValid(value, amount);

        const id = crypto.sha3256(`${Blockchain.transaction.from}|${type}|${token}|${value}|${amount}|${Blockchain.block.height}`);
        const order = <Order>{
            id,
            owner: Blockchain.transaction.from,
            type,
            trader: null,
            token,
            value,
            amount,
            blockHeight: Blockchain.block.height,
            timestamp: Date.now(),

            paidValue: new BigNumber(0),
            paidAmount: new BigNumber(0),
        };

        return order;
    }
    private _checkIfOrderValid(value: BigNumber, amount: BigNumber) {
        if (value.lt(this._config.minValue) || value.gt(this._config.maxValue))
            throw new Error("Value out of range");
        if (amount.lt(this._config.minAmount) || amount.gt(this._config.maxAmount))
            throw new Error("Amount out of range");

        const targetRatio = amount.div(value);

        let id = this._lastOrderId;
        while (id) {
            const { previousId } = this._orderNodes.get(id);
            const order = this._orders.get(id);

            const ratio = order.amount.div(order.value);
            const ratioDelta = ratio.div(100).times(this._config.ratioProtectRange);

            if (targetRatio.gte(ratio.minus(ratioDelta)) && targetRatio.lte(ratio.plus(ratioDelta)))
                throw new Error("Invalid order ratio");

            const valueDelta = order.value.div(100).times(this._config.valueProtectRange);

            if (value.gte(order.value.minus(valueDelta)) && value.lte(order.value.plus(valueDelta)))
                throw new Error("Invalid order value");

            id = previousId;
        }
    }

    private _saveOrder(order: Order) {
        let isNew = false;

        if (!this._orders.get(order.id)) {
            if (this._lastOrderId)
                this._orderNodes.set(this._lastOrderId, {
                    ...this._orderNodes.get(this._lastOrderId),
                    nextId: order.id,
                });

            this._orderNodes.set(order.id, {
                id: order.id,
                previousId: this._lastOrderId,
                nextId: null,
            });
            this._lastOrderId = order.id;

            isNew = true;
        }

        this._orders.set(order.id, order);

        Event.Trigger("updateOrder", {
            order,
            isNew,
        });
    }

    private _confirmIfBothAllPaid(order: Order) {
        if (order.paidValue.lt(order.value) || order.paidAmount.lt(order.amount))
            return;

        this._confirmOrder(order);
    }
    private _confirmOrder(order: Order) {
        const feeReceiverInfos = this._determinFeeReceivePercentages();

        let nasSender: string;
        let nasReceiver: string;
        let tokenSender: string;
        let tokenReceiver: string;
        if (order.type === OrderType.NasToToken) {
            nasSender = tokenReceiver = order.owner;
            nasReceiver = tokenSender = order.trader;
        } else {
            nasSender = tokenReceiver = order.trader;
            nasReceiver = tokenSender = order.owner;
        }

        let actualValue: BigNumber;
        let actualAmount: BigNumber;
        if (order.value.eq(order.paidValue) && order.amount.eq(order.paidAmount)) {
            actualValue = order.value;
            actualAmount = order.amount;
        } else {
            const ratio = order.amount.div(order.value);

            actualValue = order.paidAmount.div(ratio);

            if (actualValue.lte(order.paidValue))
                actualAmount = order.paidAmount;
            else {
                actualValue = order.paidValue;
                actualAmount = order.paidValue.times(ratio);
            }
        }

        const txActualValue = actualValue;
        const txActualAmount = actualAmount;

        const contract = new Blockchain.Contract(order.token);

        if (order.paidValue.gt(actualValue))
            Blockchain.transfer(nasSender, order.paidValue.minus(actualValue));
        if (order.paidAmount.gt(actualAmount))
            contract.call("transfer", tokenSender, order.paidAmount.minus(actualAmount).toString(10));

        const valueFee = actualValue.minus(order.value.div(100).times(this._config.deposit)).div(1000).times(this._config.fee);
        const amountFee = actualAmount.minus(order.amount.div(100).times(this._config.deposit)).div(1000).times(this._config.fee);

        if (valueFee.gt(0) && amountFee.gt(0)) {
            actualValue = actualValue.minus(valueFee);
            actualAmount = actualAmount.minus(amountFee);

            for (const [feeReceiver, percentage] of Object.entries(feeReceiverInfos)) {
                Blockchain.transfer(feeReceiver, valueFee.div(100).times(percentage));
                contract.call("transfer", feeReceiver, amountFee.div(100).times(percentage).toString(10));
            }
        }

        Blockchain.transfer(nasReceiver, actualValue);
        contract.call("transfer", tokenReceiver, actualAmount.toString(10));

        this._removeOrder(order.id);
        this._addTransaction(order, txActualValue, txActualAmount);
    }
    private _determinFeeReceivePercentages() {
        const result = <FeeReceivers>{};

        result[this._config.fee50Receiver] = 50;

        for (const receiver of this._config.fee10Receivers)
            result[receiver] = (result[receiver] || 0) + 10;

        return result;
    }

    confirmOrdersByManager(ids: Array<string>) {
        const proxyContract = new Blockchain.Contract(this._proxy);
        const manager = <Array<string>>proxyContract.call("getManagers");

        if (!manager.includes(Blockchain.transaction.from))
            throw new Error("Permission denied");

        if (!Array.isArray(ids))
            throw new Error("Argument should be an array");

        for (const id of ids) {
            const order = this._orders.get(id);

            if (order)
                this._confirmOrder(order);
        }
    }

    cancelOrder(id?: string) {
        if (!id) {
            id = this._orderMap.get(Blockchain.transaction.from);

            if (!id)
                throw new Error("You've no any orders");
        }

        const order = this._orders.get(id);

        if (order.owner !== Blockchain.transaction.from)
            throw new Error("You should be the owner of this order");

        if (order.trader)
            throw new Error("Cannot cancel the order with trader");

        if (order.type === OrderType.NasToToken && order.paidValue.gt(0))
            Blockchain.transfer(Blockchain.transaction.from, order.paidValue);

        if (order.type === OrderType.TokenToNas && order.paidAmount.gt(0)) {
            const contract = new Blockchain.Contract(order.token);

            contract.call("transfer", Blockchain.transaction.from, order.paidAmount.toString(10));
        }

        this._removeOrder(id);

        Event.Trigger("cancelOrder", {
            id,
        });
    }
    _removeOrder(id: string) {
        const node = this._orderNodes.get(id);

        if (node.previousId) {
            if (node.nextId)
                this._orderNodes.set(node.nextId, {
                    ...this._orderNodes.get(node.nextId),
                    previousId: node.previousId,
                });

            this._orderNodes.set(node.previousId, {
                ...this._orderNodes.get(node.previousId),
                nextId: node.nextId,
            });
        }

        if (this._lastOrderId === id)
            this._lastOrderId = node.previousId;

        this._orders.del(id);
        this._orderMap.del(Blockchain.transaction.from);

        Event.Trigger("removeOrder", {
            id,
        });
    }

    getAllOrders() {
        const result = [];
        const cached = new Map<string, Omit<TokenInfo, "contract">>();

        let id = this._lastOrderId;
        while (id) {
            const { previousId } = this._orderNodes.get(id);
            const order = this._orders.get(id);

            let tokenInfo = cached.get(order.token);
            if (!tokenInfo) {
                const contract = new Blockchain.Contract(order.token);
                const symbol = contract.call("symbol");
                const decimals = contract.call("decimals");

                tokenInfo = {
                    symbol,
                    decimals,
                };
                cached.set(order.token, tokenInfo);
            }

            order.symbol = tokenInfo.symbol;
            order.decimals = tokenInfo.decimals;

            result.push(order);
            id = previousId;
        }

        return result;
    }
    getOrder(id: string) {
        const order = this._orders.get(id);

        if (order) {
            const contract = new Blockchain.Contract(order.token);
            const symbol = contract.call("symbol");
            const decimals = contract.call("decimals");

            order.symbol = symbol;
            order.decimals = decimals;
        }

        return order;
    }

    private _addTransaction(order: Order, actualValue: BigNumber, actualAmount: BigNumber) {
        const id = crypto.sha3256(`${order.id}|${Blockchain.block.height}`);
        const transaction = <Transaction>{
            id,
            actualValue,
            actualAmount,
            blockHeight: Blockchain.block.height,
            order,
        };

        if (this._lastTransactionId)
            this._transactionNodes.set(this._lastTransactionId, {
                ...this._transactionNodes.get(this._lastTransactionId),
                nextId: id,
            });

        this._transactionNodes.set(id, {
            id,
            previousId: this._lastTransactionId,
            nextId: null,
        });
        this._lastTransactionId = id;

        this._transactions.set(id, transaction);

        Event.Trigger("newTransaction", {
            transaction,
        });
    }

    getAllTransactions() {
        const result = [];
        const cached = new Map<string, Omit<TokenInfo, "contract">>();

        let id = this._lastTransactionId;
        while (id) {
            const { previousId } = this._transactionNodes.get(id);
            const transaction = this._transactions.get(id);
            const { order } = transaction;

            let tokenInfo = cached.get(order.token);
            if (!tokenInfo) {
                const contract = new Blockchain.Contract(order.token);
                const symbol = contract.call("symbol");
                const decimals = contract.call("decimals");

                tokenInfo = {
                    symbol,
                    decimals,
                };
                cached.set(transaction.order.token, tokenInfo);
            }

            order.symbol = tokenInfo.symbol;
            order.decimals = tokenInfo.decimals;

            result.push(transaction);
            id = previousId;
        }

        return result;
    }
}
