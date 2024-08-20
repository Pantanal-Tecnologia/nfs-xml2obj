import { V2Response } from 'data-nfs'
import xml2js from 'xml2js'
import {
  ValidationPrimitives,
  ValidationPrimitivesFunction,
  Validators,
  TextItem,
  KeyTextItem
} from './types'

const version = require('../version')

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

const BASE_PRIMITIVES: ValidationPrimitives = {
  isCalculated: {
    value: false
  },
  isNumber: {
    value: false
  },
  isInt: {
    value: false
  }
}

const BASE_TEXT_ITEM: TextItem = {
  value: '',
  isLike: true
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
  }
}

const validators: Validators = {
  cpnj: {
    text: [
      {
        value: 'cnpj',
        isLike: true
      },
      {
        value: 'documento',
        isLike: true
      },
      {
        value: 'CPF',
        isLike: false
      }
    ],
    keyValidatorsFrom: [
      {
        value: 'emit',
        isLike: true,
        mandatory: true
      },
      {
        value: 'prest',
        isLike: true,
        mandatory: true
      },
      {
        value: 'pre',
        isLike: true,
        mandatory: true
      }
    ],
    keyValidatorsTo: [
      {
        value: 'toma',
        isLike: true,
        mandatory: true
      },
      {
        value: 'dest',
        isLike: true,
        mandatory: true
      },
      {
        value: 'tom',
        isLike: true,
        mandatory: true
      }
    ],
    primitive: BASE_PRIMITIVES
  },
  cpf: {
    text: [
      {
        value: 'cpf',
        isLike: true
      },
      {
        value: 'documento',
        isLike: true
      }
    ],
    keyValidatorsFrom: [
      {
        value: 'emit',
        isLike: true,
        mandatory: true
      },
      {
        value: 'prest',
        isLike: true,
        mandatory: true
      },
      {
        value: 'pre',
        isLike: true,
        mandatory: true
      }
    ],
    keyValidatorsTo: [
      {
        value: 'toma',
        isLike: true,
        mandatory: true
      },
      {
        value: 'dest',
        isLike: true,
        mandatory: true
      },
      {
        value: 'tom',
        isLike: true,
        mandatory: true
      }
    ],
    primitive: BASE_PRIMITIVES
  },
  value: {
    text: [
      {
        value: 'basecalc',
        isLike: true
      },
      {
        value: 'valorbase',
        isLike: true
      },
      {
        value: 'vServ',
        isLike: false
      },
      {
        value: 'valorservicos',
        isLike: false
      },
      {
        value: 'VALOR_SERVICO',
        isLike: false
      },
      {
        value: 'VlBasCalc',
        isLike: false
      },
      {
        value: 'VALOR_TOTAL',
        isLike: false
      },
      {
        value: 'VALORTOTALNOTAFISCAL',
        isLike: false
      }
    ],
    ignoredKeys: [
      {
        value: 'itens',
        isLike: true
      },
      {
        value: 'ITENSNOTA',
        isLike: false
      }
    ],
    primitive: {
      ...BASE_PRIMITIVES,
      isCalculated: {
        value: true
      },
      isNumber: {
        value: true
      }
    }
  },
  grossValue: {
    text: [
      {
        value: 'basecalc',
        isLike: true
      },
      {
        value: 'vprod',
        isLike: true
      },
      {
        value: 'valorbase',
        isLike: true
      },
      {
        value: 'vServ',
        isLike: false
      },
      {
        value: 'valorservicos',
        isLike: false
      },
      {
        value: 'VALOR_NOTA',
        isLike: false
      },
      {
        value: 'VALOR_TOTAL',
        isLike: false
      },
      {
        value: 'ValorNFS',
        isLike: false
      },
      {
        value: 'VALORTOTALNOTAFISCAL',
        isLike: false
      },
      {
        value: 'VALORTOTALBASEISSQN',
        isLike: false
      }
    ],
    ignoredKeys: [
      {
        value: 'itens',
        isLike: true
      },
      {
        value: 'ITENSNOTA',
        isLike: false
      }
    ],
    primitive: {
      ...BASE_PRIMITIVES,
      isCalculated: {
        value: true
      },
      isNumber: {
        value: true
      }
    }
  },
  liquidValue: {
    text: [
      {
        value: 'liquido',
        isLike: true
      },
      {
        value: 'Liquido',
        isLike: true
      },
      {
        value: 'vLiq',
        isLike: true
      },
      {
        value: 'VALORTOTALNOTAFISCAL',
        isLike: false
      }
    ],
    ignoredKeys: [
      {
        value: 'itens',
        isLike: true
      },
      {
        value: 'ITENSNOTA',
        isLike: false
      }
    ],
    primitive: {
      ...BASE_PRIMITIVES,
      isCalculated: {
        value: true
      },
      isNumber: {
        value: true
      }
    }
  },
  number: {
    text: [
      {
        value: 'NUM_NOTA',
        isLike: false
      },
      {
        value: 'numero',
        isLike: false
      },
      {
        value: 'NumNF',
        isLike: false
      },
      {
        value: 'cod',
        isLike: true
      },
      {
        value: 'nNF',
        isLike: true
      },
      {
        value: 'NOTAFISCALNUMERO',
        isLike: false
      },
      {
        value: 'NumeroNFe',
        isLike: false
      },
    ],
    ignoredKeys: [
      {
        value: 'emit',
        isLike: true,
        mandatory: true
      },
      {
        value: 'prest',
        isLike: true,
        mandatory: true
      },
      {
        value: 'toma',
        isLike: true,
        mandatory: true
      },
      {
        value: 'dest',
        isLike: true,
        mandatory: true
      },
      {
        value: 'tom',
        isLike: true,
        mandatory: true
      }
    ],
    primitive: {
      ...BASE_PRIMITIVES,
      isNumber: {
        value: true
      }
    }
  },
  withheldIss: {
    text: [
      {
        value: 'issretido',
        isLike: true
      },
      {
        value: 'ISSQNRetido',
        isLike: true
      },
      {
        value: 'retido',
        isLike: false
      },
      {
        value: 'RETIDO',
        isLike: true
      },
      {
        value: 'Codigo',
        isLike: false
      },
      {
        value: 'ValorIssRet',
        isLike: false
      }
    ],
    ignoredKeys: [
      {
        value: 'itens',
        isLike: true
      },
      {
        value: 'servicos',
        isLike: true
      },
      {
        value: 'emit',
        isLike: true,
        mandatory: true
      },
      {
        value: 'prestador',
        isLike: true,
        mandatory: true
      },
      {
        value: 'toma',
        isLike: true,
        mandatory: true
      },
      {
        value: 'dest',
        isLike: true,
        mandatory: true
      },
      {
        value: 'tom',
        isLike: true,
        mandatory: true
      },
      {
        value: 'ITENSNOTA',
        isLike: false
      }
    ],
    keyValidators: [
      {
        value: 'ExigibilidadeISSQN',
        isLike: true,
        mandatory: false
      }
    ],
    primitive: {
      ...BASE_PRIMITIVES,
      isNumber: {
        value: false
      }
    }
  },
  issValue: {
    text: [
      {
        value: 'valoriss',
        isLike: true
      },
      {
        value: 'VALOR_ISS',
        isLike: true
      },
      {
        value: 'ValorISSQNCalculado',
        isLike: true
      },
      {
        value: 'vISSQN',
        isLike: false
      },
      {
        value: 'VALOR_ISS_RET',
        isLike: false
      },
      {
        value: 'valorImposto',
        isLike: false
      },
      {
        value: 'IMPOSTO',
        isLike: false
      },
      {
        value: 'VALORTOTALISSQRETIDO',
        isLike: false
      },
      {
        value: 'ValorIssRetido',
        isLike: false
      }
    ],
    ignoredKeys: [
      {
        value: 'ITENSNOTA',
        isLike: false
      }
    ],
    primitive: {
      ...BASE_PRIMITIVES,
      isNumber: {
        value: true
      },
      isCalculated: {
        value: true
      }
    }
  },
  inssValue: {
    text: [
      {
        value: 'inss',
        isLike: true,
      },
      {
        value: 'INSS',
        isLike: true,
      },
      {
        value: 'INSSRetido',
        isLike: true,
      },
      {
        value: 'vINSS',
        isLike: false,
      },
      {
        value: 'ValorINSS',
        isLike: false,
      },
      {
        value: 'ValorINSSRetido',
        isLike: false,
      },
      {
        value: 'VALOR_INSS',
        isLike: false,
      },
    ],
    primitive: {
      ...BASE_PRIMITIVES,
      isNumber: {
        value: true,
      },
      isCalculated: {
        value: false,
      },
    },
  },
  deductionValue: {
    text: [
      {
        value: 'deducoes',
        isLike: true
      },
      {
        value: 'vDesc',
        isLike: true
      },
      {
        value: 'Deduc',
        isLike: true
      },
      {
        value: 'vCalcDR',
        isLike: false
      }
    ],
    primitive: {
      ...BASE_PRIMITIVES,
      isNumber: {
        value: true
      },
      isCalculated: {
        value: true
      }
    }
  },
  retentions: {
    text: [
      {
        value: 'retenc',
        isLike: true
      },
      {
        value: 'vTotalRet',
        isLike: true
      },
      {
        value: 'valorImposto',
        isLike: true
      },
      {
        value: 'retencao',
        isLike: true
      },
      {
        value: 'VALOR_IR',
        isLike: false
      },
      {
        value: 'ValorIr',
        isLike: false
      }
    ],
    primitive: {
      ...BASE_PRIMITIVES,
      isNumber: {
        value: true
      },
      isCalculated: {
        value: true
      }
    }
  },
  operationNature: {
    text: [
      {
        value: 'NaturezaOperacao',
        isLike: true
      },
      {
        value: 'ExigibilidadeISS',
        isLike: true
      },
      {
        value: 'natureza',
        isLike: true
      },
      {
        value: 'operacao',
        isLike: true
      },
      {
        value: 'Codigo',
        isLike: false
      },
      {
        value: 'natOp',
        isLike: false
      }
    ],
    ignoredKeys: [
      {
        value: 'itens',
        isLike: true
      },
      {
        value: 'servicos',
        isLike: true
      }
    ],
    keyValidators: [
      {
        value: 'ExigibilidadeISSQN',
        isLike: true,
        mandatory: false
      }
    ],
    primitive: {
      ...BASE_PRIMITIVES
    }
  },
  cnpjPrest: {
    text: [
      {
        value: 'CpfCnpjPre',
        isLike: false,
        notValidated: true
      }
    ],
    primitive: BASE_PRIMITIVES
  },
  cnpjToma: {
    text: [
      {
        value: 'CpfCnpjTom',
        isLike: false,
        notValidated: true
      }
    ],
    primitive: BASE_PRIMITIVES
  },
  discount: {
    text: [
      {
        value: 'Desconto',
        isLike: true
      }
    ],
    ignoredKeys: [
      {
        value: 'itens',
        isLike: true
      },
      {
        value: 'ITENSNOTA',
        isLike: false
      }
    ],
    primitive: {
      ...BASE_PRIMITIVES,
      isCalculated: {
        value: true
      },
      isNumber: {
        value: true
      }
    }
  }
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
    if (validatorsList.length > 0 && !item.notValidated) {
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
          value: filteredKeys[keyIndex]
        },
        undefined,
        undefined,
        ignoredKeys
      )
      
      if (value) {
        return {
          found: value
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
      found: value
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
  Object.keys(object).some(function(k) {
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
  console.log('running data-nf@' + version.LIB_VERSION)
  const stripPrefix = xml2js.processors.stripPrefix
  const result: any = await new Promise((resolve, reject) => {
    const parser = new xml2js.Parser({
      attrkey: 'ATTR',
      tagNameProcessors: [stripPrefix],
      attrNameProcessors: [stripPrefix]
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
    
    const cnpjEmitWithValidator = findItemByList(
      nfs,
      validators.cpnj.text,
      validators.cpnj.keyValidatorsFrom
    )
    
    const cnpjPrest = findItemByList(nfs, validators.cnpjPrest.text)
    
    const cnpjToma = findItemByList(nfs, validators.cnpjToma.text)
    
    const cnpjDestWithValidator = findItemByList(
      nfs,
      validators.cpnj.text,
      validators.cpnj.keyValidatorsTo
    )
    
    const cpfEmit = findItemByList(
      nfs,
      validators.cpf.text,
      validators.cpf.keyValidatorsFrom
    )
    
    const cnpjEmit = cnpjEmitWithValidator
      ? cnpjEmitWithValidator
      : cnpjPrest
        ? cnpjPrest
        : undefined
    const cnpjDest = cnpjDestWithValidator
      ? cnpjDestWithValidator
      : cnpjToma
        ? cnpjToma
        : undefined
    const realCnpjEmit = cnpjEmit ? cnpjEmit.replace(/\D/g, '') : undefined
    const realCnpjDest = cnpjDest ? cnpjDest.replace(/\D/g, '') : undefined
    const realCpfEmit = cpfEmit ? cpfEmit.replace(/\D/g, '') : undefined
    
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
    
    const iss =
      findItemByList(
        nfs,
        validators.withheldIss.text,
        [],
        validators.withheldIss.primitive,
        validators.withheldIss.ignoredKeys
      ) ?? '0'
    
    const valorIss =
      findItemByList(
        nfs,
        validators.issValue.text,
        [],
        validators.issValue.primitive,
        validators.issValue.ignoredKeys
      ) ?? '0'
    
    const valorBruto = findItemByList(
      nfs,
      validators.grossValue.text,
      [],
      validators.grossValue.primitive,
      validators.grossValue.ignoredKeys
    )
    
    const valorLiquido = findItemByList(
      nfs,
      validators.liquidValue.text,
      [],
      validators.liquidValue.primitive,
      validators.liquidValue.ignoredKeys
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
    
    const descontos = findItemByList(
      nfs,
      validators.discount.text,
      [],
      validators.discount.primitive,
      validators.discount.ignoredKeys
    )
    
    const naturezaOperacao = findItemByList(
      nfs,
      validators.operationNature.text,
      validators.operationNature.keyValidators,
      validators.operationNature.primitive,
      validators.operationNature.ignoredKeys
    )
    
    const inssValue = findItemByList(
      nfs,
      validators.inssValue.text,
      [],
      validators.inssValue.primitive,
      validators.inssValue.ignoredKeys
    )
    
    
    const valorLiquidoValidado = !!valorLiquido
      ? valorLiquido
      : getNumber(valorNF) - getNumber(retencoes)
    
    const valorBrutoValidado = descontos
      ? getNumber(valorBruto) - getNumber(descontos) >= getNumber(valorLiquido)
        ? getNumber(valorBruto) - getNumber(descontos)
        : getNumber(valorBruto)
      : getNumber(valorBruto)
    
    return {
      cnpjEmit: realCnpjEmit,
      cnpjDest: realCnpjDest,
      cpfEmit: realCpfEmit,
      retencoes,
      valorDeducoes,
      valorIss,
      valorBruto: String(valorBrutoValidado),
      valorLiquido: String(valorLiquidoValidado),
      valorNF,
      inss: inssValue,
      descontos,
      iss,
      numero,
      naturezaOperacao
    }
  } catch (error) {
    throw error
  }
}

export default getDataNFSv2
