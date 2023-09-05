import { V2Response } from 'data-nfs'

import xml2js from 'xml2js'

interface ValidatorItem {
  text: TextItem[]
  keyValidatorsFrom?: KeyTextItem[]
  keyValidatorsTo?: KeyTextItem[]
  keyValidators?: KeyTextItem[]
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
      Number(searchedItem) > Number(foundItem)
    )
  },
  isNumber: (searchedItem: any) => {
    const searchedItemIsAObject = typeof searchedItem === 'object'

    return (
      !searchedItemIsAObject &&
      !isNaN(searchedItem) &&
      !isNaN(parseFloat(searchedItem))
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
  value: {
    text: [
      {
        value: 'valor',
        isLike: true,
      },
      {
        value: 'total',
        isLike: true,
      },
      {
        value: 'vnf',
        isLike: true,
      },
      {
        value: 'valorservicos',
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
        value: 'valorservicos',
        isLike: false,
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
        value: 'VALORTOTALSERVICOS',
        isLike: true,
      },
      {
        value: 'ValorServicos',
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
    primitive: {
      ...BASE_PRIMITIVES,
      isNumber: {
        value: true,
      },
      isInt: {
        value: true,
      },
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
    ],
    primitive: {
      ...BASE_PRIMITIVES,
    },
  },
  issValue: {
    text: [
      {
        value: 'valoriss',
        isLike: true,
      },
      {
        value: 'ValorISSQNCalculado',
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
      isNumber: {
        value: true,
      },
    },
  },
  cofinsValue: {
    text: [
      {
        value: 'valorcofins',
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
  csllValue: {
    text: [
      {
        value: 'valorcsll',
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
  incomeTax: {
    text: [
      {
        value: 'valorir',
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
  pisValue: {
    text: [
      {
        value: 'valorpis',
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
  primitive: ValidationPrimitives = BASE_PRIMITIVES
) => {
  const searchedItem = findItem(NF, item, validator)?.found

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
      ? findItem(searchedItem, item)?.found
      : searchedItem

    return filteredItem
  }

  return undefined
}

const findItemByList = (
  NF: any,
  list: TextItem[],
  validatorsList: KeyTextItem[] = [],
  primitive: ValidationPrimitives = BASE_PRIMITIVES
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
              primitive
            )

            if (searchedItem) {
              foundItem = searchedItem
            }
          })
        } else {
          const searchedItem = searchItem(NF, item, valid, foundItem, primitive)

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
      primitive
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
  keyValidator: TextItem = BASE_TEXT_ITEM
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

      const value = findVal(NF, {
        ...item,
        value: filteredKeys[keyIndex],
      })

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
    keyValidator.value.trim() ? keyValidator : undefined
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
  validated = false
) {
  var value: any
  Object.keys(object).some(function (k) {
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
        typeof kValue === 'object'
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
      value = findVal(object[k], keyObj, keyValidator, validated)
      return value !== undefined
    }
  })

  return value
}

const getDataNFSv2 = async (xmlString: string): Promise<V2Response> => {
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

    const cnpjDest = findItemByList(
      nfs,
      validators.cpnj.text,
      validators.cpnj.keyValidatorsTo
    )

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
      validators.number.primitive
    )

    const iss = findItemByList(
      nfs,
      validators.withheldIss.text,
      [],
      validators.withheldIss.primitive
    )

    const valorIss = findItemByList(
      nfs,
      validators.issValue.text,
      [],
      validators.issValue.primitive
    )

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
      validators.operationNature.primitive
    )

    const valorCofins = findItemByList(
      nfs,
      validators.cofinsValue.text,
      validators.cofinsValue.keyValidators,
      validators.cofinsValue.primitive
    )

    const valorPis = findItemByList(
      nfs,
      validators.pisValue.text,
      validators.pisValue.keyValidators,
      validators.pisValue.primitive
    )

    const valorIr = findItemByList(
      nfs,
      validators.incomeTax.text,
      validators.incomeTax.keyValidators,
      validators.incomeTax.primitive
    )

    const valorCsll = findItemByList(
      nfs,
      validators.csllValue.text,
      validators.csllValue.keyValidators,
      validators.csllValue.primitive
    )

    return {
      cnpjEmit,
      cnpjDest,
      retencoes,
      valorDeducoes,
      valorBruto,
      valorLiquido,
      valorNF,
      numero,
      naturezaOperacao,
      impostos: {
        iss,
        valorIss,
        valorCofins,
        valorPis,
        valorIr,
        valorCsll,
      },
    }
  } catch (error) {
    throw error
  }
}

export default getDataNFSv2
