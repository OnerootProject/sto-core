const ethabi = require('ethereumjs-abi')
const ethers = require('ethers')

class InputDataDecoder {
    constructor(abi) {
        this.abi = abi;
    }

    decodeConstructor(data) {
        if (Buffer.isBuffer(data)) {
            data = data.toString('utf8')
        }

        if (typeof data !== `string`) {
            data = ``
        }

        data = data.trim()

        for (var i = 0; i < this.abi.length; i++) {
            const obj = this.abi[i]
            if (obj.type !== 'constructor') {
                continue
            }

            const name = obj.name || null
            const types = obj.inputs ? obj.inputs.map(x => x.type) : []

            // take last 32 bytes
            data = data.slice(-256)

            if (data.length !== 256) {
                throw new Error('fial')
            }

            if (data.indexOf(`0x`) !== 0) {
                data = `0x${data}`
            }

            const inputs = ethers.Interface.decodeParams(types, data)

            return {
                name,
                types,
                inputs
            }
        }

        throw new Error('not found')
    }

    decodeData(data) {
        if (Buffer.isBuffer(data)) {
            data = data.toString('utf8')
        }

        if (typeof data !== `string`) {
            data = ``
        }

        data = data.trim()

        const dataBuf = new Buffer(data.replace(/^0x/, ``), `hex`)
        const methodId = dataBuf.slice(0, 4).toString(`hex`)
        var inputsBuf = dataBuf.slice(4)

        const result = this.abi.reduce((acc, obj) => {
            if (obj.type === 'constructor') return acc
            const name = obj.name || null
            const types = obj.inputs ? obj.inputs.map(x => x.type) : []
            const params = obj.inputs ? obj.inputs.map(x => x.name) : []
            const hash = ethabi.methodID(name, types).toString(`hex`)

            if (hash === methodId) {
                // https://github.com/miguelmota/ethereum-input-data-decoder/issues/8
                if (methodId === 'a9059cbb') {
                    inputsBuf = Buffer.concat([new Buffer(12), inputsBuf.slice(12,32), inputsBuf.slice(32)])
                }

                const inputs = ethabi.rawDecode(types, inputsBuf)
                if (inputs) {
                    // console.log('inputs:', inputs);
                    for(let i=0; i< inputs.length; i++) {
                        if(inputs[i] instanceof Object && Buffer.isBuffer(inputs[i])){
                            inputs[i] = '0x'+ inputs[i].toString('hex');
                        } else if(Array.isArray(inputs[i])) {
                            for(let j=0; j< inputs[i].length; j++) {
                                if(inputs[i][j] instanceof Object && Buffer.isBuffer(inputs[i][j])){
                                    inputs[i][j] = '0x'+ inputs[i][j].toString('hex');
                                }
                            }
                        } else {
                            inputs[i] = '0x' + inputs[i];
                        }
                    }
                }

                let args ={};
                for(let i=0; i<params.length; i++) {
                    args[params[i]] = inputs[i];
                }

                return {
                    name,
                    types,
                    args
                }
            }

            return acc
        }, {name: null, types: [], args: []})

        if (!result.name) {
            try {
                const decoded = this.decodeConstructor(data)
                if (decoded) {
                    return decoded
                }
            } catch(err) { }
        }

        return result
    }
}

module.exports = InputDataDecoder
