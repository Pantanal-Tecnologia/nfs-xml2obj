const xml2js = require('xml2js');

const validators = {
    cpnj: {
      text: ['cnpj'],
      keyValidatorsFrom: ['emit', 'prest'],
      keyValidatorsTo: ['toma', 'dest'],
    },
    value: {
      text: ['valor', 'total', 'vnf', 'valorservicos'],
    },
    number: {
      text: ['numero', 'cod', 'nNF'],
    },
}

const findNf = (ND: any): any => {
  const isArray = Array.isArray(ND)
  const isObject = typeof ND === 'object'

  if (isArray) {
      return findNf(ND[0])
  }

  if (isObject) {
      const keys = Object.keys(ND)

      if (keys.length > 1) {
      const indexNFSE = keys.findIndex(
          (item) => item.toLowerCase().indexOf('nfse') > -1
      )

      const indexNFE = keys.findIndex(
          (item) => item.toLowerCase().indexOf('nfe') > -1
      )

      if (indexNFSE > -1 && keys.length < 7) {
          return findNf(ND[keys[indexNFSE]])
      }

      if (indexNFE > -1 && keys.length < 7) {
          return findNf(ND[keys[indexNFE]])
      }

      return ND
      }

      return findNf(ND[keys[0]])
  }

  return null
}

const findItemByList = (
  NF: any,
  list: string[],
  validatorsList: string[] = []
  ) => {
  let foundItem: any

  list.forEach((item) => {
      if (validatorsList.length > 0) {
      return validatorsList.forEach((valid) => {
          const searchedItem = findItem(NF, item, valid)?.found

          if ((!foundItem || typeof foundItem === 'object') && searchedItem) {
          foundItem = searchedItem
          }
      })
      }
      const searchedItem = findItem(NF, item)?.found

      if ((!foundItem || typeof foundItem === 'object') && searchedItem) {
        foundItem = findItem(NF, item)?.found
      }
  })

  if (typeof foundItem === 'object') {
      const values = Object.values(foundItem)

      return Array.isArray(values[0]) ? values[0][0] : values[0]
  }

  return foundItem
}

const findItem = (NF: any, item: string, keyValidator = '') => {
if (keyValidator.trim()) {
    const keys = Object.keys(NF)

    const filteredKeys = keys.filter(
    (key) => key.toLowerCase().indexOf(keyValidator.toLowerCase()) > -1
    )

    if (filteredKeys.length > 5) {
    const keyIndex = filteredKeys.findIndex(
        (filtKey) => filtKey.toLowerCase().indexOf(item.toLowerCase()) > -1
    )

    const value = findVal(NF, filteredKeys[keyIndex])

    if (value) {
        return {
        found: value,
        }
    }
    }
}

const value = findVal(
    NF,
    item,
    keyValidator.trim() ? keyValidator : undefined
)

  if (value) {
      return {
      found: value,
      }
  }

  return null
}

function findVal(
object: any,
key: string,
keyValidator?: string,
validated = false
) {
var value
Object.keys(object).some(function (k) {
    if (
    keyValidator &&
    k.toLowerCase().indexOf(keyValidator.toLowerCase()) > -1
    ) {
    const kValue = Array.isArray(object[k]) ? object[k][0] : object[k]

    value = findVal(object[k], key, keyValidator, typeof kValue === 'object')
    return typeof kValue === 'object'
    }

    if (k.toLowerCase().indexOf(key.toLowerCase()) > -1) {
    if ((keyValidator && validated) || !keyValidator) {
        value = Array.isArray(object[k]) ? object[k][0] : object[k]
        return true
    }
    }
    if (object[k] && typeof object[k] === 'object') {
    value = findVal(object[k], key, keyValidator, validated)
    return value !== undefined
    }
})
return value
}

const getDataNFSv2 = async (xmlString: String) => {
  const stripPrefix = xml2js.processors.stripPrefix;
  const result: any =  await new Promise((resolve, reject) => {
    const parser = new xml2js.Parser({
      attrkey: "ATTR",
      tagNameProcessors: [ stripPrefix ],
      attrNameProcessors: [ stripPrefix ]
    });

    parser.parseString(xmlString, (error: any, result: any) => {
      if (error) resolve(false)
      else resolve(result)
    })
  })

  if (result?.EnviarLoteRpsEnvio) {
    return [false, 'Não é possivel validar o fiscal com o XML do RPS, é nescessario o XML da nota fiscal.']
  }
  const dados: any = {
    cnpjEmit: false,
    cnpjDest: false,
    valorNF: false,
    Numero: false
  }
  try {
      dados.cnpjEmit = findItemByList(result, validators.cpnj.text, validators.cpnj.keyValidatorsFrom),
      dados.cnpjDest = findItemByList(result, validators.cpnj.text, validators.cpnj.keyValidatorsTo),
      dados.valorNF = findItemByList(result, validators.value.text, []),
      dados.Numero = findItemByList(result, validators.number.text, []),
      // ADICIONAR
      dados.issRetiro = false,
      dados.ValorDeducoes = false,
      dados.ValorIssRetido = false,
      dados.OutrasRetencoes = false,
      dados.ValorServicosBruto = false,
      dados.ValorLiquido = false
  } catch (error) {
    return [false, 'ERRO']
  }
  for (const key in dados) {
    if (Object.prototype.hasOwnProperty.call(dados, key)) {
      if (!dados[key]) {
        return [false, `Bool(${key}) == false`]
      }
    }
  }
  return [true, dados]
}

export default getDataNFSv2
