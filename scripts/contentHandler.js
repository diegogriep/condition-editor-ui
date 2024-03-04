import { debounce, feedData, filterResults, handleOperatorsByPropertyType, mountTable } from "./utils.js"

function contentHandler() {
  // database
  const data = window.datastore
  const products = data.getProducts()

  // table data
  mountTable(products)

  const ui = {
    propertyFilter: document.getElementById('propertyFilter'),
    operatorFilter: document.getElementById('operatorFilter'),
    enumeratedFilter: document.getElementById('enumeratedFilter'),
    valueFilter: document.getElementById('valueFilter'),
    propertyType: document.getElementById('propertyType'),
    clearButton: document.getElementById('clearButton'),
  }

  const propertyFilterData = data.getProperties().map(property => property)
  const operatorFilterData = data.getOperators().map(property => property)

  const optionKeyValue = 'name,id'
  feedData(ui.propertyFilter, propertyFilterData, optionKeyValue)

  ui.propertyFilter.addEventListener('change', (event) => {
    let selected = parseInt(event.target.value)
    ui.enumeratedFilter.setAttribute('hidden', true)
    ui.valueFilter.setAttribute('hidden', true)

    if (event.target.value) {
      ui.clearButton.removeAttribute('disabled')

      // enabling select
      ui.operatorFilter.removeAttribute('disabled');

      // handling what field display
      const selectedProperty = propertyFilterData.filter(
        property => property.id === selected)[0]
      const { type, values } = selectedProperty

      ui.propertyType.value = type

      const optionValue = 'text,id'
      feedData(ui.operatorFilter,
        handleOperatorsByPropertyType(type, operatorFilterData),
        optionValue)

      if (type === 'enumerated') {
        return feedData(ui.enumeratedFilter, values)
      }
    } else {
      clearAll()
    }
  })

  ui.operatorFilter.addEventListener('change', () => {
    const property = ui.propertyType.value
    const operator = ui.operatorFilter.value

    if (property === 'enumerated') {
      ui.enumeratedFilter.removeAttribute('hidden');

      ui.valueFilter.setAttribute('hidden', true)

    } else {
      ui.enumeratedFilter.setAttribute('hidden', true)
    }

    if (property === 'string' || property === 'number') {
      ui.valueFilter.removeAttribute('hidden')
    }

    if (operator === 'any' || operator === 'none') {
      ui.enumeratedFilter.setAttribute('hidden', true)
      ui.valueFilter.setAttribute('hidden', true)
      filterResults(
        products,
        '',
        ui.operatorFilter.value,
        property,
        ui.propertyFilter.value,
      );

    }
  })

  ui.enumeratedFilter.addEventListener('change', () => {
    let selected = []

    for (const option of ui.enumeratedFilter.options) {
      if (option.selected) {
        selected.push(option.value)
      }
    }

    debouncedUserInput(selected)
  })

  const debouncedUserInput = debounce((inputValue) =>
    filterResults(
      products,
      inputValue,
      ui.operatorFilter.value,
      ui.propertyType.value,
      ui.propertyFilter.value,
    ))

  ui.valueFilter.addEventListener('keyup', (event) => {
    const inputValue = event.target.value

    debouncedUserInput(inputValue)
  })

  const clearAll = () => {
    ui.propertyFilter.value = ''
    ui.clearButton.setAttribute('disabled', true);
    ui.enumeratedFilter.setAttribute('hidden', true)
    ui.valueFilter.setAttribute('hidden', true)
    ui.valueFilter.value = ''
    ui.operatorFilter.setAttribute('disabled', true);
    ui.operatorFilter.value =''
    mountTable(products)
  }

  ui.clearButton.addEventListener('click', (event) => {
    event.preventDefault()
    clearAll()
  })
}

export default contentHandler
