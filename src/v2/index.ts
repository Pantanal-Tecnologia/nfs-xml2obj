import { V2Response } from 'data-nfs'

import xml2js from 'xml2js'
const LIB_VERSION = require('../version');


const getNumber = (item?: any) => {
  if (typeof item === 'undefined') return 0

  if (typeof item === 'string') {
    const dotLength = item.split('').filter((i) => i === '.').length

    if (dotLength > 0 && item.indexOf(',') > -1) {
      const newItem = item.replace('.', '').replace(',', '.')

      return Number(newItem)
    }

    const newItem = item.replace(',', '.')

    return Number(newItem)
  }

  return NaN
}

interface ValidatorItem {
  text: TextItem[]
  keyValidatorsFrom?: KeyTextItem[]
  keyValidatorsTo?: KeyTextItem[]
  keyValidators?: KeyTextItem[]
  ignoredKeys?: KeyTextItem[]
  primitive: ValidationPrimitives
}

interface Primitive {
  value: boolean
}

interface ValidationPrimitives {
  isCalculated: Primitive
  isNumber: Primitive
  isInt: Primitive
}

interface ValidationPrimitivesFunction {
  isCalculated: (
    foundItem: any,
    searchedItem: any,
    primitive: ValidationPrimitives
  ) => boolean
  isNumber: (searchedItem: any) => boolean
  isInt: (searchedItem: any) => boolean
}

interface TextItem {
  value: string
  isLike: boolean
}

interface KeyTextItem extends TextItem {
  mandatory?: boolean
}

interface Validators {
  [key: string]: ValidatorItem
}

const BASE_PRIMITIVES: ValidationPrimitives = {
  isCalculated: {
    value: false,
  },
  isNumber: {
    value: false,
  },
  isInt: {
    value: false,
  },
}

const BASE_TEXT_ITEM: TextItem = {
  value: '',
  isLike: true,
}

const validatorFunctions: ValidationPrimitivesFunction = {
  isCalculated: (
    foundItem: any,
    searchedItem: any,
    primitive: ValidationPrimitives
  ) => {
    const foundItemIsAObject = typeof foundItem === 'object'
    const searchedItemIsAObject = typeof searchedItem === 'object'

    return (
      !foundItemIsAObject &&
      !searchedItemIsAObject &&
      primitive.isCalculated.value &&
      getNumber(searchedItem) > getNumber(foundItem)
    )
  },
  isNumber: (searchedItem: any) => {
    const searchedItemIsAObject = typeof searchedItem === 'object'

    return (
      !searchedItemIsAObject &&
      !isNaN(getNumber(searchedItem)) &&
      !isNaN(parseFloat(getNumber(searchedItem).toString()))
    )
  },
  isInt: (searchedItem: any) => {
    const searchedItemIsAObject = typeof searchedItem === 'object'

    return (
      !searchedItemIsAObject &&
      Number.isInteger(Number(searchedItem)) &&
      searchedItem?.length === String(Number(searchedItem)).length
    )
  },
}

