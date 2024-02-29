import { feedData, handleOperatorsByPropertyType, mountTable } from "./utils.js"

// database
const data = window.datastore

// table data
mountTable(data.getProducts())

// property filter
const propertyFilter = document.getElementById('propertyFilter')

// operator filter
const operatorFilter = document.getElementById('operatorFilter')

// enumerated filter
const enumeratedFilter = document.getElementById('enumeratedFilter')

// wireless options
const wirelessOptions = document.getElementById('wirelessOptions')

// value filter options
const valueFilter = document.getElementById('valueFilter')

// property type
const propertyType = document.getElementById('propertyType')

// clear button
const clearButton = document.getElementById('clearButton')

const propertyFilterData = data.getProperties().map(property => property)
const operatorFilterData = data.getOperators().map(property => property)

const optionKeyValue = 'name'
feedData(propertyFilter, propertyFilterData, optionKeyValue)

propertyFilter.addEventListener('change', (event) => {
  let selected = event.target.value
  enumeratedFilter.setAttribute('hidden', true)
  valueFilter.setAttribute('hidden', true)
  wirelessOptions.setAttribute('hidden', true)

  if (event.target.value !== '0') {
    // enabling select
    operatorFilter.removeAttribute('disabled');

    // handling what field display
    const selectedProperty = propertyFilterData.filter(
      property => property.name === selected)[0]
    const { name, type, values } = selectedProperty

    propertyType.value = type

    const optionValue = 'text,id'
    feedData(operatorFilter,
      handleOperatorsByPropertyType(type, operatorFilterData),
      optionValue)

    if (type === 'enumerated') {
      if (name === 'category') {
        return feedData(enumeratedFilter, values)
      }

    }
  } else {
    operatorFilter.setAttribute('disabled', true);
    operatorFilter.firstElementChild.setAttribute('selected', true)
  }
})

operatorFilter.addEventListener('change', () => {
  const property = propertyType.value

  if (property === 'enumerated') {
    if (propertyFilter.value === 'wireless') {
      return wirelessOptions.removeAttribute('hidden');
    }

    valueFilter.setAttribute('hidden', true)

    return enumeratedFilter.removeAttribute('hidden');
  }

  enumeratedFilter.setAttribute('hidden', true)

  let inputType = property === 'string' ? 'text' : 'number'

  valueFilter.setAttribute('type', inputType)
  valueFilter.removeAttribute('hidden')
})

enumeratedFilter.addEventListener('change', () => {
  let selected = []

  for (const option of enumeratedFilter.options) {
    if (option.selected) {
      selected.push(option.value);
    }
  }

  // TODO: debounce
  console.log(selected);
})
