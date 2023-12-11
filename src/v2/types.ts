export interface ValidatorItem {
  text: TextItem[]
  keyValidatorsFrom?: KeyTextItem[]
  keyValidatorsTo?: KeyTextItem[]
  keyValidators?: KeyTextItem[]
  ignoredKeys?: KeyTextItem[]
  primitive: ValidationPrimitives
}

export interface Primitive {
  value: boolean
}

export interface ValidationPrimitives {
  isCalculated: Primitive
  isNumber: Primitive
  isInt: Primitive
}

export interface ValidationPrimitivesFunction {
  isCalculated: (
    foundItem: any,
    searchedItem: any,
    primitive: ValidationPrimitives
  ) => boolean
  isNumber: (searchedItem: any) => boolean
  isInt: (searchedItem: any) => boolean
}

export interface TextItem {
  value: string
  isLike: boolean
}

export interface KeyTextItem extends TextItem {
  mandatory?: boolean
}

export interface Validators {
  [key: string]: ValidatorItem
}