const validators: Validators = {
  cpnj: {
    text: [
      {
        value: 'cnpj',
        isLike: true,
      },
      {
        value: 'documento',
        isLike: true,
      },
    ],
    keyValidatorsFrom: [
      {
        value: 'emit',
        isLike: true,
        mandatory: true,
      },
      {
        value: 'prest',
        isLike: true,
        mandatory: true,
      },
    ],
    keyValidatorsTo: [
      {
        value: 'toma',
        isLike: true,
        mandatory: true,
      },
      {
        value: 'dest',
        isLike: true,
        mandatory: true,
      },
      {
        value: 'tom',
        isLike: true,
        mandatory: true,
      },
    ],
    primitive: BASE_PRIMITIVES,
  },
  cpf: {
    text: [
      {
        value: "cpf",
        isLike: true,
      },
      {
        value: "documento",
        isLike: true,
      },
    ],
    keyValidatorsFrom: [
      {
        value: "emit",
        isLike: true,
        mandatory: true,
      },
      {
        value: "prest",
        isLike: true,
        mandatory: true,
      },
    ],
    keyValidatorsTo: [
      {
        value: "toma",
        isLike: true,
        mandatory: true,
      },
      {
        value: "dest",
        isLike: true,
        mandatory: true,
      },
      {
        value: "tom",
        isLike: true,
        mandatory: true,
      },
    ],
    primitive: BASE_PRIMITIVES,
  },
  value: {
    text: [
      {
        value: 'basecalc',
        isLike: true,
      },
      {
        value: 'valorbase',
        isLike: true,
      },
      {
        value: 'vServ',
        isLike: false,
      },
      {
        value: 'valorservicos',
        isLike: false,
      },
      {
        value: 'VALOR_SERVICO',
        isLike: false,
      },
    ],
    ignoredKeys: [
      {
        value: 'itens',
        isLike: true,
      },
    ],
    primitive: {
      ...BASE_PRIMITIVES,
      isCalculated: {
        value: true,
      },
      isNumber: {
        value: true,
      },
    },
  },
  grossValue: {
    text: [
      {
        value: 'basecalc',
        isLike: true,
      },
      {
        value: 'vprod',
        isLike: true,
      },
      {
        value: 'valorbase',
        isLike: true,
      },
      {
        value: 'vServ',
        isLike: false,
      },
      {
        value: 'valorservicos',
        isLike: false,
      },
      {
        value: 'VALOR_NOTA',
        isLike: false,
      },
    ],
    ignoredKeys: [
      {
        value: 'itens',
        isLike: true,
      },
    ],
    primitive: {
      ...BASE_PRIMITIVES,
      isCalculated: {
        value: true,
      },
      isNumber: {
        value: true,
      },
    },
  },
  liquidValue: {
    text: [
      {
        value: 'liquido',
        isLike: true,
      },
      {
        value: 'Liquido',
        isLike: true,
      },
      {
        value: 'vLiq',
        isLike: true,
      },
    ],
    ignoredKeys: [
      {
        value: 'itens',
        isLike: true,
      },
    ],
    primitive: {
      ...BASE_PRIMITIVES,
      isCalculated: {
        value: true,
      },
      isNumber: {
        value: true,
      },
    },
  },
  number: {
    text: [
      {
        value: 'NUM_NOTA',
        isLike: false,
      },
      {
        value: 'numero',
        isLike: false,
      },
      {
        value: 'cod',
        isLike: true,
      },
      {
        value: 'nNF',
        isLike: true,
      },
    ],
    ignoredKeys: [
      {
        value: 'emit',
        isLike: true,
        mandatory: true,
      },
      {
        value: 'prest',
        isLike: true,
        mandatory: true,
      },
      {
        value: 'toma',
        isLike: true,
        mandatory: true,
      },
      {
        value: 'dest',
        isLike: true,
        mandatory: true,
      },
      {
        value: 'tom',
        isLike: true,
        mandatory: true,
      },
    ],
    primitive: {
      ...BASE_PRIMITIVES,
      // isNumber: {
      //   value: true,
      // },
      // isInt: {
      //   value: true,
      // },
    },
  },
  withheldIss: {
    text: [
      {
        value: 'issretido',
        isLike: true,
      },
      {
        value: 'ISSQNRetido',
        isLike: true,
      },
      {
        value: 'retido',
        isLike: false,
      },
      {
        value: 'pAliqAplic',
        isLike: false,
      },
      {
        value: 'ALIQUOTA',
        isLike: false,
      },
      {
        value: 'tribISSQN',
        isLike: false,
      },
    ],
    primitive: {
      ...BASE_PRIMITIVES,
      isNumber: {
        value: true,
      },
    },
  },
  issValue: {
    text: [
      {
        value: 'valoriss',
        isLike: true,
      },
      {
        value: 'VALOR_ISS',
        isLike: true,
      },
      {
        value: 'ValorISSQNCalculado',
        isLike: true,
      },
      {
        value: 'vISSQN',
        isLike: false,
      },
      {
        value: 'VALOR_ISS_RET',
        isLike: false,
      },
      {
        value: 'IMPOSTO',
        isLike: false,
      },
      {
        value: 'valorImposto',
        isLike: false,
      },
    ],
    primitive: {
      ...BASE_PRIMITIVES,
      isNumber: {
        value: true,
      },
      isCalculated: {
        value: true,
      },
    },
  },
  deductionValue: {
    text: [
      {
        value: 'deducoes',
        isLike: true,
      },
      {
        value: 'vDesc',
        isLike: true,
      },
      {
        value: 'Deduc',
        isLike: true,
      },
      {
        value: 'vCalcDR',
        isLike: false,
      },
    ],
    primitive: {
      ...BASE_PRIMITIVES,
      isNumber: {
        value: true,
      },
      isCalculated: {
        value: true,
      },
    },
  },
  retentions: {
    text: [
      {
        value: 'retenc',
        isLike: true,
      },
      {
        value: 'vTotalRet',
        isLike: true,
      },
      {
        value: 'valorImposto',
        isLike: true,
      },
      {
        value: 'retencao',
        isLike: true,
      },
    ],
    primitive: {
      ...BASE_PRIMITIVES,
      isNumber: {
        value: true,
      },
      isCalculated: {
        value: true,
      },
    },
  },
  operationNature: {
    text: [
      {
        value: 'NaturezaOperacao',
        isLike: true,
      },
      {
        value: 'ExigibilidadeISS',
        isLike: true,
      },
      {
        value: 'natureza',
        isLike: true,
      },
      {
        value: 'operacao',
        isLike: true,
      },
      {
        value: 'Codigo',
        isLike: false,
      },
      {
        value: 'natOp',
        isLike: false,
      },
    ],
    ignoredKeys: [
      {
        value: 'itens',
        isLike: true,
      },
      {
        value: 'servicos',
        isLike: true,
      },
    ],
    keyValidators: [
      {
        value: 'ExigibilidadeISSQN',
        isLike: true,
        mandatory: false,
      },
    ],
    primitive: {
      ...BASE_PRIMITIVES,
    },
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
      const indexValues = keys.findIndex(
        (item) => item.toLowerCase().indexOf('valor') > -1
      )

      const indexNFSE = keys.findIndex(
        (item) => item.toLowerCase().indexOf('nfse') > -1
      )

      const indexNFE = keys.findIndex(
        (item) => item.toLowerCase().indexOf('nfe') > -1
      )

      if (indexNFSE > -1 && keys.length < 7 && indexValues < 0) {
        return findNf(ND[keys[indexNFSE]])
      }

      if (indexNFE > -1 && keys.length < 7 && indexValues < 0) {
        return findNf(ND[keys[indexNFE]])
      }

      return ND
    }

    return findNf(ND[keys[0]])
  }

  return null
}

