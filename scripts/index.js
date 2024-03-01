import { feedData, filterResults, handleOperatorsByPropertyType, mountTable } from "./utils.js"

(function() {
  'use strict';
  // database
  const data = window.datastore
  const products = data.getProducts()

  // table data
  mountTable(products)

  // property filter
  const propertyFilter = document.getElementById('propertyFilter')

  // operator filter
  const operatorFilter = document.getElementById('operatorFilter')

  // enumerated filter
  const enumeratedFilter = document.getElementById('enumeratedFilter')

  // value filter options
  const valueFilter = document.getElementById('valueFilter')

  // property type
  const propertyType = document.getElementById('propertyType')

  // clear button
  const clearButton = document.getElementById('clearButton')

  const propertyFilterData = data.getProperties().map(property => property)
  const operatorFilterData = data.getOperators().map(property => property)

  const optionKeyValue = 'name,id'
  feedData(propertyFilter, propertyFilterData, optionKeyValue)

  propertyFilter.addEventListener('change', (event) => {
    let selected = parseInt(event.target.value)
    enumeratedFilter.setAttribute('hidden', true)
    valueFilter.setAttribute('hidden', true)

    if (event.target.value) {
      clearButton.removeAttribute('disabled')

      // enabling select
      operatorFilter.removeAttribute('disabled');

      // handling what field display
      const selectedProperty = propertyFilterData.filter(
        property => property.id === selected)[0]
      const { name, type, values } = selectedProperty

      propertyType.value = type

      const optionValue = 'text,id'
      feedData(operatorFilter,
        handleOperatorsByPropertyType(type, operatorFilterData),
        optionValue)

      if (type === 'enumerated') {
        return feedData(enumeratedFilter, values)
      }
    } else {
      clearAll()
    }
  })

  operatorFilter.addEventListener('change', () => {
    const property = propertyType.value
    const operator = operatorFilter.value

    if (property === 'enumerated') {
      enumeratedFilter.removeAttribute('hidden');

      valueFilter.setAttribute('hidden', true)

    } else {
      enumeratedFilter.setAttribute('hidden', true)
    }

    if (property === 'string' || property === 'number') {
      valueFilter.removeAttribute('hidden')
    }

    if (operator !== 'any' && operator !== 'none') {
      // valueFilter.removeAttribute('hidden')
    } else {
      enumeratedFilter.setAttribute('hidden', true)
      valueFilter.setAttribute('hidden', true)
      filterResults(
        products,
        '',
        operatorFilter.value,
        propertyType.value,
        propertyFilter.value,
      );

    }
  })

  enumeratedFilter.addEventListener('change', () => {
    let selected = []

    for (const option of enumeratedFilter.options) {
      if (option.selected) {
        selected.push(option.value);
      }
    }

    filterResults(
      products,
      selected,
      operatorFilter.value,
      propertyType.value,
      propertyFilter.value,
    );
  })

  valueFilter.addEventListener('blur', (event) => {
    const inputValue = event.target.value

    inputValue &&
      filterResults(
        products,
        inputValue,
        operatorFilter.value,
        propertyType.value,
        propertyFilter.value,
      );
  })

  const clearAll = () => {
    propertyFilter.firstElementChild.setAttribute('selected', true)
    clearButton.setAttribute('disabled', true);
    enumeratedFilter.setAttribute('hidden', true)
    valueFilter.setAttribute('hidden', true)
    operatorFilter.setAttribute('disabled', true);
    operatorFilter.firstElementChild.setAttribute('selected', true)
    mountTable(products)
  }

  clearButton.addEventListener('click', (event) => {
    event.preventDefault()
    clearAll()
  })
})();