const searchItem = (
  NF: any,
  item: TextItem,
  validator?: KeyTextItem,
  foundItem?: any,
  primitive: ValidationPrimitives = BASE_PRIMITIVES,
  ignoredKeys: KeyTextItem[] = []
) => {
  const searchedItem = findItem(NF, item, validator, ignoredKeys)?.found

  const foundItemIsAObject = typeof foundItem === 'object'
  const searchedItemIsAObject = typeof searchedItem === 'object'

  const hasSearchedItemAndFoundItemIsNotValid =
    (!foundItem || foundItemIsAObject) && searchedItem

  const isCalculatedAndIsHigher = validatorFunctions.isCalculated(
    foundItem,
    searchedItem,
    primitive
  )

  const isValid =
    hasSearchedItemAndFoundItemIsNotValid || isCalculatedAndIsHigher

  const isNumber = validatorFunctions.isNumber(searchedItem)

  if (primitive.isNumber.value) {
    const isInt = validatorFunctions.isInt(searchedItem)

    if (isValid && isNumber) {
      return primitive.isInt.value
        ? isInt
          ? searchedItem
          : undefined
        : searchedItem
    }

    return
  }

  if (isValid) {
    const filteredItem = searchedItemIsAObject
      ? findItem(searchedItem, item, undefined, ignoredKeys)?.found
      : searchedItem

    return filteredItem
  }

  return undefined
}

const findItemByList = (
  NF: any,
  list: TextItem[],
  validatorsList: KeyTextItem[] = [],
  primitive: ValidationPrimitives = BASE_PRIMITIVES,
  ignoredKeys: KeyTextItem[] = []
): string | undefined => {
  let foundItem: any

  const keys = Object.keys(NF)

  list.forEach((item) => {
    if (validatorsList.length > 0) {
      let shouldReturn = false

      validatorsList.forEach((valid) => {
        if (keys.length < 5) {
          keys.forEach((key) => {
            const nf = Array.isArray(NF[key]) ? NF[key][0] : NF[key]

            const searchedItem = searchItem(
              nf,
              item,
              valid,
              foundItem,
              primitive,
              ignoredKeys
            )

            if (searchedItem) {
              foundItem = searchedItem
            }
          })
        } else {
          const searchedItem = searchItem(
            NF,
            item,
            valid,
            foundItem,
            primitive,
            ignoredKeys
          )

          if (searchedItem) {
            foundItem = searchedItem
          }
        }

        if (!shouldReturn) {
          shouldReturn = !!valid.mandatory
        }
      })

      if (shouldReturn) {
        return
      }
    }

    const searchedItem = searchItem(
      NF,
      item,
      BASE_TEXT_ITEM,
      foundItem,
      primitive,
      ignoredKeys
    )

    if (searchedItem) {
      foundItem = searchedItem
    }
  })

  if (typeof foundItem === 'object') {
    const values = Object.values(foundItem)

    return Array.isArray(values[0]) ? values[0][0] : values[0]
  }

  return foundItem
}

const findItem = (
  NF: any,
  item: TextItem,
  keyValidator: TextItem = BASE_TEXT_ITEM,
  ignoredKeys: KeyTextItem[] = []
) => {
  if (keyValidator.value.trim()) {
    const keys = Object.keys(NF)

    const filteredKeys = keys.filter(
      (key) => key.toLowerCase().indexOf(keyValidator.value.toLowerCase()) > -1
    )

    if (filteredKeys.length > 5) {
      const keyIndex = filteredKeys.findIndex(
        (filtKey) =>
          filtKey.toLowerCase().indexOf(item.value.toLowerCase()) > -1
      )

      const value = findVal(
        NF,
        {
          ...item,
          value: filteredKeys[keyIndex],
        },
        undefined,
        undefined,
        ignoredKeys
      )

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
    keyValidator.value.trim() ? keyValidator : undefined,
    undefined,
    ignoredKeys
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
  keyObj: TextItem,
  keyValidator?: TextItem,
  validated = false,
  ignoredKeys: KeyTextItem[] = []
) {
  var value: any
  Object.keys(object).some(function (k) {
    if (keyObj.value === undefined) return false

    if (ignoredKeys.length > 0) {
      const index = ignoredKeys.findIndex((item) =>
        item.isLike
          ? k.toLowerCase().indexOf(item.value.toLowerCase()) > -1
          : k.toLowerCase() === item.value.toLowerCase()
      )

      if (index > -1) return false
    }

    if (
      keyValidator &&
      (keyValidator.isLike
        ? k.toLowerCase().indexOf(keyValidator.value.toLowerCase()) > -1
        : k.toLowerCase() === keyValidator.value.toLowerCase())
    ) {
      const kValue = Array.isArray(object[k]) ? object[k][0] : object[k]

      value = findVal(
        object[k],
        keyObj,
        keyValidator,
        typeof kValue === 'object',
        ignoredKeys
      )

      return value !== undefined
    }

    if (
      keyObj.isLike
        ? k.toLowerCase().indexOf(keyObj.value.toLowerCase()) > -1
        : k.toLowerCase() === keyObj.value.toLowerCase()
    ) {
      if ((keyValidator && validated) || !keyValidator) {
        value = Array.isArray(object[k]) ? object[k][0] : object[k]
        return true
      }
    }

    if (object[k] && typeof object[k] === 'object') {
      value = findVal(object[k], keyObj, keyValidator, validated, ignoredKeys)
      return value !== undefined
    }
  })

  return value
}

const getDataNFSv2 = async (xmlString: string): Promise<V2Response> => {
  console.log('running data-nf@' + LIB_VERSION);
  const stripPrefix = xml2js.processors.stripPrefix
  const result: any = await new Promise((resolve, reject) => {
    const parser = new xml2js.Parser({
      attrkey: 'ATTR',
      tagNameProcessors: [stripPrefix],
      attrNameProcessors: [stripPrefix],
    })

    parser.parseString(xmlString, (error, result) => {
      if (error) resolve(false)
      else resolve(result)
    })
  })

  if (result?.EnviarLoteRpsEnvio) {
    throw Error(
      'Não é possivel validar o fiscal com o XML do RPS, é nescessario o XML da nota fiscal.'
    )
  }

  try {
    const nfs = findNf(result)

    const cnpjEmit = findItemByList(
      nfs,
      validators.cpnj.text,
      validators.cpnj.keyValidatorsFrom
    )

    const realCnpjEmit = cnpjEmit ? cnpjEmit.replace(/\D/g, '') : undefined

    const cnpjDest = findItemByList(
      nfs,
      validators.cpnj.text,
      validators.cpnj.keyValidatorsTo
    )

    const cpfEmit = findItemByList(
      nfs,
      validators.cpf.text,
      validators.cpf.keyValidatorsFrom
    );

    const realCnpjDest = cnpjDest ? cnpjDest.replace(/\D/g, "") : undefined;
    const realCpfDest = cpfEmit ? cpfEmit.replace(/\D/g, "") : undefined;
    

    const valorNF = findItemByList(
      nfs,
      validators.value.text,
      [],
      validators.value.primitive
    )

    const numero = findItemByList(
      nfs,
      validators.number.text,
      [],
      validators.number.primitive,
      validators.number.ignoredKeys
    )

    const iss = findItemByList(
      nfs,
      validators.withheldIss.text,
      [],
      validators.withheldIss.primitive
    )

    const valorIss =
      findItemByList(
        nfs,
        validators.issValue.text,
        [],
        validators.issValue.primitive
      ) ?? '0'

    const valorBruto = findItemByList(
      nfs,
      validators.grossValue.text,
      [],
      validators.grossValue.primitive
    )

    const valorLiquido = findItemByList(
      nfs,
      validators.liquidValue.text,
      [],
      validators.liquidValue.primitive
    )

    const valorDeducoes =
      findItemByList(
        nfs,
        validators.deductionValue.text,
        [],
        validators.deductionValue.primitive
      ) ?? '0'

    const retencoes =
      findItemByList(
        nfs,
        validators.retentions.text,
        [],
        validators.retentions.primitive
      ) ?? '0'

    const naturezaOperacao = findItemByList(
      nfs,
      validators.operationNature.text,
      validators.operationNature.keyValidators,
      validators.operationNature.primitive,
      validators.operationNature.ignoredKeys
    )

    const valorLiquidoValidado = !!valorLiquido
      ? valorLiquido
      : getNumber(valorNF) -
        (getNumber(retencoes) > getNumber(valorIss)
          ? getNumber(retencoes)
          : getNumber(valorIss))

    return {
      cnpjEmit: realCnpjEmit,
      cnpjDest: realCnpjDest,
      cpfEmit: realCpfDest,
      retencoes,
      valorDeducoes,
      valorIss,
      valorBruto,
      valorLiquido: String(valorLiquidoValidado),
      valorNF,
      iss,
      numero,
      naturezaOperacao,
    }
  } catch (error) {
    throw error
  }
}

export default getDataNFSv2
